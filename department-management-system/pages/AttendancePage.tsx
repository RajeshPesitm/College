import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import type { Student, Subject, Batch, AttendanceRecord, SubjectAllotment } from '../types';

interface AttendancePageProps {
  students: Student[];
  subjects: Subject[];
  batches: Batch[];
  allotments: SubjectAllotment[];
  onAddAttendanceRecords: (records: Omit<AttendanceRecord, 'id'>[]) => Promise<void>;
}

type AttendanceStatus = 'present' | 'absent';

const AttendancePage: React.FC<AttendancePageProps> = ({ students, batches, allotments, onAddAttendanceRecords }) => {
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});

  const allottedSubjectsForBatch = useMemo(() => {
    if (!selectedBatchId) return [];
    const batchAllotments = allotments.filter(a => a.subject.batch === Number(selectedBatchId));
    return batchAllotments.map(a => a.subject);
  }, [selectedBatchId, allotments]);

  const studentsForBatch = useMemo(() => {
    if (!selectedBatchId) return [];
    return students.filter(s => s.batch === Number(selectedBatchId));
  }, [selectedBatchId, students]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: AttendanceStatus) => {
    const newAttendance: Record<number, AttendanceStatus> = {};
    studentsForBatch.forEach(student => {
        newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const records: Omit<AttendanceRecord, 'id'>[] = Object.entries(attendance).map(([studentId, status]) => ({
      student: Number(studentId),
      subject: selectedSubjectId,
      date,
      status,
    }));
    
    if (records.length !== studentsForBatch.length) {
        alert("Please mark attendance for all students.");
        return;
    }

    if (records.length > 0) {
      onAddAttendanceRecords(records);
      setAttendance({}); // Reset for next time
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Take Attendance</h1>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <label htmlFor="batch-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch</label>
            <select id="batch-select" value={selectedBatchId} onChange={e => {setSelectedBatchId(e.target.value); setSelectedSubjectId(''); setAttendance({})}} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
              <option value="">-- Select Batch --</option>
              {batches.map(b => <option key={b.id} value={b.id}>Sem {b.semester} ({b.year})</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
            <select id="subject-select" value={selectedSubjectId} onChange={e => {setSelectedSubjectId(e.target.value); setAttendance({})}} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" disabled={!selectedBatchId}>
              <option value="">-- Select Subject --</option>
              {allottedSubjectsForBatch.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" disabled={!selectedSubjectId} />
          </div>
        </div>

        {selectedSubjectId && studentsForBatch.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Student List ({studentsForBatch.length})</h2>
                <div className="flex gap-2">
                    <button type="button" onClick={() => markAll('present')} className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-1 px-3 rounded-full hover:bg-green-200 dark:hover:bg-green-800">Mark All Present</button>
                    <button type="button" onClick={() => markAll('absent')} className="text-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 py-1 px-3 rounded-full hover:bg-red-200 dark:hover:bg-red-800">Mark All Absent</button>
                </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">USN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {studentsForBatch.map(student => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.usn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                            <label className={`cursor-pointer px-3 py-1 text-xs rounded-full ${attendance[student.id] === 'present' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                <input type="radio" name={`status-${student.id}`} value="present" checked={attendance[student.id] === 'present'} onChange={() => handleStatusChange(student.id, 'present')} className="sr-only"/>
                                Present
                            </label>
                            <label className={`cursor-pointer px-3 py-1 text-xs rounded-full ${attendance[student.id] === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                <input type="radio" name={`status-${student.id}`} value="absent" checked={attendance[student.id] === 'absent'} onChange={() => handleStatusChange(student.id, 'absent')} className="sr-only"/>
                                Absent
                            </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="submit" className="mt-6 w-full bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition-colors">
              Submit Attendance
            </button>
          </form>
        )}
         {selectedBatchId && allottedSubjectsForBatch.length === 0 && (
             <p className="text-center text-gray-500 dark:text-gray-400 mt-6">No subjects have been allotted for this batch. Please go to the Allotment page first.</p>
         )}
         {selectedSubjectId && studentsForBatch.length === 0 && (
             <p className="text-center text-gray-500 dark:text-gray-400 mt-6">No students found in this batch. Please add students first.</p>
         )}

      </Card>
    </div>
  );
};

export default AttendancePage;
