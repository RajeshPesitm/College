import React, { useState, useMemo, useEffect } from 'react';
import type { Student, Subject, AttendanceRecord, Batch } from '../types';
import Card from '../components/Card';

interface AttendancePageProps {
  students: Student[];
  subjects: Subject[];
  batches: Batch[];
  onAddAttendanceRecords: (records: Omit<AttendanceRecord, 'id'>[]) => Promise<void>;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ students, subjects, batches, onAddAttendanceRecords }) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, 'Present' | 'Absent'>>({});

  const subjectsInBatch = useMemo(() => {
    if (!selectedBatchId) return [];
    return subjects.filter(s => s.batchId === selectedBatchId);
  }, [subjects, selectedBatchId]);

  const relevantStudents = useMemo(() => {
    if (!selectedBatchId) return [];
    return students.filter(s => s.batchId === selectedBatchId);
  }, [students, selectedBatchId]);
  
  useEffect(() => {
      // Reset subject when batch changes
      setSelectedSubjectId('');
  }, [selectedBatchId]);

  useEffect(() => {
    const initialStatus: Record<string, 'Present' | 'Absent'> = {};
    relevantStudents.forEach(student => {
      initialStatus[student.id] = 'Present';
    });
    setAttendanceStatus(initialStatus);
  }, [relevantStudents]);

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent') => {
    setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !date || relevantStudents.length === 0) {
      alert('Please select a batch, a subject, and a date.');
      return;
    }
    const records: Omit<AttendanceRecord, 'id'>[] = relevantStudents.map(student => ({
      studentId: student.id,
      subjectId: selectedSubjectId,
      date,
      status: attendanceStatus[student.id] || 'Absent',
    }));
    onAddAttendanceRecords(records);
  };

  return (
    <div className="space-y-8">
      <Card title="Take Attendance">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="batchSelect" className="block text-sm font-medium text-gray-300">1. Select Batch</label>
              <select id="batchSelect" value={selectedBatchId} onChange={(e) => setSelectedBatchId(e.target.value)} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                <option value="" disabled>-- Choose Batch --</option>
                {batches.map(b => <option key={b.id} value={b.id}>Sem {b.semester} ({b.year})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="subjectSelect" className="block text-sm font-medium text-gray-300">2. Select Subject</label>
              <select id="subjectSelect" value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required disabled={!selectedBatchId}>
                <option value="" disabled>-- Choose Subject --</option>
                {subjectsInBatch.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="attendanceDate" className="block text-sm font-medium text-gray-300">3. Select Date</label>
              <input type="date" id="attendanceDate" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
          </div>
          {selectedSubjectId && (
            <div className="pt-4 border-t border-gray-700">
               <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-colors" disabled={relevantStudents.length === 0}>
                Submit Attendance for {relevantStudents.length} Student(s)
              </button>
            </div>
          )}
        </form>
      </Card>
      
      {selectedSubjectId && (
        <Card title={`Marking Attendance for Batch: Sem ${batches.find(b=>b.id===selectedBatchId)?.semester}`}>
          {relevantStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">USN</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {relevantStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.usn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name={`status-${student.id}`} value="Present" checked={attendanceStatus[student.id] === 'Present'} onChange={() => handleStatusChange(student.id, 'Present')} className="form-radio h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500" />
                                <span>Present</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name={`status-${student.id}`} value="Absent" checked={attendanceStatus[student.id] === 'Absent'} onChange={() => handleStatusChange(student.id, 'Absent')} className="form-radio h-4 w-4 text-pink-600 bg-gray-700 border-gray-600 focus:ring-pink-500" />
                                <span>Absent</span>
                            </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-400 py-4">No students found for this batch.</p>
          )}
        </Card>
      )}
    </div>
  );
};

export default AttendancePage;
