import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { BatchIcon } from '../components/icons/BatchIcon';
import { FacultyIcon } from '../components/icons/FacultyIcon';
import { AllotmentIcon } from '../components/icons/AllotmentIcon';
import { AttendanceIcon } from '../components/icons/AttendanceIcon';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Welcome to the <span className="text-blue-500">Department Management System</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
          Your central hub for managing students, faculty, and subject allotments efficiently.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Link to="/batches/students" className="transform hover:scale-105 transition-transform duration-300">
          <Card className="h-full bg-blue-900/50 hover:bg-blue-800/60">
            <div className="flex flex-col items-center text-center">
              <BatchIcon />
              <h2 className="mt-4 text-2xl font-bold text-white">Manage Batches</h2>
              <p className="mt-2 text-gray-300">Organize students and subjects by batch.</p>
            </div>
          </Card>
        </Link>
        <Link to="/faculty" className="transform hover:scale-105 transition-transform duration-300">
          <Card className="h-full bg-indigo-900/50 hover:bg-indigo-800/60">
            <div className="flex flex-col items-center text-center">
              <FacultyIcon />
              <h2 className="mt-4 text-2xl font-bold text-white">Manage Faculty</h2>
              <p className="mt-2 text-gray-300">Maintain records of all faculty members.</p>
            </div>
          </Card>
        </Link>
        <Link to="/allotment" className="transform hover:scale-105 transition-transform duration-300">
          <Card className="h-full bg-purple-900/50 hover:bg-purple-800/60">
            <div className="flex flex-col items-center text-center">
              <AllotmentIcon />
              <h2 className="mt-4 text-2xl font-bold text-white">Subject Allotment</h2>
              <p className="mt-2 text-gray-300">Assign subjects to faculty members.</p>
            </div>
          </Card>
        </Link>
         <Link to="/attendance" className="transform hover:scale-105 transition-transform duration-300">
          <Card className="h-full bg-teal-900/50 hover:bg-teal-800/60">
            <div className="flex flex-col items-center text-center">
              <AttendanceIcon />
              <h2 className="mt-4 text-2xl font-bold text-white">Take Attendance</h2>
              <p className="mt-2 text-gray-300">Record daily student attendance.</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
