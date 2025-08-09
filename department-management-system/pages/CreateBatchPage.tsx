import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import type { Batch } from '../types';

interface CreateBatchPageProps {
  batches: Batch[];
  onAddBatch: (batch: { year: number, semester: number }) => Promise<void>;
}

const CreateBatchPage: React.FC<CreateBatchPageProps> = ({ batches, onAddBatch }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [semester, setSemester] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (year && semester) {
      onAddBatch({ year, semester });
    }
  };

  const sortedBatches = [...batches].sort((a,b) => b.year - a.year || b.semester - a.semester);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Batches</h1>
      
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Create New Batch</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="e.g., 2024"
              required
            />
          </div>
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
            <input
              type="number"
              id="semester"
              value={semester}
              min="1"
              max="8"
              onChange={e => setSemester(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <button type="submit" className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition-colors h-fit">
            Create Batch
          </button>
        </form>
      </Card>
      
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Existing Batches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedBatches.length > 0 ? sortedBatches.map(batch => (
            <div key={batch.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">Semester {batch.semester}</h3>
              <p className="text-gray-500 dark:text-gray-400">{batch.year}</p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <Link to={`/batches/students/${batch.id}`} className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 py-1 px-3 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800">Manage Students</Link>
                <Link to={`/batches/subjects/${batch.id}`} className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-1 px-3 rounded-full hover:bg-green-200 dark:hover:bg-green-800">Manage Subjects</Link>
              </div>
            </div>
          )) : <p className="text-gray-600 dark:text-gray-300">No batches created yet. Use the form above to create one.</p>}
        </div>
      </Card>
    </div>
  );
};

export default CreateBatchPage;
