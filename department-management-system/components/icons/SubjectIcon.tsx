
import React from 'react';

const SubjectIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-6.253-11.494v11.494M9.75 21.75l-.254-.025A2.25 2.25 0 017.5 19.5V4.5a2.25 2.25 0 012.25-2.25h5.5A2.25 2.25 0 0117.5 4.5v15a2.25 2.25 0 01-2.25 2.25h-5.5a2.25 2.25 0 01-2.25-2.25" />
  </svg>
);

export default SubjectIcon;
