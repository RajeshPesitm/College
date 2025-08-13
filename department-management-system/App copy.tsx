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


const API_BASE_URL = 'http://localhost:8000/api';

// --- Helper for API requests ---
const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred.' }));
        const errorMessage = Object.values(errorData).flat().join('\n') || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }
    // For 204 No Content, there's no body to parse
    if (response.status === 204) {
        return null;
    }
    return response.json();
}


// --- App Component ---
const App: React.FC = () => {
    // Centralized state management, simulating data fetched from a backend
    const [batches, setBatches] = useState<Batch[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [allotments, setAllotments] = useState<SubjectAllotment[]>([]);
    const [loading, setLoading] = useState(true);

    // Simulate fetching initial data from the backend on app load
    useEffect(() => {
        const fetchData = async () => {
            console.log("API CALL: Fetching initial data from Django...");
            setLoading(true);
            try {
                const [batchesRes, studentsRes, facultyRes, subjectsRes, allotmentsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/batches/`),
                    fetch(`${API_BASE_URL}/students/`),
                    fetch(`${API_BASE_URL}/faculty/`),
                    fetch(`${API_BASE_URL}/subjects/`),
                    fetch(`${API_BASE_URL}/allotments/`),
                ]);

                // We can throw here if any response is not ok
                if (!batchesRes.ok || !studentsRes.ok || !facultyRes.ok || !subjectsRes.ok || !allotmentsRes.ok) {
                    throw new Error('Failed to fetch one or more resources.');
                }

                setBatches(await batchesRes.json());
                setStudents(await studentsRes.json());
                setFaculty(await facultyRes.json());
                setSubjects(await subjectsRes.json());
                setAllotments(await allotmentsRes.json());

                console.log("API CALL: Initial data loaded.");
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                alert(`Could not connect to the backend. Is the Django server running at ${API_BASE_URL}?`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- API handler functions ---

    const addBatch = async (batchData: Omit<Batch, 'id'>) => {
        console.log("API CALL: POST /api/batches/", batchData);
        try {
            const response = await fetch(`${API_BASE_URL}/batches/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(batchData)
            });
            const newBatch = await handleApiResponse(response);
            setBatches(prev => [...prev, newBatch]);
            alert(`Batch for Semester ${newBatch.semester} (${newBatch.year}) created successfully!`);
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };

    const addStudentsToBatch = async (newStudents: Omit<Student, 'id' | 'batch'>[], batchId: string) => {
        console.log(`API CALL: POST /api/batches/${batchId}/add_students/`, newStudents);
        try {
            const response = await fetch(`${API_BASE_URL}/batches/${batchId}/add_students/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudents)
            });
            const addedStudents = await handleApiResponse(response);
            // Refetch all students to get the most up-to-date list
            const studentsRes = await fetch(`${API_BASE_URL}/students/`);
            setStudents(await studentsRes.json());
            alert(`Successfully processed students. Added ${addedStudents.length} new students.`);
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };

    const clearStudentsFromBatch = async (batchId: string) => {
        console.log(`API CALL: DELETE /api/batches/${batchId}/clear_students/`);
        try {
            const response = await fetch(`${API_BASE_URL}/batches/${batchId}/clear_students/`, { method: 'DELETE' });
            await handleApiResponse(response);
            setStudents(prev => prev.filter(s => s.batch !== Number(batchId)));
            alert(`All students from the selected batch have been cleared.`);
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };

...
...


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
                        <Route path="/batches/create" element={<CreateBatchPage onAddBatch={addBatch} batches={batches} />} />
                        <Route path="/batches/students/:batchId" element={<ManageBatchStudentsPage batches={batches} students={students} onAddStudents={addStudentsToBatch} onClearStudents={clearStudentsFromBatch} />} />
                        <Route path="/batches/subjects/:batchId" element={<ManageBatchSubjectsPage batches={batches} subjects={subjects} onAddSubjects={addSubjectsToBatch} onClearSubjects={clearSubjectsFromBatch} />} />
                        <Route path="/faculty" element={<FacultyPage faculty={faculty} onAddFaculty={addFaculty} onClearFaculty={clearFaculty} />} />
                        <Route path="/allotment" element={<AllotmentPage faculty={faculty} subjects={subjects} batches={batches} allotments={allotments} onAddAllotment={addAllotment} />} />
                        <Route path="/attendance" element={<AttendancePage students={students} subjects={subjects} batches={batches} onAddAttendanceRecords={addAttendanceRecords} />} />
                    </Routes>
                </main>
            </div>
        </HashRouter>
    );
};

export default App;