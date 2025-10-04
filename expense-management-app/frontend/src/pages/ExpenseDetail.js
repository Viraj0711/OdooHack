import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { formatRupees } from '../utils/currency';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ExpenseDetail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    fetchExpenseDetails();
  }, [id]);

  const fetchExpenseDetails = async () => {
    setLoading(true);
    try {
      // Simulated API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample expense data
      const sampleExpense = {
        id: parseInt(id),
        title: 'Business Trip to Mumbai',
        description: 'Flight tickets and accommodation for client meeting with potential partners',
        amount: 15000,
        currency: 'INR',
        category: 'Travel',
        status: 'approved',
        submittedAt: '2025-10-01T10:00:00Z',
        approvedAt: '2025-10-02T14:30:00Z',
        expenseDate: '2025-09-28',
        vendorName: 'Travel Solutions Pvt Ltd',
        vendorEmail: 'bookings@travelsolutions.com',
        paymentMethod: 'card',
        businessPurpose: 'Meeting with potential client to discuss new project opportunities and establish business relationship. This trip was essential for expanding our business in the Mumbai market.',
        notes: 'Pre-approved by manager. Hotel booking confirmation and flight tickets attached.',
        receiptUrl: '/uploads/receipts/receipt1.jpg',
        submittedBy: {
          id: user?.id,
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          email: user?.email || 'john.doe@company.com'
        },
        approver: {
          id: 2,
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'sarah.wilson@company.com'
        },
        approvalComments: 'Approved as this aligns with our Q4 expansion goals. Good work on securing the client meeting.',
        auditTrail: [
          {
            id: 1,
            action: 'CREATED',
            timestamp: '2025-10-01T10:00:00Z',
            user: { firstName: 'John', lastName: 'Doe' },
            details: 'Expense created and submitted for approval'
          },
          {
            id: 2,
            action: 'APPROVED',
            timestamp: '2025-10-02T14:30:00Z',
            user: { firstName: 'Sarah', lastName: 'Wilson' },
            details: 'Expense approved by manager'
          }
        ]
      };

      setExpense(sampleExpense);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch expense details');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };

    const statusIcons = {
      approved: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      pending: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      rejected: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      draft: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusClasses[status] || statusClasses.draft}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      cash: 'Cash',
      card: 'Credit/Debit Card',
      bank_transfer: 'Bank Transfer',
      digital_wallet: 'Digital Wallet',
      check: 'Check',
      other: 'Other'
    };
    return methods[method] || method;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{error || 'Expense not found'}</p>
        <div className="mt-6">
          <Link
            to="/expenses"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Back to Expenses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-blue-600 mb-4">
          <Link to="/expenses" className="hover:text-blue-800 flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Expenses</span>
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 font-medium">Expense Details</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{expense.title}</h1>
            <p className="mt-2 text-gray-600">
              Submitted on {formatDate(expense.submittedAt)}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            {getStatusBadge(expense.status)}
            {(expense.status === 'draft' || expense.status === 'rejected') && (
              <Link
                to={`/expenses/${expense.id}/edit`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Expense
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Expense Information</h2>
            
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="mt-1 text-2xl font-bold text-gray-900">{formatRupees(expense.amount)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1">
                  <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    {expense.category}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Expense Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(expense.expenseDate)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                <dd className="mt-1 text-sm text-gray-900">{getPaymentMethodLabel(expense.paymentMethod)}</dd>
              </div>
            </dl>

            {expense.description && (
              <div className="mt-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{expense.description}</dd>
              </div>
            )}
          </div>

          {/* Vendor Information */}
          {(expense.vendorName || expense.vendorEmail) && (
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Vendor Information</h2>
              
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {expense.vendorName && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Vendor Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{expense.vendorName}</dd>
                  </div>
                )}
                {expense.vendorEmail && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Vendor Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{expense.vendorEmail}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Business Purpose */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Business Justification</h2>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Business Purpose</dt>
              <dd className="mt-2 text-sm text-gray-900 whitespace-pre-line">{expense.businessPurpose}</dd>
            </div>

            {expense.notes && (
              <div className="mt-6">
                <dt className="text-sm font-medium text-gray-500">Additional Notes</dt>
                <dd className="mt-2 text-sm text-gray-900 whitespace-pre-line">{expense.notes}</dd>
              </div>
            )}
          </div>

          {/* Receipt */}
          {expense.receiptUrl && (
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Receipt</h2>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Receipt attached</p>
                    <p className="text-sm text-gray-500">Click to view full size</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Receipt
                </button>
              </div>
            </div>
          )}

          {/* Approval Information */}
          {(expense.status === 'approved' || expense.status === 'rejected') && (
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Approval Details</h2>
              
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {expense.status === 'approved' ? 'Approved By' : 'Rejected By'}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {expense.approver.firstName} {expense.approver.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {expense.status === 'approved' ? 'Approved On' : 'Rejected On'}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(expense.approvedAt || expense.rejectedAt)}
                  </dd>
                </div>
              </dl>

              {expense.approvalComments && (
                <div className="mt-6">
                  <dt className="text-sm font-medium text-gray-500">Comments</dt>
                  <dd className="mt-2 text-sm text-gray-900 whitespace-pre-line">{expense.approvalComments}</dd>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl rounded-2xl p-8 border border-blue-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Link
                to="/expenses"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Expenses
              </Link>
              
              {(expense.status === 'draft' || expense.status === 'rejected') && (
                <Link
                  to={`/expenses/${expense.id}/edit`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Expense
                </Link>
              )}

              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 shadow-xl rounded-2xl p-8 border border-purple-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Trail</h3>
            
            <div className="flow-root">
              <ul className="-mb-8">
                {expense.auditTrail.map((entry, index) => (
                  <li key={entry.id}>
                    <div className="relative pb-8">
                      {index !== expense.auditTrail.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                      )}
                      <div className="relative flex space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 ring-8 ring-white">
                          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-900">
                              {entry.details}
                            </p>
                            <p className="text-xs text-gray-500">
                              by {entry.user.firstName} {entry.user.lastName}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-gray-500">
                            {formatDateTime(entry.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowReceiptModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Receipt</h3>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center">
                <img 
                  src={expense.receiptUrl} 
                  alt="Receipt" 
                  className="max-w-full max-h-96 object-contain mx-auto rounded-md border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-gray-500 py-8">
                  <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2">Unable to load receipt image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseDetail;