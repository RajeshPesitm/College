import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import UploadIcon from '../components/icons/UploadIcon';
import type { Batch, Student } from '../types';

interface StudentsPageProps {
  batches: Batch[];
  students: Student[];
  onAddStudents: (newStudents: { name: string, usn: string }[], batchId: string) => Promise<void>;
  onClearStudents: (batchId: string) => Promise<void>;
}

const StudentsPage: React.FC<StudentsPageProps> = ({ batches, students, onAddStudents, onClearStudents }) => {
  const { batchId } = useParams<{ batchId: string }>();
  const [pastedData, setPastedData] = useState('');

  const currentBatch = useMemo(() => batches.find(b => b.id === Number(batchId)), [batches, batchId]);
  const batchStudents = useMemo(() => students.filter(s => s.batch === Number(batchId)).sort((a,b) => a.name.localeCompare(b.name)), [students, batchId]);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedData.trim() || !batchId) return;

    const lines = pastedData.trim().split('\n');
    const newStudents = lines.map(line => {
      const [name, usn] = line.split(/[,\t]/).map(s => s.trim());
      return { name, usn };
    }).filter(s => s.name && s.usn);

    if(newStudents.length > 0) {
      await onAddStudents(newStudents, batchId);
      setPastedData('');
    } else {
      alert("Could not parse any students. Ensure each line has 'Name,USN' or 'Name\tUSN'.");
    }
  };

  const handleClear = () => {
    if (batchId && window.confirm(`Are you sure you want to delete all ${batchStudents.length} students from this batch? This action cannot be undone.`)) {
      onClearStudents(batchId);
    }
  }

  if (!currentBatch) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Batch not found. <Link to="/create-batch" className="text-primary-500 hover:underline">Go to Batches</Link></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Students</h1>
          <p className="text-gray-500 dark:text-gray-400">Semester {currentBatch.semester}, {currentBatch.year}</p>
        </div>
        {batchStudents.length > 0 && (
          <button onClick={handleClear} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors">
            Clear All Students
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Student List ({batchStudents.length})</h2>
                {batchStudents.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">USN</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {batchStudents.map(student => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.usn}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">No students added to this batch yet. Use the form to import them.</p>
                )}
            </Card>
        </div>
        <div>
            <Card>
                <form onSubmit={handleImport}>
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Import Students</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Paste student data below, one per line, with name and USN separated by a comma or tab.</p>
                <textarea
                    value={pastedData}
                    onChange={(e) => setPastedData(e.target.value)}
                    rows={10}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="John Doe,1AB22CD001&#10;Jane Smith,1AB22CD002"
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

export default StudentsPage;
