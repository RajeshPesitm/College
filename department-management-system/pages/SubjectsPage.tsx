import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import UploadIcon from '../components/icons/UploadIcon';
import type { Batch, Subject } from '../types';

interface SubjectsPageProps {
  batches: Batch[];
  subjects: Subject[];
  onAddSubjects: (newSubjects: { id: string, name: string }[], batchId: string) => Promise<void>;
  onClearSubjects: (batchId: string) => Promise<void>;
}

const SubjectsPage: React.FC<SubjectsPageProps> = ({ batches, subjects, onAddSubjects, onClearSubjects }) => {
  const { batchId } = useParams<{ batchId: string }>();
  const [pastedData, setPastedData] = useState('');

  const currentBatch = useMemo(() => batches.find(b => b.id === Number(batchId)), [batches, batchId]);
  const batchSubjects = useMemo(() => subjects.filter(s => s.batch === Number(batchId)).sort((a, b) => a.id.localeCompare(b.id)), [subjects, batchId]);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedData.trim() || !batchId) return;

    const lines = pastedData.trim().split('\n');
    const newSubjects = lines.map(line => {
      const [id, name] = line.split(/[,\t]/).map(s => s.trim());
      return { id, name };
    }).filter(s => s.id && s.name);

    if(newSubjects.length > 0) {
      await onAddSubjects(newSubjects, batchId);
      setPastedData('');
    } else {
      alert("Could not parse any subjects. Ensure each line has 'SubjectCode,SubjectName' or 'SubjectCode\tSubjectName'.");
    }
  };
  
  const handleClear = () => {
    if (batchId && window.confirm(`Are you sure you want to delete all ${batchSubjects.length} subjects from this batch? This action cannot be undone.`)) {
      onClearSubjects(batchId);
    }
  }

  if (!currentBatch) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Batch not found. <Link to="/create-batch" className="text-primary-500 hover:underline">Go to Batches</Link></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Subjects</h1>
            <p className="text-gray-500 dark:text-gray-400">Semester {currentBatch.semester}, {currentBatch.year}</p>
        </div>
        {batchSubjects.length > 0 && (
             <button onClick={handleClear} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors">
                Clear All Subjects
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Subject List ({batchSubjects.length})</h2>
                {batchSubjects.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {batchSubjects.map(subject => (
                            <tr key={subject.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{subject.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{subject.name}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">No subjects added to this batch yet. Use the form to import them.</p>
                )}
            </Card>
        </div>
        <div>
            <Card>
                <form onSubmit={handleImport}>
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Import Subjects</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Paste subject data below, one per line, with code and name separated by a comma or tab.</p>
                <textarea
                    value={pastedData}
                    onChange={(e) => setPastedData(e.target.value)}
                    rows={10}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="22CS51,Database Systems&#10;22CS52,Computer Networks"
                />
                <button type="submit" className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition-colors">
                    <UploadIcon className="w-5 h-5" />
                    Import
                </button>
                </form>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;
