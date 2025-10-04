import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Expenses', href: '/expenses', icon: '💰' },
    { name: 'Reports', href: '/reports', icon: '📋' },
    ...(user?.role === 'manager' || user?.role === 'admin' 
      ? [{ name: 'Approvals', href: '/approvals', icon: '✅' }] 
      : []
    ),
    ...(user?.role === 'admin' 
      ? [
          { name: 'Users', href: '/admin/users', icon: '👥' },
          { name: 'Company', href: '/admin/company', icon: '🏢' },
          { name: 'Workflows', href: '/admin/workflows', icon: '⚙️' },
        ] 
      : []
    ),
    ...(user?.role === 'admin' || user?.role === 'manager' 
      ? [{ name: 'Analytics', href: '/analytics', icon: '📈' }] 
      : []
    ),
    { name: 'Settings', href: '/settings', icon: '⚙️' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];

  const advancedFeatures = [
    { name: 'Smart Approvals', href: '/advanced/approvals', icon: '🚀', roles: ['admin', 'manager'] },
    { name: 'Financial Controls', href: '/advanced/financial-controls', icon: '💼', roles: ['admin', 'manager'] },
    { name: 'Receipt Manager', href: '/advanced/receipt-manager', icon: '📷', roles: ['admin', 'manager', 'employee'] },
    { name: 'Advanced Reports', href: '/advanced/reporting', icon: '📊', roles: ['admin', 'manager'] },
    { name: 'Integrations', href: '/advanced/integration', icon: '🔗', roles: ['admin'] },
  ];

  return (
    <div className="bg-gradient-to-b from-[#000000] via-[#6037d9] to-[#2a65e5] w-64 h-full shadow-2xl flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#be42c3]/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#be42c3] to-[#6037d9] rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">ExpenseApp</h2>
            <p className="text-[#be42c3] text-xs">Smart Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#be42c3] to-[#6037d9] text-white shadow-lg transform scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white hover:bg-opacity-10 hover:transform hover:translate-x-1'
                  }`
                }
              >
                <span className="text-xl mr-4 group-hover:animate-bounce">{item.icon}</span>
                <span className="font-semibold">{item.name}</span>
                <svg className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </NavLink>
            ))}
          </div>

          {/* Advanced Features Section */}
          <div>
            <div className="px-4 mb-3">
              <h3 className="text-[#be42c3] text-xs uppercase font-bold tracking-wider">Advanced Features</h3>
            </div>
            <div className="space-y-1">
              {advancedFeatures
                .filter(feature => feature.roles.includes(user?.role))
                .map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#ff6b9d] to-[#ffd6e2] text-gray-900 shadow-lg transform scale-105'
                        : 'text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-[#ffd6e2]/20 hover:to-[#ff6b9d]/20 hover:transform hover:translate-x-1'
                    }`
                  }
                >
                  <span className="text-xl mr-4 group-hover:animate-pulse">{item.icon}</span>
                  <span className="font-semibold">{item.name}</span>
                  <svg className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* User Info */}
      <div className="mt-auto p-4 border-t border-[#be42c3]/30">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white bg-opacity-20">
          <div className="w-10 h-10 bg-gradient-to-br from-[#be42c3] to-[#2a65e5] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">{user?.firstName?.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[#be42c3] text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;