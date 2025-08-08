import React, { useState } from 'react';
import type { Faculty } from '../types';
import Card from '../components/Card';

interface FacultyPageProps {
  faculty: Faculty[];
  onAddFaculty: (facultyMember: Faculty) => void;
}

const FacultyPage: React.FC<FacultyPageProps> = ({ faculty, onAddFaculty }) => {
  const [name, setName] = useState('');
  const [facultyId, setFacultyId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && facultyId) {
      onAddFaculty({ name, id: facultyId });
      setName('');
      setFacultyId('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card title="Add New Faculty">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="facultyName" className="block text-sm font-medium text-gray-300">Name</label>
              <input type="text" id="facultyName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label htmlFor="facultyId" className="block text-sm font-medium text-gray-300">Faculty ID</label>
              <input type="text" id="facultyId" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-colors">
              Add Faculty
            </button>
          </form>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card title="Faculty List">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Faculty ID</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {faculty.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{member.id}</td>
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

export default FacultyPage;
