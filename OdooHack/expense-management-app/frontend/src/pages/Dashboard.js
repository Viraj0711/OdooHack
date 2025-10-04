import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { formatRupees } from '../utils/currency';

const Dashboard = () => {
  const { user } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#6037d9] to-[#2a65e5] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-white">24</p>
                  <p className="text-white/80 text-sm mt-1">↗ +12% from last month</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#be42c3] to-[#6037d9] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Pending Approvals</h3>
                  <p className="text-3xl font-bold text-white">8</p>
                  <p className="text-white/80 text-sm mt-1">🔔 Needs attention</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#2a65e5] to-[#be42c3] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Monthly Expenses</h3>
                  <p className="text-3xl font-bold text-white">{formatRupees(12450, false)}</p>
                  <p className="text-white/80 text-sm mt-1">📊 Within budget</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      case 'manager':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#be42c3] to-[#6037d9] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Pending Approvals</h3>
                  <p className="text-3xl font-bold text-white">5</p>
                  <p className="text-white/80 text-sm mt-1">⏳ Awaiting your review</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#2a65e5] to-[#6037d9] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Team Expenses</h3>
                  <p className="text-3xl font-bold text-white">{formatRupees(8230, false)}</p>
                  <p className="text-white/80 text-sm mt-1">👥 Team spending</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      case 'employee':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#6037d9] to-[#be42c3] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">My Expenses</h3>
                  <p className="text-3xl font-bold text-white">12</p>
                  <p className="text-white/80 text-sm mt-1">📝 Total submissions</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#2a65e5] to-[#be42c3] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Total Amount</h3>
                  <p className="text-3xl font-bold text-white">{formatRupees(2450, false)}</p>
                  <p className="text-white/80 text-sm mt-1">💰 Your expenses</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Welcome Section with Enhanced Design */}
      <div className="relative mb-8 bg-gradient-to-r from-[#6037d9] via-[#2a65e5] to-[#be42c3] rounded-2xl p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        <div className="relative">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user?.firstName}! ✨
              </h1>
              <p className="mt-2 text-white/90 text-lg">
                Here's your expense overview for today • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6 mt-6">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <span className="text-white text-sm font-medium">
                🎯 Role: {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <span className="text-white text-sm font-medium">
                🏢 {user?.company?.name || 'Company'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {getDashboardContent()}

      {/* Advanced Features Showcase */}
      <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#FFD6E2] to-[#ff6b9d] px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">🚀 Advanced Features</h2>
            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">NEW</span>
          </div>
          <p className="text-white/90 mt-2">Experience next-generation expense management</p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Smart Approvals</h3>
                  <p className="text-sm text-gray-600 mb-3">Multi-level approval workflows with bulk processing and intelligent routing</p>
                  <a href="/advanced/approvals" className="text-blue-600 text-sm font-medium hover:text-blue-800">
                    Explore →
                  </a>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <span className="text-2xl">💼</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Financial Controls</h3>
                  <p className="text-sm text-gray-600 mb-3">Budget tracking, policy validation, and automated tax calculations</p>
                  <a href="/advanced/financial-controls" className="text-green-600 text-sm font-medium hover:text-green-800">
                    Explore →
                  </a>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <span className="text-2xl">📷</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">AI Receipt Manager</h3>
                  <p className="text-sm text-gray-600 mb-3">OCR processing, duplicate detection, and mobile capture</p>
                  <a href="/advanced/receipt-manager" className="text-purple-600 text-sm font-medium hover:text-purple-800">
                    Explore →
                  </a>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Advanced Reports</h3>
                  <p className="text-sm text-gray-600 mb-3">Custom dashboards, forecasting, and policy violation tracking</p>
                  <a href="/advanced/reporting" className="text-orange-600 text-sm font-medium hover:text-orange-800">
                    Explore →
                  </a>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border border-teal-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-teal-500 rounded-lg">
                  <span className="text-2xl">🔗</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Integrations</h3>
                  <p className="text-sm text-gray-600 mb-3">Connect with accounting, banking, and business systems</p>
                  {(user?.role === 'admin') ? (
                    <a href="/advanced/integration" className="text-teal-600 text-sm font-medium hover:text-teal-800">
                      Explore →
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">Admin only</span>
                  )}
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-pink-500 rounded-lg">
                  <span className="text-2xl">✨</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Enhanced Forms</h3>
                  <p className="text-sm text-gray-600 mb-3">Smart expense forms with real-time validation and OCR</p>
                  <a href="/expenses/enhanced" className="text-pink-600 text-sm font-medium hover:text-pink-800">
                    Try Now →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Activity Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#6037d9]/10 rounded-lg">
                <svg className="w-6 h-6 text-[#6037d9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#000000]">Recent Activity</h2>
            </div>
            <div className="text-sm text-[#000000]/70 bg-[#ffffff] px-3 py-1 rounded-full border border-[#000000]/20">
              Last 7 days
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-[#6037d9]/10 to-[#be42c3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-[#2a65e5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#000000] mb-2">All caught up! 🎉</h3>
            <p className="text-[#000000]/70 mb-6">No recent activity to display. Start by creating your first expense report.</p>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#6037d9] to-[#be42c3] text-[#ffffff] font-medium rounded-lg hover:from-[#be42c3] hover:to-[#6037d9] transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;