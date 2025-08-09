import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon } from './icons/MenuIcon';
import { CloseIcon } from './icons/CloseIcon';
import { HomeIcon } from './icons/HomeIcon';
import { BatchIcon } from './icons/BatchIcon';
import { FacultyIcon } from './icons/FacultyIcon';
import { AllotmentIcon } from './icons/AllotmentIcon';
import { AttendanceIcon } from './icons/AttendanceIcon';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, onClick, className='' }) => {
  const location = useLocation();
  let isActive = location.pathname === to;

  // Make "Batches" link active for all /batches/* routes
  if (to === '/batches/create' && location.pathname.startsWith('/batches')) {
      isActive = true;
  }
   // Exact match for home
  if (to === '/' && location.pathname !== '/') {
      isActive = false;
  }


  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white font-semibold'
          : 'text-gray-300 hover:bg-secondary hover:text-white'
      } ${className}`}
    >
      {children}
    </Link>
  );
};


const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/batches/create', label: 'Batches', icon: <BatchIcon /> },
    { to: '/faculty', label: 'Faculty', icon: <FacultyIcon /> },
    { to: '/allotment', label: 'Allotment', icon: <AllotmentIcon /> },
    { to: '/attendance', label: 'Attendance', icon: <AttendanceIcon /> },
  ];

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-white font-bold text-xl hover:text-blue-400 transition-colors">
              Dept. Portal
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map(link => (
                 <NavLink key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)}>
                   <span className="mr-2">{link.icon}</span>
                   {link.label}
                 </NavLink>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navLinks.map(link => (
                 <NavLink key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)}>
                   <span className="mr-3">{link.icon}</span>
                   {link.label}
                 </NavLink>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
