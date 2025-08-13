import React, { useState } from 'react';
import Papa from 'papaparse';
import { UploadIcon } from '../components/icons/UploadIcon';
import type { Faculty} from '../types';


interface FacultyPageProps {
    faculty: Faculty[];
    onAddFaculty: (faculties: Faculty[]) => Promise<void>;
    onClearFaculty: () => Promise<void>;
}

const FacultyPage: React.FC<FacultyPageProps> = ({ faculty, onAddFaculty, onClearFaculty }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);

        Papa.parse<Faculty>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                if (!results.data.length || !('name' in results.data[0]) || !('id' in results.data[0])) {
                    alert('Invalid CSV format. Please ensure the headers are "name" and "id".');
                    setIsProcessing(false);
                    event.target.value = '';
                    return;
                }

                const newFaculties = results.data
                    .map(row => ({
                        name: row.name?.trim(),
                        id: row.id?.trim(),
                    }))
                    .filter(faculty => faculty.name && faculty.id);

                if (newFaculties.length > 0) {
                    await onAddFaculty(newFaculties);
                } else {
                    alert('No valid faculty data found in the file.');
                }

                setIsProcessing(false);
                event.target.value = '';
            },
            error: (error) => {
                alert(`Error parsing file: ${error.message}`);
                setIsProcessing(false);
                event.target.value = '';
            }
        });
    };

    const handleClearFaculty = async () => {
        if (confirm(`Are you sure you want to delete all ${faculty.length} faculties? This action cannot be undone.`)) {
            setIsProcessing(true);
            await onClearFaculty();
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                {/* --- Upload Section --- */}
                <div>
                    <h4 className="text-lg font-medium text-gray-200 mb-2">Import Faculty from CSV</h4>
                    <p className="text-sm text-gray-400 mb-4">
                        File must have headers: <code>name,id</code>.
                    </p>
                    <label htmlFor="csv-upload" className={`w-full sm:w-auto cursor-pointer bg-secondary text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors inline-flex items-center justify-center ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <UploadIcon />
                        {isProcessing ? 'Processing...' : 'Upload Faculty CSV'}
                    </label>
                    <input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={isProcessing} />
                </div>

                {/* --- Faculty List Section --- */}
                <div className="pt-6 border-t border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                        <h3 className="text-xl font-semibold text-white">Faculty List ({faculty.length})</h3>
                        {faculty.length > 0 && (
                            <button onClick={handleClearFaculty} disabled={isProcessing} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
                                Clear All Faculties
                            </button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {faculty.length > 0 ? (
                                    faculty.map((fac) => (
                                        <tr key={fac.id} className="hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{fac.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{fac.id}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={2} className="text-center py-8 text-gray-400">No faculties found. Upload a CSV to add them.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyPage;