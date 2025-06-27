import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  UserIcon,
  CogIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Vendors', href: '/vendors', icon: UserGroupIcon },
  { name: 'Clients', href: '/clients', icon: UsersIcon },
  { name: 'Type of Work', href: '/type-of-work', icon: BriefcaseIcon },
  { name: 'Orders', href: '/orders', icon: ShoppingBagIcon },
  { name: 'Audit', href: '/audit', icon: DocumentTextIcon },
  { name: 'Sub-admins', href: '/sub-admins', icon: UserIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 pt-5 pb-4 overflow-y-auto shadow-sm">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <div className="w-full">
                <img
                  src="/innoventorysologo.png"
                  alt="Innoventory Logo"
                  className="h-16 w-full object-contain"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-2">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href ||
                  (item.href === '/dashboard' && location.pathname === '/') ||
                  (item.href !== '/dashboard' && location.pathname.startsWith(item.href + '/'));
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <item.icon className={`mr-3 h-5 w-5 transition-all duration-200 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                    }`} />
                    <span className="transition-all duration-200">{item.name}</span>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full opacity-80"></div>
                    )}

                    {/* Hover effect */}
                    <div className={`absolute inset-0 rounded-xl transition-all duration-200 ${
                      !isActive ? 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/5 to-blue-600/5' : ''
                    }`}></div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 mt-4">
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                System Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center flex-1 mr-4">
              <img
                src="/innoventorysologo.png"
                alt="Innoventory Logo"
                className="h-12 w-full object-contain"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href === '/dashboard' && location.pathname === '/') ||
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
