import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { formatRupees } from '../utils/currency';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Expenses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Sample expense categories
  const categories = [
    'Travel', 'Meals', 'Office Supplies', 'Software', 'Training',
    'Marketing', 'Transportation', 'Accommodation', 'Internet', 'Other'
  ];

  // Sample expenses data (will be replaced with API call)
  useEffect(() => {
    fetchExpenses();
  }, [currentPage, filters]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Simulated API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sampleExpenses = [
        {
          id: 1,
          title: 'Business Trip to Mumbai',
          amount: 15000,
          currency: 'INR',
          category: 'Travel',
          status: 'approved',
          submittedAt: '2025-10-01T10:00:00Z',
          receiptUrl: null,
          description: 'Flight tickets and accommodation for client meeting'
        },
        {
          id: 2,
          title: 'Office Supplies Purchase',
          amount: 2500,
          currency: 'INR',
          category: 'Office Supplies',
          status: 'pending',
          submittedAt: '2025-10-02T14:30:00Z',
          receiptUrl: '/uploads/receipts/receipt2.jpg',
          description: 'Stationery and printer cartridges'
        },
        {
          id: 3,
          title: 'Client Lunch Meeting',
          amount: 3200,
          currency: 'INR',
          category: 'Meals',
          status: 'rejected',
          submittedAt: '2025-10-03T12:15:00Z',
          receiptUrl: '/uploads/receipts/receipt3.jpg',
          description: 'Business lunch with potential client'
        },
        {
          id: 4,
          title: 'Software License Renewal',
          amount: 8500,
          currency: 'INR',
          category: 'Software',
          status: 'draft',
          submittedAt: '2025-10-04T09:00:00Z',
          receiptUrl: null,
          description: 'Annual subscription for design software'
        }
      ];

      setExpenses(sampleExpenses);
      setTotalPages(1);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch expenses');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: 'bg-[#6037d9]/10 text-[#6037d9]',
      pending: 'bg-[#be42c3]/10 text-[#be42c3]',
      rejected: 'bg-[#000000]/10 text-[#000000]',
      draft: 'bg-[#2a65e5]/10 text-[#2a65e5]'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || statusClasses.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         expense.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || expense.status === filters.status;
    const matchesCategory = filters.category === 'all' || expense.category === filters.category;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Enhanced Header with Gradient Background */}
      <div className="bg-gradient-to-r from-[#6037d9] via-[#2a65e5] to-[#be42c3] rounded-2xl p-8 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">💼 My Expenses</h1>
            <p className="text-[#ffffff]/80 text-lg">
              Manage and track your expense submissions with ease
            </p>
            <div className="flex items-center mt-4 space-x-4">
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">📊 Dashboard</span>
              </div>
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">✨ Enhanced UI</span>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-0 flex space-x-4">
            <Link
              to="/expenses/new"
              className="inline-flex items-center px-6 py-3 bg-[#ffffff] text-[#6037d9] font-bold rounded-xl hover:bg-[#ffffff]/90 focus:outline-none focus:ring-4 focus:ring-[#ffffff]/50 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-2xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              ✨ New Expense
            </Link>
            <Link
              to="/expenses/office-supplies"
              className="inline-flex items-center px-6 py-3 bg-[#be42c3] text-[#ffffff] font-bold rounded-xl hover:bg-[#6037d9] focus:outline-none focus:ring-4 focus:ring-[#be42c3]/30 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-2xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              📄 Office Supplies
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#6037d9] to-[#2a65e5] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#ffffff]/80 font-medium mb-1">📄 Total Expenses</p>
              <p className="text-3xl font-bold text-[#ffffff]">{expenses.length}</p>
              <p className="text-[#ffffff]/70 text-sm mt-1">All time</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#be42c3] to-[#6037d9] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#ffffff]/80 font-medium mb-1">⏳ Pending</p>
              <p className="text-3xl font-bold text-[#ffffff]">{expenses.filter(e => e.status === 'pending').length}</p>
              <p className="text-[#ffffff]/70 text-sm mt-1">Awaiting approval</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#2a65e5] to-[#6037d9] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#ffffff]/80 font-medium mb-1">✅ Approved</p>
              <p className="text-3xl font-bold text-[#ffffff]">{expenses.filter(e => e.status === 'approved').length}</p>
              <p className="text-[#ffffff]/70 text-sm mt-1">Ready for payment</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#be42c3] to-[#6037d9] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#ffffff]/80 font-medium mb-1">💰 Total Amount</p>
              <p className="text-2xl font-bold text-[#ffffff]">
                {formatRupees(expenses.reduce((sum, e) => sum + e.amount, 0), false)}
              </p>
              <p className="text-[#ffffff]/70 text-sm mt-1">Total value</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-[#ffffff] p-8 rounded-2xl shadow-xl border border-[#000000]/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex-1 mr-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search expenses..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-[#000000]/20 rounded-md focus:ring-2 focus:ring-[#6037d9] focus:border-[#6037d9] bg-[#ffffff] text-[#000000]"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-[#000000]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-2 sm:mt-0 px-4 py-2 text-[#6037d9] border border-[#6037d9] rounded-md hover:bg-[#6037d9]/10 focus:outline-none focus:ring-2 focus:ring-[#6037d9] bg-[#ffffff]"
          >
            Filters
            {showFilters ? (
              <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#000000]/10">
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-[#000000]/20 rounded-md focus:ring-2 focus:ring-[#be42c3] focus:border-[#be42c3] bg-[#ffffff] text-[#000000]"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-[#000000]/20 rounded-md focus:ring-2 focus:ring-[#2a65e5] focus:border-[#2a65e5] bg-[#ffffff] text-[#000000]"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expenses List */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-[#000000]">No expenses found</h3>
            <p className="mt-1 text-sm text-[#000000]/70">Get started by creating your first expense.</p>
            <div className="mt-6">
              <Link
                to="/expenses/new"
                className="inline-flex items-center px-4 py-2 bg-[#6037d9] text-[#ffffff] font-medium rounded-md hover:bg-[#be42c3]"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Expense
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#000000]/10 text-sm antialiased">
              <thead className="bg-gradient-to-r from-[#6037d9]/10 to-[#be42c3]/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6037d9] uppercase tracking-wider">
                    💼 Expense
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6037d9] uppercase tracking-wider">
                    💰 Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6037d9] uppercase tracking-wider">
                    📁 Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6037d9] uppercase tracking-wider">
                    📊 Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6037d9] uppercase tracking-wider">
                    📅 Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6037d9] uppercase tracking-wider">
                    📎 Receipt
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-[#6037d9] uppercase tracking-wider">
                    ⚡ Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#ffffff] divide-y divide-[#000000]/10 antialiased">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gradient-to-r hover:from-[#6037d9]/5 hover:to-[#be42c3]/5 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-[#000000] leading-relaxed">{expense.title}</div>
                        <div className="text-sm text-[#000000]/70 leading-relaxed">{expense.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#6037d9]">
                        {formatRupees(expense.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-[#2a65e5]/10 text-[#2a65e5] rounded-full">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(expense.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000000]">
                      {formatDate(expense.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000000]/70">
                      {expense.receiptUrl ? (
                        <span className="flex items-center text-[#6037d9]">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Attached
                        </span>
                      ) : (
                        <span className="text-[#000000]/40">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={expense.id === 2 || expense.category === 'Office Supplies' ? '/expenses/office-supplies' : `/expenses/${expense.id}`}
                          className="text-[#2a65e5] hover:text-[#6037d9] font-medium"
                        >
                          View
                        </Link>
                        {(expense.status === 'draft' || expense.status === 'rejected') && (
                          <Link
                            to={`/expenses/${expense.id}/edit`}
                            className="text-[#be42c3] hover:text-[#6037d9] font-medium"
                          >
                            Edit
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#000000]">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-[#6037d9] bg-[#ffffff] border border-[#6037d9] rounded-md hover:bg-[#6037d9]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-[#6037d9] bg-[#ffffff] border border-[#6037d9] rounded-md hover:bg-[#6037d9]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;