import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Left side - Mobile menu button */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Page title */}
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500 font-medium hidden sm:block">Innoventory Management System</p>
          </div>
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 group">
              <BellIcon className="h-6 w-6" />
              {/* Notification badge */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </button>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-3 group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">Admin User</p>
              <p className="text-xs text-gray-500">admin@innoventory.com</p>
            </div>
            <button className="relative p-1 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-105">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
