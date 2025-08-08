import React, { useState, useMemo } from 'react';
import type { Faculty, Subject, SubjectAllotment, Batch } from '../types';
import Card from '../components/Card';

interface AllotmentPageProps {
  faculty: Faculty[];
  subjects: Subject[];
  allotments: SubjectAllotment[];
  batches: Batch[];
  onAddAllotment: (allotment: { facultyId: string, subjectId: string }) => Promise<void>;
}

const AllotmentPage: React.FC<AllotmentPageProps> = ({ faculty, subjects, allotments, batches, onAddAllotment }) => {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFacultyId && selectedSubjectId) {
      onAddAllotment({ facultyId: selectedFacultyId, subjectId: selectedSubjectId });
      setSelectedFacultyId('');
      setSelectedSubjectId('');
    }
  };

  const subjectDetails = useMemo(() => {
    return subjects.map(subject => {
        const batch = batches.find(b => b.id === subject.batch);
        return {
            ...subject,
            batchInfo: batch ? `Sem ${batch.semester} (${batch.year})` : 'N/A'
        }
    });
  }, [subjects, batches]);

  const allotmentDetails = useMemo(() => {
    return allotments.map(allotment => {
      const facultyMember = faculty.find(f => f.id === allotment.faculty);
      const subject = subjectDetails.find(s => s.id === allotment.subject);
      return {
        id: allotment.id,
        facultyName: facultyMember?.name || 'N/A',
        subjectName: subject?.name || 'N/A',
        batchInfo: subject?.batchInfo || 'N/A',
      };
    });
  }, [allotments, faculty, subjectDetails]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card title="Allot Subject to Faculty">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="facultySelect" className="block text-sm font-medium text-gray-300">Select Faculty</label>
              <select id="facultySelect" value={selectedFacultyId} onChange={(e) => setSelectedFacultyId(e.target.value)} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                <option value="" disabled>-- Choose Faculty --</option>
                {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="subjectSelect" className="block text-sm font-medium text-gray-300">Select Subject</label>
              <select id="subjectSelect" value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                <option value="" disabled>-- Choose Subject --</option>
                {subjectDetails.map(s => <option key={s.id} value={s.id}>{s.name} ({s.batchInfo})</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-colors">
              Allot Subject
            </button>
          </form>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card title="Current Allotments">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Faculty Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subject Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Batch</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {allotmentDetails.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.facultyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.subjectName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.batchInfo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AllotmentPage;
