import React, { useState } from 'react';
import { Link, useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import HomeIcon from './icons/HomeIcon';
import BatchIcon from './icons/BatchIcon';
import FacultyIcon from './icons/FacultyIcon';
import AllotmentIcon from './icons/AllotmentIcon';
import AttendanceIcon from './icons/AttendanceIcon';

const NavLink: React.FC<{ to: string, children: React.ReactNode, onClick: () => void, isMobile?: boolean }> = ({ to, children, onClick, isMobile = false }) => {
    const location = useLocation();
    
    // Custom active logic: '/' must be exact, others can be parent routes.
    let isActive: boolean;
    if (to === '/') {
        isActive = location.pathname === '/';
    } else {
        const baseRoute = to.split('/')[1];
        isActive = location.pathname.startsWith(`/${baseRoute}`);
    }

    const baseClasses = `flex items-center text-sm font-medium rounded-lg transition-colors duration-200 group`;
    const mobileClasses = `px-3 py-2`;
    const desktopClasses = `px-4 py-2`;

    const activeClasses = 'bg-primary-600 text-white';
    const inactiveClasses = 'text-gray-300 hover:bg-gray-700 hover:text-white';

    return (
        <Link to={to} onClick={onClick} className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {children}
        </Link>
    );
};


const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
    { to: '/create-batch', label: 'Batches', icon: <BatchIcon className="w-5 h-5" /> },
    { to: '/faculty', label: 'Faculty', icon: <FacultyIcon className="w-5 h-5" /> },
    { to: '/allotment', label: 'Allotment', icon: <AllotmentIcon className="w-5 h-5" /> },
    { to: '/attendance', label: 'Attendance', icon: <AttendanceIcon className="w-5 h-5" /> },
  ];

  const renderNavLinks = (isMobile: boolean) => navLinks.map(link => (
      <NavLink key={link.to} to={link.to} onClick={closeMobileMenu} isMobile={isMobile}>
        <span className="mr-3">{link.icon}</span>
        {link.label}
      </NavLink>
  ));

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" onClick={closeMobileMenu} className="flex-shrink-0 text-white font-bold text-xl hover:text-primary-400 transition-colors">
              Dept. Portal
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {renderNavLinks(false)}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <CloseIcon className="w-6 h-6"/> : <MenuIcon className="w-6 h-6"/>}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {renderNavLinks(true)}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
