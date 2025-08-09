import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import type { Student, Faculty, Subject, SubjectAllotment, AttendanceRecord, Batch } from './types';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StudentsPage from './pages/StudentsPage';
import FacultyPage from './pages/FacultyPage';
import SubjectsPage from './pages/SubjectsPage';
import AllotmentPage from './pages/AllotmentPage';
import AttendancePage from './pages/AttendancePage';
import CreateBatchPage from './pages/CreateBatchPage';

const API_BASE_URL = 'http://localhost:8000/api';

// --- Helper for API requests ---
const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred.' }));
        const errorMessage = Object.values(errorData).flat().join('\n') || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

const App: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allotments, setAllotments] = useState<SubjectAllotment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("API CALL: Fetching initial data...");
      setLoading(true);
      setError(null);
      try {
        const resources = ['batches', 'students', 'faculty', 'subjects', 'allotments'];
        const requests = resources.map(res => fetch(`${API_BASE_URL}/${res}/`).catch(e => { throw new Error(res)}));
        const responses = await Promise.all(requests);

        for(const res of responses) {
            if (!res.ok) {
                 throw new Error(`Failed to fetch ${res.url}. Status: ${res.status}`);
            }
        }
        
        const [batchesData, studentsData, facultyData, subjectsData, allotmentsData] = await Promise.all(responses.map(res => res.json()));

        setBatches(batchesData);
        setStudents(studentsData);
        setFaculty(facultyData);
        setSubjects(subjectsData);
        setAllotments(allotmentsData);

        console.log("API CALL: Initial data loaded.");
      } catch (error: any) {
          console.error("Failed to fetch initial data:", error);
          setError(`Could not connect to the backend. Is the Django server running at ${API_BASE_URL}? Check the console for more details.`);
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addBatch = async (batchData: Omit<Batch, 'id' | 'academic_year'>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/batches/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(batchData)
        });
        const newBatch = await handleApiResponse(response);
        setBatches(prev => [...prev, newBatch]);
        alert(`Batch for Semester ${newBatch.semester} (${newBatch.year}) created successfully!`);
    } catch (error: any) { alert(`Error creating batch: ${error.message}`); }
  };

  const addStudentsToBatch = async (newStudents: {name: string, usn: string}[], batchId: string) => {
      try {
          const response = await fetch(`${API_BASE_URL}/batches/${batchId}/add_students/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newStudents)
          });
          const addedStudents: Student[] = await handleApiResponse(response);
          setStudents(prev => [...prev.filter(s => s.batch !== Number(batchId)), ...addedStudents]);
          const freshStudents = await(await fetch(`${API_BASE_URL}/students/`)).json();
          setStudents(freshStudents);
          alert(`Successfully processed students. Added ${addedStudents.length} new students.`);
      } catch (error: any) { alert(`Error adding students: ${error.message}`); }
  };
    
  const clearStudentsFromBatch = async (batchId: string) => {
      try {
          await handleApiResponse(await fetch(`${API_BASE_URL}/batches/${batchId}/clear_students/`, { method: 'DELETE' }));
          setStudents(prev => prev.filter(s => s.batch !== Number(batchId)));
          alert(`All students from the selected batch have been cleared.`);
      } catch (error: any) { alert(`Error clearing students: ${error.message}`); }
  };

  const addSubjectsToBatch = async (newSubjects: {id: string, name: string}[], batchId: string) => {
      try {
          const response = await fetch(`${API_BASE_URL}/batches/${batchId}/add_subjects/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newSubjects)
          });
          const addedSubjects: Subject[] = await handleApiResponse(response);
          const freshSubjects = await(await fetch(`${API_BASE_URL}/subjects/`)).json();
          setSubjects(freshSubjects);
          alert(`Successfully processed subjects. Added ${addedSubjects.length} new subjects.`);
      } catch (error: any) { alert(`Error adding subjects: ${error.message}`); }
  };

  const clearSubjectsFromBatch = async (batchId: string) => {
      try {
          await handleApiResponse(await fetch(`${API_BASE_URL}/batches/${batchId}/clear_subjects/`, { method: 'DELETE' }));
          setSubjects(prev => prev.filter(s => s.batch !== Number(batchId)));
          alert(`All subjects from the selected batch have been cleared.`);
      } catch (error: any) { alert(`Error clearing subjects: ${error.message}`); }
  };
    
  const addFaculty = async (facultyMember: { id: string; name: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/faculty/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(facultyMember)
        });
        const newFaculty = await handleApiResponse(response);
        setFaculty(prev => [...prev, newFaculty]);
    } catch (error: any) { alert(`Error adding faculty: ${error.message}`); }
  };

  const addAllotment = async (allotment: { faculty: string, subject: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/allotments/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({faculty_id: allotment.faculty, subject_id: allotment.subject})
        });
        const newAllotment = await handleApiResponse(response);
        setAllotments(prev => [...prev, newAllotment]);
    } catch (error: any) { alert(`Error creating allotment: ${error.message}`); }
  };

  const addAttendanceRecords = async (records: Omit<AttendanceRecord, 'id'>[]) => {
    try {
        await handleApiResponse(await fetch(`${API_BASE_URL}/attendance/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(records)
        }));
        alert(`${records.length} attendance records submitted successfully!`);
    } catch(error: any) { alert(`Error submitting attendance: ${error.message}`); }
  };

  const PageWrapper: React.FC<{children: React.ReactNode}> = ({children}) => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);
    return <div key={location.pathname} className="animate-fadeIn">{children}</div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-2xl font-semibold">
        Loading Department Data...
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-red-900 text-white text-center p-8">
            <div>
                <h2 className="text-3xl font-bold mb-4">Connection Error</h2>
                <p className="text-lg">{error}</p>
            </div>
        </div>
    )
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 font-sans">
        <Navbar />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/create-batch" element={<PageWrapper><CreateBatchPage onAddBatch={addBatch} batches={batches} /></PageWrapper>} />
            <Route path="/batches/students/:batchId" element={<PageWrapper><StudentsPage batches={batches} students={students} onAddStudents={addStudentsToBatch} onClearStudents={clearStudentsFromBatch} /></PageWrapper>} />
            <Route path="/batches/subjects/:batchId" element={<PageWrapper><SubjectsPage batches={batches} subjects={subjects} onAddSubjects={addSubjectsToBatch} onClearSubjects={clearSubjectsFromBatch} /></PageWrapper>} />
            <Route path="/faculty" element={<PageWrapper><FacultyPage faculty={faculty} onAddFaculty={addFaculty} /></PageWrapper>} />
            <Route path="/allotment" element={<PageWrapper><AllotmentPage faculty={faculty} subjects={subjects} batches={batches} allotments={allotments} onAddAllotment={addAllotment} /></PageWrapper>} />
            <Route path="/attendance" element={<PageWrapper><AttendancePage students={students} subjects={subjects} batches={batches} allotments={allotments} onAddAttendanceRecords={addAttendanceRecords} /></PageWrapper>} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;