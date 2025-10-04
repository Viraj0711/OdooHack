// Placeholder pages for routes
import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Profile = () => {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('personal');
  const [formData, setFormData] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    displayName: user?.displayName || '',
    timeZone: 'Asia/Kolkata',
    language: 'English (US)',
    emailNotifications: true,
    pushNotifications: false,
    expenseReminders: true,
    approvalNotifications: true,
    weeklysummary: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile data:', formData);
    setShowEditModal(false);
  };
  
  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6037d9] to-[#2a65e5] rounded-2xl p-8 text-[#ffffff] shadow-xl mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">👤 My Profile</h1>
              <p className="text-[#ffffff]/80">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Combined Profile Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-[#000000] mb-6 flex items-center">
              <span className="w-8 h-8 bg-[#6037d9]/10 rounded-lg flex items-center justify-center mr-3">ℹ️</span>
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-[#000000]/70">First Name:</span>
                  <span className="font-semibold">{user?.firstName || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Last Name:</span>
                  <span className="font-semibold">{user?.lastName || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{user?.email || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Role:</span>
                  <span className="px-3 py-1 bg-[#6037d9]/10 text-[#6037d9] rounded-full text-sm font-semibold capitalize">
                    {user?.role || 'Employee'}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Time Zone:</span>
                  <span className="font-semibold">Asia/Kolkata (GMT+5:30)</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-semibold">English (US)</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Notifications:</span>
                  <span className="text-sm text-green-600">✓ Enabled</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Account Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowEditModal(true)}
              className="mt-6 w-full bg-gradient-to-r from-[#6037d9] to-[#be42c3] text-[#ffffff] py-3 rounded-xl font-semibold hover:from-[#be42c3] hover:to-[#2a65e5] transition-all duration-200"
            >
              ✏️ Edit Profile & Settings
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowEditModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit Profile & Account Settings</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'personal', name: 'Personal Info', icon: '👤' },
                    { id: 'account', name: 'Account Settings', icon: '⚙️' },
                    { id: 'notifications', name: 'Notifications', icon: '🔔' },
                    { id: 'security', name: 'Security', icon: '🔐' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="max-h-96 overflow-y-auto">
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'account' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                      <select
                        name="timeZone"
                        value={formData.timeZone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>Asia/Kolkata (GMT+5:30)</option>
                        <option>America/New_York (GMT-5:00)</option>
                        <option>Europe/London (GMT+0:00)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    {[
                      { name: 'emailNotifications', title: 'Email Notifications', description: 'Receive notifications via email' },
                      { name: 'pushNotifications', title: 'Push Notifications', description: 'Browser push notifications' },
                      { name: 'expenseReminders', title: 'Expense Reminders', description: 'Remind me to submit expenses' },
                      { name: 'approvalNotifications', title: 'Approval Notifications', description: 'Notify when expenses are approved/rejected' },
                      { name: 'weeklysummary', title: 'Weekly Summary', description: 'Weekly expense summary emails' }
                    ].map((setting) => (
                      <div key={setting.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">{setting.title}</p>
                          <p className="text-sm text-gray-500">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name={setting.name}
                            checked={formData[setting.name]}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Password Requirements:</strong> At least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export const Approvals = () => {
  const pendingApprovals = [
    { id: 1, title: 'Business Trip to Delhi', employee: 'John Smith', amount: 15000, date: '2025-10-01', category: 'Travel' },
    { id: 2, title: 'Office Supplies Purchase', employee: 'Sarah Wilson', amount: 2500, date: '2025-10-02', category: 'Office Supplies' },
    { id: 3, title: 'Client Lunch Meeting', employee: 'Mike Johnson', amount: 3200, date: '2025-10-03', category: 'Meals' },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#be42c3] to-[#6037d9] rounded-2xl p-8 text-[#ffffff] shadow-xl mb-8">
          <h1 className="text-4xl font-bold mb-2">✅ Pending Approvals</h1>
          <p className="text-[#ffffff]/80">Review and approve expense requests from your team</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#000000]/70 text-sm font-medium">⏳ Pending</p>
                <p className="text-3xl font-bold text-[#be42c3]">{pendingApprovals.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#be42c3]/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#000000]/70 text-sm font-medium">✅ Approved Today</p>
                <p className="text-3xl font-bold text-[#6037d9]">5</p>
              </div>
              <div className="w-12 h-12 bg-[#6037d9]/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#000000]/70 text-sm font-medium">💰 Total Amount</p>
                <p className="text-3xl font-bold text-[#2a65e5]">₹{pendingApprovals.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-[#2a65e5]/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Approvals Table */}
        <div className="bg-[#ffffff] rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#000000]/10">
            <h2 className="text-xl font-bold text-[#000000]">📋 Expense Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#000000]/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#000000]/70 uppercase tracking-wider">Expense</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#000000]/70 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#000000]/70 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#000000]/70 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#000000]/70 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#000000]/70 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#ffffff] divide-y divide-[#000000]/10">
                {pendingApprovals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-[#000000]/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-[#000000]">{approval.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#000000]">{approval.employee}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#6037d9]">₹{approval.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold bg-[#2a65e5]/10 text-[#2a65e5] rounded-full">
                        {approval.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000000]/70">
                      {new Date(approval.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="bg-[#6037d9] text-[#ffffff] px-3 py-1 rounded-lg hover:bg-[#be42c3] transition-colors">
                        ✅ Approve
                      </button>
                      <button className="bg-[#000000] text-[#ffffff] px-3 py-1 rounded-lg hover:bg-[#000000]/80 transition-colors">
                        ❌ Reject
                      </button>
                      <button className="bg-[#2a65e5] text-[#ffffff] px-3 py-1 rounded-lg hover:bg-[#6037d9] transition-colors">
                        👁️ View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Users = () => {
  const users = [
    { id: 1, name: 'John Smith', email: 'john@company.com', role: 'employee', status: 'active', joinDate: '2025-01-15' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@company.com', role: 'manager', status: 'active', joinDate: '2024-11-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'employee', status: 'active', joinDate: '2025-02-10' },
    { id: 4, name: 'Lisa Chen', email: 'lisa@company.com', role: 'admin', status: 'active', joinDate: '2024-08-05' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">👥 User Management</h1>
              <p className="text-purple-100">Manage users, roles, and permissions</p>
            </div>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              ➕ Add New User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">👥 Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">👑 Admins</p>
                <p className="text-3xl font-bold text-red-600">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">💼 Managers</p>
                <p className="text-3xl font-bold text-yellow-600">{users.filter(u => u.role === 'manager').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">👨‍💼 Employees</p>
                <p className="text-3xl font-bold text-green-600">{users.filter(u => u.role === 'employee').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👨‍💼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">📋 All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'manager' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                        ✓ {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.joinDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">✏️ Edit</button>
                      <button className="text-red-600 hover:text-red-900 transition-colors">🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Company = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <h1 className="text-4xl font-bold mb-2">🏢 Company Settings</h1>
          <p className="text-orange-100">Configure your organization's expense management preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">🏢</span>
              Company Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent" defaultValue="TechCorp Solutions Pvt Ltd" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Manufacturing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>200+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent" rows="3" defaultValue="123 Tech Park, Cyber City, Gurgaon, Haryana 122002, India"></textarea>
              </div>
            </div>
          </div>

          {/* Expense Policies */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">📊</span>
              Expense Policies
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Meal Allowance</label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">₹</span>
                  <input type="number" className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" defaultValue="500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Expense Limit</label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">₹</span>
                  <input type="number" className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" defaultValue="25000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Office Supplies Budget</label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">₹</span>
                  <input type="number" className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" defaultValue="5000" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Require Receipt for Expenses</p>
                  <p className="text-sm text-gray-500">Above ₹100</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Approval Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">⚙️</span>
              Approval Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Approve Below</label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">₹</span>
                  <input type="number" className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" defaultValue="1000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager Approval Limit</label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">₹</span>
                  <input type="number" className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" defaultValue="50000" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Send email alerts for approvals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Currency & Localization */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">🌍</span>
              Currency & Localization
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Currency</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                  <option value="INR">₹ Indian Rupee (INR)</option>
                  <option value="USD">$ US Dollar (USD)</option>
                  <option value="EUR">€ Euro (EUR)</option>
                  <option value="GBP">£ British Pound (GBP)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                  <option>Asia/Kolkata (IST)</option>
                  <option>America/New_York (EST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>Asia/Singapore (SGT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export const Workflows = () => {
  const workflows = [
    { id: 1, name: 'Standard Approval', description: 'Default workflow for expenses under ₹50,000', steps: ['Employee Submit', 'Manager Review', 'Auto Approve'], status: 'active' },
    { id: 2, name: 'High Value Approval', description: 'Workflow for expenses above ₹50,000', steps: ['Employee Submit', 'Manager Review', 'Admin Approval'], status: 'active' },
    { id: 3, name: 'Travel Expense', description: 'Specialized workflow for travel-related expenses', steps: ['Employee Submit', 'Travel Admin', 'Manager Approve'], status: 'active' },
    { id: 4, name: 'Emergency Approval', description: 'Fast-track for urgent expenses', steps: ['Employee Submit', 'Auto Approve'], status: 'draft' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">⚙️ Approval Workflows</h1>
              <p className="text-teal-100">Configure and manage expense approval processes</p>
            </div>
            <button className="bg-white text-teal-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              ➕ Create Workflow
            </button>
          </div>
        </div>

        {/* Workflow Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">⚙️ Active Workflows</p>
                <p className="text-3xl font-bold text-green-600">{workflows.filter(w => w.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">📋 Draft Workflows</p>
                <p className="text-3xl font-bold text-yellow-600">{workflows.filter(w => w.status === 'draft').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">🔄 Avg Processing Time</p>
                <p className="text-3xl font-bold text-blue-600">2.5</p>
                <p className="text-sm text-blue-600">days</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workflows List */}
        <div className="space-y-6">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{workflow.name}</h3>
                  <p className="text-gray-600">{workflow.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {workflow.status === 'active' ? '✓ Active' : '📋 Draft'}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">✏️ Edit</button>
                </div>
              </div>
              
              {/* Workflow Steps */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🔄 Workflow Steps</h4>
                <div className="flex items-center space-x-4">
                  {workflow.steps.map((step, index) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-700 text-center max-w-20">{step}</p>
                      </div>
                      {index < workflow.steps.length - 1 && (
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-teal-300 to-cyan-400 min-w-12"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-6 flex space-x-3">
                <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                  👁️ View Details
                </button>
                <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                  📋 Duplicate
                </button>
                {workflow.status === 'draft' && (
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    ✓ Activate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Reports = () => {
  const reportTypes = [
    { id: 1, name: 'Monthly Expense Report', description: 'Detailed monthly breakdown of all expenses', icon: '📊', lastGenerated: '2025-10-01' },
    { id: 2, name: 'Employee Expense Summary', description: 'Individual employee expense summaries', icon: '👤', lastGenerated: '2025-09-28' },
    { id: 3, name: 'Category-wise Analysis', description: 'Expenses grouped by categories', icon: '📋', lastGenerated: '2025-09-30' },
    { id: 4, name: 'Pending Approvals Report', description: 'All expenses awaiting approval', icon: '⏳', lastGenerated: '2025-10-03' },
    { id: 5, name: 'Audit Trail Report', description: 'Complete audit trail of all activities', icon: '🔍', lastGenerated: '2025-10-02' },
    { id: 6, name: 'Budget vs Actual', description: 'Compare budgets with actual expenses', icon: '📈', lastGenerated: '2025-09-29' },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2a65e5] to-[#6037d9] rounded-2xl p-8 text-[#ffffff] shadow-xl mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">📊 Reports & Analytics</h1>
              <p className="text-[#ffffff]/80">Generate comprehensive reports and insights</p>
            </div>
            <button className="bg-[#ffffff] text-[#2a65e5] px-6 py-3 rounded-xl font-semibold hover:bg-[#ffffff]/90 transition-colors">
              📄 Custom Report
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#000000]/70 text-sm font-medium">📋 Available Reports</p>
                <p className="text-3xl font-bold text-[#6037d9]">{reportTypes.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#6037d9]/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#000000]/70 text-sm font-medium">⏰ Generated Today</p>
                <p className="text-3xl font-bold text-[#2a65e5]">3</p>
              </div>
              <div className="w-12 h-12 bg-[#2a65e5]/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#000000]/70 text-sm font-medium">📈 Scheduled Reports</p>
                <p className="text-3xl font-bold text-[#be42c3]">5</p>
              </div>
              <div className="w-12 h-12 bg-[#be42c3]/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#000000]/70 text-sm font-medium">💾 Export Formats</p>
                <p className="text-3xl font-bold text-[#6037d9]">4</p>
                <p className="text-sm text-[#6037d9]">PDF, Excel, CSV, JSON</p>
              </div>
              <div className="w-12 h-12 bg-[#6037d9]/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💾</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => (
            <div key={report.id} className="bg-[#ffffff] rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2a65e5] to-[#be42c3] rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  {report.icon}
                </div>
                <span className="text-xs text-[#6037d9] bg-[#6037d9]/10 px-2 py-1 rounded-full font-medium">
                  Updated {new Date(report.lastGenerated).toLocaleDateString('en-IN')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#000000] mb-2">{report.name}</h3>
              <p className="text-[#000000]/70 text-sm mb-6">{report.description}</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-gradient-to-r from-[#2a65e5] to-[#6037d9] text-[#ffffff] py-2 px-4 rounded-lg font-semibold hover:from-[#6037d9] hover:to-[#be42c3] transition-all duration-200">
                  📊 Generate
                </button>
                <button className="px-4 py-2 border border-[#2a65e5] text-[#2a65e5] rounded-lg hover:bg-[#2a65e5]/10 transition-colors">
                  ⚙️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">📁</span>
            Recent Reports
          </h2>
          <div className="space-y-4">
            {[
              { name: 'September 2025 Monthly Report', date: '2025-10-01', size: '2.4 MB', format: 'PDF' },
              { name: 'Q3 2025 Quarterly Summary', date: '2025-09-30', size: '5.1 MB', format: 'Excel' },
              { name: 'Travel Expenses - Week 39', date: '2025-09-28', size: '1.8 MB', format: 'PDF' },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600">📄</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">Generated on {new Date(report.date).toLocaleDateString('en-IN')} • {report.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">{report.format}</span>
                  <button className="text-emerald-600 hover:text-emerald-800 transition-colors">📥 Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-slate-700 rounded-2xl p-8 text-white shadow-xl mb-8">
          <h1 className="text-4xl font-bold mb-2">⚙️ Settings</h1>
          <p className="text-gray-300">Customize your expense management experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Settings Categories</h2>
              <nav className="space-y-2">
                {[
                  { name: 'Notification Preferences', icon: '🔔', active: true },
                  { name: 'Expense Preferences', icon: '💰', active: false },
                  { name: 'Security & Privacy', icon: '🔒', active: false },
                  { name: 'Integration Settings', icon: '🔗', active: false },
                  { name: 'Advanced Settings', icon: '⚙️', active: false },
                ].map((item) => (
                  <button key={item.name} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    item.active ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-3">ℹ️</span>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Account Settings Moved</h3>
                  <p className="text-blue-700">Personal information and account settings are now available in your Profile page for better organization.</p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">🔔</span>
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  { title: 'Email Notifications', description: 'Receive notifications via email', enabled: true },
                  { title: 'Push Notifications', description: 'Browser push notifications', enabled: false },
                  { title: 'Expense Reminders', description: 'Remind me to submit expenses', enabled: true },
                  { title: 'Approval Notifications', description: 'Notify when expenses are approved/rejected', enabled: true },
                  { title: 'Weekly Summary', description: 'Weekly expense summary emails', enabled: false },
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{setting.title}</p>
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Preferences */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">💰</span>
                Expense Preferences
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>₹ Indian Rupee (INR)</option>
                    <option>$ US Dollar (USD)</option>
                    <option>€ Euro (EUR)</option>
                    <option>£ British Pound (GBP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Expense Category</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>General</option>
                    <option>Travel</option>
                    <option>Meals</option>
                    <option>Office Supplies</option>
                    <option>Software</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Auto-save Drafts</p>
                    <p className="text-sm text-gray-500">Automatically save expense drafts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Analytics = () => {
  const monthlyData = [
    { month: 'Jan', amount: 45000, expenses: 28 },
    { month: 'Feb', amount: 52000, expenses: 32 },
    { month: 'Mar', amount: 38000, expenses: 24 },
    { month: 'Apr', amount: 61000, expenses: 35 },
    { month: 'May', amount: 48000, expenses: 29 },
    { month: 'Jun', amount: 55000, expenses: 33 },
  ];

  const categoryData = [
    { category: 'Travel', amount: 120000, percentage: 35, color: 'bg-blue-500' },
    { category: 'Meals', amount: 85000, percentage: 25, color: 'bg-green-500' },
    { category: 'Office Supplies', amount: 68000, percentage: 20, color: 'bg-yellow-500' },
    { category: 'Software', amount: 45000, percentage: 13, color: 'bg-purple-500' },
    { category: 'Other', amount: 25000, percentage: 7, color: 'bg-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <h1 className="text-4xl font-bold mb-2">📈 Analytics Dashboard</h1>
          <p className="text-indigo-100">Insights and trends for expense management</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">💰 Total Expenses</p>
                <p className="text-3xl font-bold text-blue-600">₹{(monthlyData.reduce((sum, item) => sum + item.amount, 0)).toLocaleString()}</p>
                <p className="text-sm text-green-600">↑ 12% from last period</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">📄 Total Reports</p>
                <p className="text-3xl font-bold text-green-600">{monthlyData.reduce((sum, item) => sum + item.expenses, 0)}</p>
                <p className="text-sm text-green-600">↑ 8% from last period</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">📅 Avg per Month</p>
                <p className="text-3xl font-bold text-purple-600">₹{Math.round(monthlyData.reduce((sum, item) => sum + item.amount, 0) / monthlyData.length).toLocaleString()}</p>
                <p className="text-sm text-purple-600">6 months average</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">⏱️ Pending Approvals</p>
                <p className="text-3xl font-bold text-orange-600">12</p>
                <p className="text-sm text-orange-600">Require attention</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏱️</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Trends */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">📈</span>
              Monthly Expense Trends
            </h2>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{data.month} 2025</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">₹{data.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{data.expenses} expenses</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">🥧</span>
              Expense Categories
            </h2>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{category.category}</span>
                    <span className="font-bold text-gray-900">₹{category.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className={`h-3 rounded-full ${category.color}`} style={{width: `${category.percentage}%`}}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">⏰</span>
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-l-4 border-green-500 bg-green-50 rounded-r-xl">
              <div className="flex items-center space-x-3">
                <span className="text-green-600">✅</span>
                <div>
                  <p className="font-medium text-gray-900">Expense Approved</p>
                  <p className="text-sm text-gray-600">Travel expense for ₹15,000 approved by Sarah Wilson</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-xl">
              <div className="flex items-center space-x-3">
                <span className="text-blue-600">📄</span>
                <div>
                  <p className="font-medium text-gray-900">New Expense Submitted</p>
                  <p className="text-sm text-gray-600">Office supplies expense for ₹2,500 by Mike Johnson</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-xl">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-600">⏳</span>
                <div>
                  <p className="font-medium text-gray-900">Pending Review</p>
                  <p className="text-sm text-gray-600">Client lunch expense for ₹3,200 awaiting approval</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};