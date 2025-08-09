import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Subject, Batch } from '../types';
import Card from '../components/Card';
import Papa from 'papaparse';
import { UploadIcon } from '../components/icons/UploadIcon';
import { LeftArrowIcon } from '../components/icons/LeftArrowIcon';

interface ManageBatchSubjectsPageProps {
  batches: Batch[];
  subjects: Subject[];
  onAddSubjects: (subjects: Omit<Subject, 'batch'>[], batchId: string) => Promise<void>;
  onClearSubjects: (batchId: string) => Promise<void>;
}

const ManageBatchSubjectsPage: React.FC<ManageBatchSubjectsPageProps> = ({ batches, subjects, onAddSubjects, onClearSubjects }) => {
  const { batchId } = useParams<{ batchId: string }>();
  const [isProcessing, setIsProcessing] = useState(false);

  const currentBatch = useMemo(() => {
    if (!batchId) return null;
    return batches.find(b => b.id === Number(batchId));
  }, [batches, batchId]);

  const subjectsInBatch = useMemo(() => {
    if (!batchId) return [];
    return subjects.filter(s => s.batch === Number(batchId));
  }, [subjects, batchId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!batchId) return;
    
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    Papa.parse<Omit<Subject, 'batch'>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (!results.data.length || !('id' in results.data[0]) || !('name' in results.data[0])) {
          alert('Invalid CSV format. Please ensure the headers are "id" and "name".');
          setIsProcessing(false);
          event.target.value = '';
          return;
        }

        const newSubjects = results.data
          .map(row => ({
            id: row.id?.trim(),
            name: row.name?.trim(),
          }))
          .filter(subject => subject.id && subject.name);

        if (newSubjects.length > 0) {
          await onAddSubjects(newSubjects, batchId);
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
    if (!batchId) return;
    if (confirm(`Are you sure you want to delete all ${subjectsInBatch.length} subjects from this batch? This action cannot be undone.`)) {
      setIsProcessing(true);
      await onClearSubjects(batchId);
      setIsProcessing(false);
    }
  };

  if (!currentBatch) {
    return (
      <Card title="Error: Batch Not Found">
        <div className="text-center">
          <p className="text-gray-400">The batch you are looking for does not exist.</p>
          <Link to="/batches/create" className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800">
            <LeftArrowIcon />
            <span className="ml-2">Go Back to Batches</span>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
        <Link to="/batches/create" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors group">
            <LeftArrowIcon className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Batch Selection
        </Link>
        <Card title={`Manage Subjects for Semester ${currentBatch.semester} (${currentBatch.year})`}>
            <div className="space-y-6">
                {/* --- Upload Section --- */}
                <div>
                    <h4 className="text-lg font-medium text-gray-200 mb-2">Import from CSV</h4>
                    <p className="text-sm text-gray-400 mb-4">
                    File must have headers: <code>id,name</code>.
                    </p>
                    <label htmlFor="csv-upload" className={`w-full sm:w-auto cursor-pointer bg-secondary text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors inline-flex items-center justify-center ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <UploadIcon />
                    {isProcessing ? 'Processing...' : 'Upload Subjects CSV'}
                    </label>
                    <input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={isProcessing} />
                </div>
                
                {/* --- Subject List Section --- */}
                <div className="pt-6 border-t border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                        <h3 className="text-xl font-semibold text-white">Subject List ({subjectsInBatch.length})</h3>
                        {subjectsInBatch.length > 0 && (
                            <button onClick={handleClearSubjects} disabled={isProcessing} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
                                Clear All Subjects
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
                            {subjectsInBatch.length > 0 ? (
                                subjectsInBatch.map((subject) => (
                                <tr key={subject.id} className="hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{subject.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{subject.id}</td>
                                </tr>
                                ))
                            ) : (
                                <tr><td colSpan={2} className="text-center py-8 text-gray-400">No subjects found for this batch. Upload a CSV to add them.</td></tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Card>
    </div>
  );
};

export default ManageBatchSubjectsPage;