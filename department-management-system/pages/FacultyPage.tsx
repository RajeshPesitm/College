import React, { useState } from 'react';
import Card from '../components/Card';
import type { Faculty } from '../types';

interface FacultyPageProps {
  faculty: Faculty[];
  onAddFaculty: (facultyMember: { id: string, name: string }) => Promise<void>;
}

const FacultyPage: React.FC<FacultyPageProps> = ({ faculty, onAddFaculty }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(name && id) {
      onAddFaculty({ id, name });
      setName('');
      setId('');
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Faculty</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Faculty List ({faculty.length})</h2>
             {faculty.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Faculty ID</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {faculty.map(f => (
                        <tr key={f.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{f.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{f.id}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-300">No faculty members added yet.</p>
            )}
          </Card>
        </div>
        <div>
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add New Faculty</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="faculty-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  id="faculty-name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>
               <div>
                <label htmlFor="faculty-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Faculty ID</label>
                <input
                  type="text"
                  id="faculty-id"
                  value={id}
                  onChange={e => setId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition-colors">
                Add Faculty
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;