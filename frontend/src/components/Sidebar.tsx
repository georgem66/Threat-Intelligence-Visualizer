import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Home, Shield, BarChart3, Settings, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Threats', href: '/threats', icon: Shield },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile sidebar */}
      <div className={clsx(
        'relative z-50 lg:hidden',
        isOpen ? 'fixed inset-0' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={onClose} />

        <div className="fixed inset-y-0 left-0 z-40 w-full overflow-y-auto bg-white px-6 pb-4 dark:bg-gray-900 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                ThreatIntel
              </h1>
            </div>
            <button
              type="button"
              className="ml-auto -m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-8">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      clsx(
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                        isActive
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-primary-400'
                      )
                    }
                    onClick={onClose}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex h-16 shrink-0 items-center">
            <AlertTriangle className="h-8 w-8 text-primary-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              ThreatIntel
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          clsx(
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                            isActive
                              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-primary-400'
                          )
                        }
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;