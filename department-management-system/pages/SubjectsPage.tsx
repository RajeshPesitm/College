import React, { useState, useMemo } from 'react';
import type { Subject, Batch } from '../types';
import Card from '../components/Card';
import Papa from 'papaparse';
import { UploadIcon } from '../components/icons/UploadIcon';

interface ManageBatchSubjectsPageProps {
  batches: Batch[];
  subjects: Subject[];
  onAddSubjects: (subjects: Omit<Subject, 'batchId'>[], batchId: string) => Promise<void>;
  onClearSubjects: (batchId: string) => Promise<void>;
}

const ManageBatchSubjectsPage: React.FC<ManageBatchSubjectsPageProps> = ({ batches, subjects, onAddSubjects, onClearSubjects }) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subjectsInBatch = useMemo(() => {
    if (!selectedBatchId) return [];
    return subjects.filter(s => s.batchId === selectedBatchId);
  }, [subjects, selectedBatchId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedBatchId) {
      alert("Please select a batch first.");
      event.target.value = '';
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    Papa.parse<Omit<Subject, 'batchId'>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (!results.data.length || !('id' in results.data[0]) || !('name' in results.data[0])) {
          alert('Invalid CSV format. Please ensure the headers are "id" and "name".');
          setIsProcessing(false);
          return;
        }

        const newSubjects = results.data
          .map(row => ({
            id: row.id?.trim(),
            name: row.name?.trim(),
          }))
          .filter(subject => subject.id && subject.name);

        if (newSubjects.length > 0) {
          await onAddSubjects(newSubjects, selectedBatchId);
        } else {
          alert('No valid subject data found in the file.');
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

  const handleClearSubjects = async () => {
    if (!selectedBatchId) return;
    if (confirm(`Are you sure you want to delete all ${subjectsInBatch.length} subjects from this batch? This action cannot be undone.`)) {
      setIsProcessing(true);
      await onClearSubjects(selectedBatchId);
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card title="Manage Subjects">
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
                  File must have headers: <code>id,name</code>.
                </p>
                <label htmlFor="csv-upload" className={`w-full cursor-pointer bg-secondary text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors inline-flex items-center justify-center ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <UploadIcon />
                  {isProcessing ? 'Processing...' : 'Upload Subjects CSV'}
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
            <h3 className="text-xl font-semibold text-white">Subject List</h3>
            {selectedBatchId && subjectsInBatch.length > 0 && (
                <button onClick={handleClearSubjects} disabled={isProcessing} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
                    Clear All
                </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subject ID</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {selectedBatchId ? (
                  subjectsInBatch.length > 0 ? (
                    subjectsInBatch.map((subject) => (
                      <tr key={subject.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{subject.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{subject.id}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={2} className="text-center py-4 text-gray-400">No subjects found for this batch.</td></tr>
                  )
                ) : (
                    <tr><td colSpan={2} className="text-center py-4 text-gray-400">Please select a batch to view subjects.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManageBatchSubjectsPage;