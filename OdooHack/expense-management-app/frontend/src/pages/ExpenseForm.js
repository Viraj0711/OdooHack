import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { formatRupees } from '../utils/currency';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ExpenseForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'INR',
    category: '',
    expenseDate: new Date().toISOString().split('T')[0],
    vendorName: '',
    vendorEmail: '',
    paymentMethod: 'cash',
    businessPurpose: '',
    notes: '',
    receiptFile: null
  });

  const [receiptPreview, setReceiptPreview] = useState(null);

  // Expense categories
  const categories = [
    'Travel', 'Meals', 'Office Supplies', 'Software', 'Training',
    'Marketing', 'Transportation', 'Accommodation', 'Internet', 'Other'
  ];

  // Payment methods
  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'digital_wallet', label: 'Digital Wallet' },
    { value: 'check', label: 'Check' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchExpenseDetails();
    }
  }, [id, isEdit]);

  const fetchExpenseDetails = async () => {
    setLoading(true);
    try {
      // Simulated API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sample expense data
      const sampleExpense = {
        title: 'Business Trip to Mumbai',
        description: 'Flight tickets and accommodation for client meeting',
        amount: '15000',
        currency: 'INR',
        category: 'Travel',
        expenseDate: '2025-10-01',
        vendorName: 'Travel Agency Ltd',
        vendorEmail: 'bookings@travelagency.com',
        paymentMethod: 'card',
        businessPurpose: 'Client meeting and project discussion',
        notes: 'Pre-approved by manager',
        receiptUrl: null
      };

      setFormData(sampleExpense);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch expense details');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous error
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid image or PDF file');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        receiptFile: file
      }));

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setReceiptPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.title.trim()) errors.push('Title is required');
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      errors.push('Valid amount is required');
    }
    if (!formData.category) errors.push('Category is required');
    if (!formData.expenseDate) errors.push('Expense date is required');
    if (!formData.businessPurpose.trim()) errors.push('Business purpose is required');

    return errors;
  };

  const handleSubmit = async (e, asDraft = false) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (!asDraft && validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Simulated API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const expenseData = {
        ...formData,
        status: asDraft ? 'draft' : 'pending',
        submittedAt: new Date().toISOString()
      };

      console.log('Expense data:', expenseData);

      setSuccess(`Expense ${asDraft ? 'saved as draft' : 'submitted for approval'} successfully!`);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/expenses');
      }, 2000);

    } catch (err) {
      setError('Failed to save expense. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-indigo-600 mb-4">
          <button 
            onClick={() => navigate('/expenses')}
            className="hover:text-indigo-800 flex items-center space-x-1 bg-indigo-50 px-3 py-1 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Expenses</span>
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 font-medium">{isEdit ? 'Edit' : 'New'} Expense</span>
        </div>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-3">
            {isEdit ? '✏️ Edit Expense' : '✨ Create New Expense'}
          </h1>
          <p className="text-indigo-100 text-lg">
            {isEdit ? 'Update your expense details and resubmit' : 'Fill in the details for your expense submission'}
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">💼 Business Expense</span>
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">📋 Easy Form</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Expense Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Business Trip to Mumbai"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700 mb-2">
                Expense Date *
              </label>
              <input
                type="date"
                id="expenseDate"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Provide a brief description of the expense..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Vendor Information */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Vendor Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Name
              </label>
              <input
                type="text"
                id="vendorName"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleInputChange}
                placeholder="e.g., ABC Travel Agency"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="vendorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Email
              </label>
              <input
                type="email"
                id="vendorEmail"
                name="vendorEmail"
                value={formData.vendorEmail}
                onChange={handleInputChange}
                placeholder="vendor@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Business Purpose */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Business Justification</h2>
          
          <div>
            <label htmlFor="businessPurpose" className="block text-sm font-medium text-gray-700 mb-2">
              Business Purpose *
            </label>
            <textarea
              id="businessPurpose"
              name="businessPurpose"
              value={formData.businessPurpose}
              onChange={handleInputChange}
              rows={4}
              placeholder="Explain how this expense relates to business activities..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mt-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any additional information or notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Receipt Upload */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Receipt Upload</h2>
          
          <div>
            <label htmlFor="receipt" className="block text-sm font-medium text-gray-700 mb-2">
              Receipt/Invoice
            </label>
            <div className="mt-2">
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="receipt" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="receipt"
                        name="receipt"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, PDF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* File Preview */}
            {formData.receiptFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formData.receiptFile.name}</p>
                      <p className="text-sm text-gray-500">{(formData.receiptFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, receiptFile: null }));
                      setReceiptPreview(null);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                {receiptPreview && (
                  <div className="mt-4">
                    <img src={receiptPreview} alt="Receipt preview" className="max-w-xs max-h-64 object-contain rounded-md border" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 rounded-2xl shadow-xl border border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={saving}
          >
            Cancel
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={saving}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? <LoadingSpinner size="sm" /> : 'Save as Draft'}
            </button>
            
            <button
              type="submit"
              onClick={(e) => handleSubmit(e, false)}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Submitting...</span>
                </>
              ) : (
                'Submit for Approval'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;