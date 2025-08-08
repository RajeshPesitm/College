import React, { useState, useMemo } from 'react';
import type { Student, Batch } from '../types';
import Card from '../components/Card';
import Papa from 'papaparse';
import { UploadIcon } from '../components/icons/UploadIcon';

interface ManageBatchStudentsPageProps {
  batches: Batch[];
  students: Student[];
  onAddStudents: (students: Omit<Student, 'id' | 'batch'>[], batchId: string) => Promise<void>;
  onClearStudents: (batchId: string) => Promise<void>;
}

const ManageBatchStudentsPage: React.FC<ManageBatchStudentsPageProps> = ({ batches, students, onAddStudents, onClearStudents }) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const studentsInBatch = useMemo(() => {
    if (!selectedBatchId) return [];
    return students.filter(s => s.batch === Number(selectedBatchId));
  }, [students, selectedBatchId]);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedBatchId) {
      alert("Please select a batch first.");
      event.target.value = '';
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    Papa.parse<Omit<Student, 'id' | 'batch'>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (!results.data.length || !('name' in results.data[0]) || !('usn' in results.data[0])) {
          alert('Invalid CSV format. Please ensure the headers are "name" and "usn".');
          setIsProcessing(false);
          return;
        }

        const newStudents = results.data
          .map(row => ({
            name: row.name?.trim(),
            usn: row.usn?.trim(),
          }))
          .filter(student => student.name && student.usn);

        if (newStudents.length > 0) {
          await onAddStudents(newStudents, selectedBatchId);
        } else {
          alert('No valid student data found in the file.');
        }

        setIsProcessing(false);
        event.target.value = '';
      },
      error: (error) => {
        alert(`Error parsing file: ${error.message}`);
        setIsProcessing(false);
        event.target.value = '';
      }
    });
  };

  const handleClearStudents = async () => {
    if (!selectedBatchId) return;
    if (confirm(`Are you sure you want to delete all ${studentsInBatch.length} students from this batch? This action cannot be undone.`)) {
        setIsProcessing(true);
        await onClearStudents(selectedBatchId);
        setIsProcessing(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card title="Manage Students">
          <div className="space-y-4">
              <div>
                <label htmlFor="batchSelect" className="block text-sm font-medium text-gray-300">Select Batch</label>
                <select id="batchSelect" value={selectedBatchId} onChange={(e) => setSelectedBatchId(e.target.value)} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="" disabled>-- Choose a Batch --</option>
                  {batches.map(b => <option key={b.id} value={b.id}>Semester {b.semester} ({b.year})</option>)}
                </select>
              </div>

              {selectedBatchId && (
                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-lg font-medium text-gray-200 mb-2">Import from CSV</h4>
                  <p className="text-sm text-gray-400 mb-4">
                      File must have headers: <code>name,usn</code>.
                  </p>
                  <label htmlFor="csv-upload" className={`w-full cursor-pointer bg-secondary text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors inline-flex items-center justify-center ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <UploadIcon />
                      {isProcessing ? 'Processing...' : 'Upload Students CSV'}
                  </label>
                  <input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={isProcessing} />
                </div>
              )}
          </div>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Student List</h3>
            {selectedBatchId && studentsInBatch.length > 0 && (
                <button onClick={handleClearStudents} disabled={isProcessing} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
                    Clear All
                </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">USN</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {selectedBatchId ? (
                    studentsInBatch.length > 0 ? (
                        studentsInBatch.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.usn}</td>
                          </tr>
                        ))
                    ) : (
                        <tr><td colSpan={2} className="text-center py-4 text-gray-400">No students found for this batch.</td></tr>
                    )
                ) : (
                    <tr><td colSpan={2} className="text-center py-4 text-gray-400">Please select a batch to view students.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManageBatchStudentsPage;
