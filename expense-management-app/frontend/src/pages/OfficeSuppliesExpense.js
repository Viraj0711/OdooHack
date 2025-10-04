import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { formatRupees } from '../utils/currency';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OfficeSuppliesExpense = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  const fetchExpenseDetails = async () => {
    setLoading(true);
    try {
      // Simulated API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample Office Supplies expense data
      const officeSuppliesExpense = {
        id: 2,
        title: 'Office Supplies Purchase',
        description: 'Essential office supplies including stationery, printer cartridges, notebooks, and desk accessories for the quarterly office restocking',
        amount: 2500,
        currency: 'INR',
        category: 'Office Supplies',
        status: 'pending',
        submittedAt: '2025-10-02T14:30:00Z',
        expenseDate: '2025-10-02',
        vendorName: 'Office Mart India Pvt Ltd',
        vendorEmail: 'orders@officemart.in',
        paymentMethod: 'card',
        businessPurpose: 'Quarterly restocking of essential office supplies to maintain productivity and ensure smooth daily operations. Items include printer cartridges for HP and Canon printers, A4 printing paper, ballpoint pens, notebooks, sticky notes, file folders, and desk organizers. These supplies are critical for maintaining office efficiency and supporting team productivity.',
        notes: 'Approved by Department Head. Bulk purchase to get corporate discount. Receipt includes detailed itemization of all supplies.',
        receiptUrl: '/uploads/receipts/office-supplies-receipt.jpg',
        submittedBy: {
          id: user?.id,
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          email: user?.email || 'john.doe@company.com'
        },
        approver: null,
        approvalComments: null,
        // Detailed items breakdown
        itemsBreakdown: [
          { item: 'HP 305 Black Ink Cartridge (2 units)', quantity: 2, unitPrice: 450, total: 900 },
          { item: 'Canon PG-47 Color Cartridge (1 unit)', quantity: 1, unitPrice: 550, total: 550 },
          { item: 'A4 Printing Paper (5 reams)', quantity: 5, unitPrice: 120, total: 600 },
          { item: 'Blue Ballpoint Pens (Box of 20)', quantity: 2, unitPrice: 80, total: 160 },
          { item: 'Spiral Notebooks (Pack of 10)', quantity: 1, unitPrice: 200, total: 200 },
          { item: 'Sticky Notes Multi-color (Pack of 12)', quantity: 1, unitPrice: 90, total: 90 }
        ],
        auditTrail: [
          {
            id: 1,
            action: 'CREATED',
            timestamp: '2025-10-02T14:30:00Z',
            user: { firstName: 'John', lastName: 'Doe' },
            details: 'Office supplies expense created and submitted for approval'
          },
          {
            id: 2,
            action: 'REVIEWED',
            timestamp: '2025-10-02T16:45:00Z',
            user: { firstName: 'Sarah', lastName: 'Wilson' },
            details: 'Expense reviewed by manager - pending final approval'
          }
        ]
      };

      setExpense(officeSuppliesExpense);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-orange-600 mb-4">
            <Link to="/expenses" className="hover:text-orange-800 flex items-center space-x-1 bg-orange-50 px-3 py-1 rounded-full transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Expenses</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-medium">Office Supplies Details</span>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">📄 {expense.title}</h1>
                    <p className="text-orange-100 text-lg mt-1">
                      Office Supplies & Stationery Purchase
                    </p>
                  </div>
                </div>
                <p className="text-orange-100">
                  Submitted on {formatDate(expense.submittedAt)} • {expense.category}
                </p>
              </div>
              
              <div className="mt-6 sm:mt-0 flex items-center space-x-3">
                {getStatusBadge(expense.status)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">📋 Expense Information</h2>
              </div>
              
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                  <dt className="text-sm font-medium text-gray-600">💰 Total Amount</dt>
                  <dd className="mt-1 text-3xl font-bold text-green-600">{formatRupees(expense.amount)}</dd>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <dt className="text-sm font-medium text-gray-600">📁 Category</dt>
                  <dd className="mt-1">
                    <span className="px-3 py-2 text-lg font-bold bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 rounded-full border-2 border-orange-200">
                      🏢 {expense.category}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">📅 Purchase Date</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">{formatDate(expense.expenseDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">💳 Payment Method</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">{getPaymentMethodLabel(expense.paymentMethod)}</dd>
                </div>
              </dl>

              {expense.description && (
                <div className="mt-6 bg-gray-50 p-4 rounded-xl">
                  <dt className="text-sm font-medium text-gray-500 mb-2">📝 Description</dt>
                  <dd className="text-sm text-gray-900 leading-relaxed">{expense.description}</dd>
                </div>
              )}
            </div>

            {/* Items Breakdown */}
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">📦 Items Breakdown</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-50 to-amber-50">
                      <th className="px-4 py-3 text-left text-xs font-bold text-orange-800 uppercase">Item Description</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-orange-800 uppercase">Qty</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-orange-800 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-orange-800 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expense.itemsBreakdown.map((item, index) => (
                      <tr key={index} className="hover:bg-orange-25 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.item}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{formatRupees(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">{formatRupees(item.total)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-t-2 border-green-200">
                      <td colSpan="3" className="px-4 py-4 text-right font-bold text-gray-900 text-lg">
                        💰 Grand Total:
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-green-600 text-xl">
                        {formatRupees(expense.itemsBreakdown.reduce((sum, item) => sum + item.total, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vendor Information */}
            {(expense.vendorName || expense.vendorEmail) && (
              <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">🏪 Vendor Information</h2>
                </div>
                
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {expense.vendorName && (
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <dt className="text-sm font-medium text-blue-600">🏢 Vendor Name</dt>
                      <dd className="mt-1 text-lg font-bold text-blue-900">{expense.vendorName}</dd>
                    </div>
                  )}
                  {expense.vendorEmail && (
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <dt className="text-sm font-medium text-blue-600">📧 Contact Email</dt>
                      <dd className="mt-1 text-lg font-bold text-blue-900">{expense.vendorEmail}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Business Purpose */}
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">🎯 Business Justification</h2>
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-xl">
                <dt className="text-sm font-medium text-indigo-600 mb-3">💼 Business Purpose</dt>
                <dd className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">{expense.businessPurpose}</dd>
              </div>

              {expense.notes && (
                <div className="mt-6 bg-purple-50 p-6 rounded-xl">
                  <dt className="text-sm font-medium text-purple-600 mb-3">📝 Additional Notes</dt>
                  <dd className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">{expense.notes}</dd>
                </div>
              )}
            </div>

            {/* Receipt */}
            {expense.receiptUrl && (
              <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">📎 Receipt & Documentation</h2>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-800">📄 Official Receipt Attached</p>
                      <p className="text-green-600">Detailed itemization with vendor information</p>
                      <p className="text-sm text-green-500 mt-1">✅ Verified • 📊 Itemized • 🏢 Corporate Discount Applied</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    🔍 View Receipt
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-100 shadow-xl rounded-2xl p-8 border border-orange-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-6 h-6 bg-orange-400 rounded-lg flex items-center justify-center mr-3">
                  ⚡
                </span>
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Link
                  to="/expenses"
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-orange-300 rounded-xl text-sm font-bold text-orange-700 bg-white hover:bg-orange-50 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Expenses
                </Link>
                
                <Link
                  to="/expenses/2/edit"
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-sm font-bold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Details
                </Link>

                <button className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </button>
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 shadow-xl rounded-2xl p-8 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-6 h-6 bg-purple-400 rounded-lg flex items-center justify-center mr-3">
                  📋
                </span>
                Audit Trail
              </h3>
              
              <div className="flow-root">
                <ul className="-mb-8">
                  {expense.auditTrail.map((entry, index) => (
                    <li key={entry.id}>
                      <div className="relative pb-8">
                        {index !== expense.auditTrail.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-purple-200" />
                        )}
                        <div className="relative flex space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600 ring-8 ring-white shadow-lg">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {entry.details}
                              </p>
                              <p className="text-xs text-purple-600 font-medium">
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
                <h3 className="text-lg font-medium text-gray-900">📄 Office Supplies Receipt</h3>
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
                <div className="bg-gray-100 p-8 rounded-lg">
                  <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 font-medium">📄 Official Receipt Available</p>
                  <p className="text-sm text-gray-500 mt-2">Receipt contains detailed itemization of all office supplies purchased</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeSuppliesExpense;