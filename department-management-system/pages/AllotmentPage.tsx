import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import type { Faculty, Subject, Batch, SubjectAllotment } from '../types';

interface AllotmentPageProps {
  faculty: Faculty[];
  subjects: Subject[];
  batches: Batch[];
  allotments: SubjectAllotment[];
  onAddAllotment: (allotment: { faculty: string, subject: string }) => Promise<void>;
}

const AllotmentPage: React.FC<AllotmentPageProps> = ({ faculty, subjects, batches, allotments, onAddAllotment }) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  const availableSubjects = useMemo(() => {
    if (!selectedBatchId) return [];
    
    const allottedSubjectIds = allotments
      .filter(a => a.subject.batch === Number(selectedBatchId))
      .map(a => a.subject.id);
      
    return subjects
      .filter(s => s.batch === Number(selectedBatchId) && !allottedSubjectIds.includes(s.id));
  }, [selectedBatchId, subjects, allotments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFacultyId && selectedSubjectId) {
      onAddAllotment({ faculty: selectedFacultyId, subject: selectedSubjectId });
      setSelectedSubjectId('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Faculty Allotment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Allotment List ({allotments.length})</h2>
            {allotments.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Faculty</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject Name</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {allotments.map(a => (
                        <tr key={a.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{a.faculty.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{a.subject.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{a.subject.name}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-300">No subject allotments have been made yet.</p>
            )}
          </Card>
        </div>
        <div>
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">New Allotment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Batch</label>
                <select id="batch" value={selectedBatchId} onChange={e => setSelectedBatchId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" required>
                  <option value="">-- Select a Batch --</option>
                  {batches.map(b => <option key={b.id} value={b.id}>Sem {b.semester} ({b.year})</option>)}
                </select>
              </div>

              {selectedBatchId && (
                <>
                  <div>
                    <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Faculty</label>
                    <select id="faculty" value={selectedFacultyId} onChange={e => setSelectedFacultyId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" required>
                      <option value="">-- Select Faculty --</option>
                      {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Subject</label>
                    <select id="subject" value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" required>
                      <option value="">-- Select Subject --</option>
                      {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                    </select>
                     {availableSubjects.length === 0 && <p className="text-xs text-yellow-500 mt-1">All subjects in this batch are already allotted.</p>}
                  </div>
                  <button type="submit" className="w-full bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition-colors" disabled={!selectedBatchId || !selectedFacultyId || availableSubjects.length === 0}>
                    Allot Subject
                  </button>
                </>
              )}
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AllotmentPage;
