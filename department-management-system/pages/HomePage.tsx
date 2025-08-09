//import React from 'react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import StudentIcon from '../components/icons/StudentIcon';
import FacultyIcon from '../components/icons/FacultyIcon';
import SubjectIcon from '../components/icons/SubjectIcon';
import BatchIcon from '../components/icons/BatchIcon';
import AllotmentIcon from '../components/icons/AllotmentIcon';
import AttendanceIcon from '../components/icons/AttendanceIcon';
import axios from 'axios';




const HomePage: React.FC = () => {
  const [statsData, setStatsData] = useState({
    students: 0,
    faculty: 0,
    subjects: 0,
    batches: 0,
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/stats/')
      .then(res => setStatsData(res.data))
      .catch(err => console.error("Failed to load stats:", err));
  }, []);

  const stats = [
    { title: 'Total Students', value: statsData.students, icon: <StudentIcon className="w-8 h-8 text-blue-500" /> },
    { title: 'Total Faculty', value: statsData.faculty, icon: <FacultyIcon className="w-8 h-8 text-green-500" /> },
    { title: 'Total Subjects', value: statsData.subjects, icon: <SubjectIcon className="w-8 h-8 text-purple-500" /> },
    { title: 'Active Batches', value: statsData.batches, icon: <BatchIcon className="w-8 h-8 text-yellow-500" /> },
  ];

  const mainNavItems = [
    { to: '/create-batch', title: 'Manage Batches', description: 'Organize students and subjects by batch.', icon: <BatchIcon className="w-12 h-12 text-white" />, color: 'from-blue-500 to-blue-600', hover: 'hover:from-blue-600 hover:to-blue-700' },
    { to: '/faculty', title: 'Manage Faculty', description: 'Maintain records of all faculty members.', icon: <FacultyIcon className="w-12 h-12 text-white" />, color: 'from-green-500 to-green-600', hover: 'hover:from-green-600 hover:to-green-700' },
    { to: '/allotment', title: 'Subject Allotment', description: 'Assign subjects to faculty members.', icon: <AllotmentIcon className="w-12 h-12 text-white" />, color: 'from-purple-500 to-purple-600', hover: 'hover:from-purple-600 hover:to-purple-700' },
    { to: '/attendance', title: 'Take Attendance', description: 'Record daily student attendance.', icon: <AttendanceIcon className="w-12 h-12 text-white" />, color: 'from-yellow-500 to-yellow-600', hover: 'hover:from-yellow-600 hover:to-yellow-700' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome to your Department Management Portal!</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {mainNavItems.map(item => (
            <Link key={item.to} to={item.to} className="group block">
              <Card className={`h-full bg-gradient-to-br ${item.color} ${item.hover} text-white transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-xl`}>
                <div className="flex flex-col items-center text-center p-4">
                  {item.icon}
                  <h2 className="mt-4 text-xl font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm text-gray-200">{item.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
