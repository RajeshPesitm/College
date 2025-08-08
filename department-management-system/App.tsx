import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import type { Student, Faculty, Subject, SubjectAllotment, AttendanceRecord, Batch } from './types';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ManageBatchStudentsPage from './pages/StudentsPage';
import FacultyPage from './pages/FacultyPage';
import ManageBatchSubjectsPage from './pages/SubjectsPage';
import AllotmentPage from './pages/AllotmentPage';
import AttendancePage from './pages/AttendancePage';
import CreateBatchPage from './pages/CreateBatchPage';


// --- MOCK API and DATABASE ---
// In a real app, this data would live in a Django database.
// These functions simulate making API calls to fetch/update that data.

const initialBatches: Batch[] = [
    { id: 'b1', year: 2024, semester: 5 },
    { id: 'b2', year: 2024, semester: 3 },
];

const initialStudents: Student[] = [
    { id: 'stu1', name: 'John Doe', usn: '1AB21CS001', batchId: 'b1' },
    { id: 'stu3', name: 'Peter Jones', usn: '1AB21CS003', batchId: 'b1' },
    { id: 'stu2', name: 'Jane Smith', usn: '1AB21CS002', batchId: 'b2' },
];

const initialFaculty: Faculty[] = [
    { id: 'F001', name: 'Dr. Alan Turing' },
    { id: 'F002', name: 'Dr. Ada Lovelace' },
];

const initialSubjects: Subject[] = [
    { id: 'S02', name: 'Algorithms', batchId: 'b1' },
    { id: 'S03', name: 'Database Systems', batchId: 'b1' },
    { id: 'S01', name: 'Data Structures', batchId: 'b2' },
];

const initialAllotments: SubjectAllotment[] = [
    { id: 'allot1', facultyId: 'F002', subjectId: 'S01' },
    { id: 'allot2', facultyId: 'F001', subjectId: 'S02' },
];

// --- App Component ---

const App: React.FC = () => {
  // Centralized state management, simulating data fetched from a backend
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allotments, setAllotments] = useState<SubjectAllotment[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching initial data from the backend on app load
  useEffect(() => {
    const fetchData = async () => {
      console.log("API CALL: Fetching initial data...");
      setLoading(true);
      // Simulate network delay
      await new Promise(res => setTimeout(res, 500));
      setBatches(initialBatches);
      setStudents(initialStudents);
      setFaculty(initialFaculty);
      setSubjects(initialSubjects);
      setAllotments(initialAllotments);
      setLoading(false);
      console.log("API CALL: Initial data loaded.");
    };
    fetchData();
  }, []);

  // --- API-like handler functions ---

  const addBatch = async (batchData: Omit<Batch, 'id'>) => {
    console.log("API CALL: POST /api/batches/", batchData);
    await new Promise(res => setTimeout(res, 300)); // Simulate network delay
    const newBatch: Batch = { ...batchData, id: `batch-${Date.now()}` };
    setBatches(prev => [...prev, newBatch]);
    alert(`Batch for Semester ${newBatch.semester} (${newBatch.year}) created successfully!`);
  };

  const addStudentsToBatch = async (newStudents: Omit<Student, 'id'>[], batchId: string) => {
      console.log(`API CALL: POST /api/batches/${batchId}/students`, newStudents);
      await new Promise(res => setTimeout(res, 300));
      
      const existingUsns = new Set(students.map(s => s.usn));
      const studentsToAdd: Student[] = [];
      const duplicateUsns: string[] = [];

      newStudents.forEach(newStudent => {
          if (existingUsns.has(newStudent.usn)) {
              duplicateUsns.push(newStudent.usn);
          } else {
              studentsToAdd.push({ ...newStudent, id: `stu-${newStudent.usn}` });
              existingUsns.add(newStudent.usn);
          }
      });
      
      setStudents(prev => [...prev, ...studentsToAdd]);
      
      let alertMessages = [];
      if (studentsToAdd.length > 0) alertMessages.push(`Successfully added ${studentsToAdd.length} new students.`);
      if (duplicateUsns.length > 0) alertMessages.push(`Ignored ${duplicateUsns.length} duplicates: ${duplicateUsns.join(', ')}.`);
      if(alertMessages.length > 0) alert(alertMessages.join('\n'));
  };

  const clearStudentsFromBatch = async (batchId: string) => {
      console.log(`API CALL: DELETE /api/batches/${batchId}/students`);
      await new Promise(res => setTimeout(res, 300));
      setStudents(prev => prev.filter(s => s.batchId !== batchId));
      alert(`All students from the selected batch have been cleared.`);
  };
    
  const addSubjectsToBatch = async (newSubjects: Omit<Subject, 'batchId'>[], batchId: string) => {
      console.log(`API CALL: POST /api/batches/${batchId}/subjects`, newSubjects);
      await new Promise(res => setTimeout(res, 300));

      const existingIds = new Set(subjects.map(s => s.id));
      const subjectsToAdd: Subject[] = [];
      const duplicateIds: string[] = [];

      newSubjects.forEach(newSub => {
          if (existingIds.has(newSub.id)) {
              duplicateIds.push(newSub.id);
          } else {
              subjectsToAdd.push({ ...newSub, batchId });
              existingIds.add(newSub.id);
          }
      });

      setSubjects(prev => [...prev, ...subjectsToAdd]);

      let alertMessages = [];
      if (subjectsToAdd.length > 0) alertMessages.push(`Successfully added ${subjectsToAdd.length} new subjects.`);
      if (duplicateIds.length > 0) alertMessages.push(`Ignored ${duplicateIds.length} duplicates: ${duplicateIds.join(', ')}.`);
      if (alertMessages.length > 0) alert(alertMessages.join('\n'));
  };

  const clearSubjectsFromBatch = async (batchId: string) => {
      console.log(`API CALL: DELETE /api/batches/${batchId}/subjects`);
      await new Promise(res => setTimeout(res, 300));
      setSubjects(prev => prev.filter(s => s.batchId !== batchId));
      alert(`All subjects from the selected batch have been cleared.`);
  };


  const addFaculty = async (facultyMember: Faculty) => {
    console.log("API CALL: POST /api/faculty/", facultyMember);
    await new Promise(res => setTimeout(res, 300));
    if (faculty.some(f => f.id === facultyMember.id)) {
        alert('Faculty with this ID already exists.');
        return;
    }
    setFaculty(prev => [...prev, facultyMember]);
  };

  const addAllotment = async (allotment: Omit<SubjectAllotment, 'id'>) => {
    console.log("API CALL: POST /api/allotments/", allotment);
    await new Promise(res => setTimeout(res, 300));
    const exists = allotments.some(a => a.facultyId === allotment.facultyId && a.subjectId === allotment.subjectId);
    if (!exists) {
        setAllotments(prev => [...prev, { ...allotment, id: `allot${Date.now()}` }]);
    } else {
        alert('This faculty member is already allotted to this subject.');
    }
  };
  
  const addAttendanceRecords = async (records: Omit<AttendanceRecord, 'id'>[]) => {
    console.log("API CALL: POST /api/attendance/", records);
    await new Promise(res => setTimeout(res, 300));
    const newRecordsWithIds = records.map(record => ({
      ...record,
      id: `att-${record.studentId}-${record.subjectId}-${record.date}`
    }));

    setAttendance(prev => {
        const updatedPrev = prev.filter(existing => 
            !newRecordsWithIds.some(newRecord => newRecord.id === existing.id)
        );
        return [...updatedPrev, ...newRecordsWithIds];
    });
    alert(`${records.length} attendance records submitted successfully!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark text-white text-2xl">
        Loading Department Data...
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-dark">
        <Navbar />
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/batches/create" element={<CreateBatchPage onAddBatch={addBatch} />} />
            <Route path="/batches/students" element={<ManageBatchStudentsPage batches={batches} students={students} onAddStudents={addStudentsToBatch} onClearStudents={clearStudentsFromBatch} />} />
            <Route path="/batches/subjects" element={<ManageBatchSubjectsPage batches={batches} subjects={subjects} onAddSubjects={addSubjectsToBatch} onClearSubjects={clearSubjectsFromBatch} />} />
            <Route path="/faculty" element={<FacultyPage faculty={faculty} onAddFaculty={addFaculty} />} />
            <Route path="/subjects" element={<ManageBatchSubjectsPage batches={batches} subjects={subjects} onAddSubjects={addSubjectsToBatch} onClearSubjects={clearSubjectsFromBatch} />} />
            <Route path="/allotment" element={<AllotmentPage faculty={faculty} subjects={subjects} batches={batches} allotments={allotments} onAddAllotment={addAllotment} />} />
            <Route path="/attendance" element={<AttendancePage students={students} subjects={subjects} batches={batches} onAddAttendanceRecords={addAttendanceRecords} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;