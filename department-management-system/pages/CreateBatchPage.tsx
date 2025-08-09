import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Batch } from '../types';
import Card from '../components/Card';
import { StudentIcon } from '../components/icons/StudentIcon';
import { SubjectIcon } from '../components/icons/SubjectIcon';

interface CreateBatchPageProps {
  onAddBatch: (batch: Omit<Batch, 'id'>) => Promise<void>;
  batches: Batch[];
}

const CreateBatchPage: React.FC<CreateBatchPageProps> = ({ onAddBatch, batches }) => {
  const [year, setYear] = useState<number | ''>(new Date().getFullYear());
  const [semester, setSemester] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (year && semester) {
      setIsSubmitting(true);
      await onAddBatch({ year: Number(year), semester: Number(semester) });
      setYear(new Date().getFullYear());
      setSemester('');
      setIsSubmitting(false);
    }
  };

  const sortedBatches = [...batches].sort((a, b) => b.year - a.year || b.semester - a.semester);


  return (
    <div className="space-y-12">
      <div className="max-w-md mx-auto">
          <Card title="Create New Batch">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="batchYear" className="block text-sm font-medium text-gray-300">Year</label>
                <input 
                  type="number" 
                  id="batchYear" 
                  value={year} 
                  onChange={(e) => setYear(Number(e.target.value))} 
                  min="2020"
                  max="2099"
                  className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="batchSemester" className="block text-sm font-medium text-gray-300">Semester</label>
                <input 
                  type="number" 
                  id="batchSemester" 
                  value={semester} 
                  onChange={(e) => setSemester(Number(e.target.value))} 
                  min="1" 
                  max="8" 
                  className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Batch'}
              </button>
            </form>
          </Card>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center text-white mb-6">Existing Batches</h2>
        {sortedBatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBatches.map(batch => (
              <Card key={batch.id} className="group relative overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out !p-0">
                <div className="p-6 h-full flex flex-col justify-center items-center text-center transition-opacity duration-300 group-hover:opacity-20">
                  <h3 className="text-2xl font-bold text-blue-400">Semester {batch.semester}</h3>
                  <p className="text-gray-400 mt-1">{batch.year}</p>
                </div>
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center space-y-4">
                        <Link to="/batches/students" className="flex items-center justify-center bg-blue-600 text-white rounded-lg px-4 py-2 w-48 mx-auto hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
                            <StudentIcon /> <span className="ml-2 font-semibold">Manage Students</span>
                        </Link>
                        <Link to="/batches/subjects" className="flex items-center justify-center bg-teal-600 text-white rounded-lg px-4 py-2 w-48 mx-auto hover:bg-teal-700 transition-all transform hover:scale-105 shadow-lg">
                            <SubjectIcon /> <span className="ml-2 font-semibold">Manage Subjects</span>
                        </Link>
                    </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-center text-gray-500">No batches created yet. Use the form above to create one.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateBatchPage;
