import React, { useState } from 'react';
import type { Batch } from '../types';
import Card from '../components/Card';

interface CreateBatchPageProps {
  onAddBatch: (batch: Omit<Batch, 'id'>) => Promise<void>;
}

const CreateBatchPage: React.FC<CreateBatchPageProps> = ({ onAddBatch }) => {
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

  return (
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
  );
};

export default CreateBatchPage;
