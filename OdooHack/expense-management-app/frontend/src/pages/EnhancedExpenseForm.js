import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { formatRupees } from '../utils/currency';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Import advanced feature components
import AdvancedReceiptManager from '../components/receipt/AdvancedReceiptManager';
import FinancialControls from '../components/financial/FinancialControls';

const EnhancedExpenseForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

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
    receiptFile: null,
    // Advanced fields
    costCenter: '',
    projectCode: '',
    taxAmount: 0,
    gstRate: 18,
    isReimbursable: true,
    approvalRequired: true,
    priority: 'normal'
  });

  const [receiptPreview, setReceiptPreview] = useState(null);
  const [policyViolations, setPolicyViolations] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [taxCalculation, setTaxCalculation] = useState(null);

  // Expense categories with icons and descriptions
  const categories = [
    { value: 'travel', label: 'Travel', icon: '✈️', description: 'Flights, trains, local transport' },
    { value: 'meals', label: 'Meals & Entertainment', icon: '🍽️', description: 'Business meals, client entertainment' },
    { value: 'office_supplies', label: 'Office Supplies', icon: '📚', description: 'Stationery, equipment, furniture' },
    { value: 'software', label: 'Software & Subscriptions', icon: '💻', description: 'SaaS tools, licenses, apps' },
    { value: 'training', label: 'Training & Development', icon: '🎓', description: 'Courses, seminars, certifications' },
    { value: 'marketing', label: 'Marketing', icon: '📢', description: 'Advertising, events, materials' },
    { value: 'accommodation', label: 'Accommodation', icon: '🏨', description: 'Hotels, lodging expenses' },
    { value: 'internet', label: 'Internet & Phone', icon: '📞', description: 'Data plans, phone bills' },
    { value: 'other', label: 'Other', icon: '📋', description: 'Miscellaneous business expenses' }
  ];

  // Payment methods
  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
    { value: 'digital_wallet', label: 'Digital Wallet', icon: '📱' },
    { value: 'check', label: 'Check', icon: '📄' },
    { value: 'other', label: 'Other', icon: '💰' }
  ];

  // Cost centers
  const costCenters = [
    { value: 'sales', label: 'Sales Department' },
    { value: 'marketing', label: 'Marketing Department' },
    { value: 'engineering', label: 'Engineering Department' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance Department' },
    { value: 'general', label: 'General & Admin' }
  ];

  // GST rates
  const gstRates = [0, 5, 12, 18, 28];

  useEffect(() => {
    if (isEdit) {
      fetchExpenseDetails();
    }
  }, [id, isEdit]);

  useEffect(() => {
    // Check policies and budget when form data changes
    if (formData.amount && formData.category) {
      checkPolicies();
      checkBudget();
      calculateTax();
    }
  }, [formData.amount, formData.category, formData.gstRate]);

  const fetchExpenseDetails = async () => {
    setLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const sampleExpense = {
        title: 'Business Trip to Mumbai',
        description: 'Flight tickets and accommodation for client meeting',
        amount: '15000',
        currency: 'INR',
        category: 'travel',
        expenseDate: '2025-10-01',
        vendorName: 'Travel Agency Ltd',
        vendorEmail: 'bookings@travelagency.com',
        paymentMethod: 'card',
        businessPurpose: 'Client meeting and project discussion',
        notes: 'Pre-approved by manager',
        receiptFile: null,
        costCenter: 'sales',
        projectCode: 'PROJ-001',
        taxAmount: 2700,
        gstRate: 18,
        isReimbursable: true,
        approvalRequired: true,
        priority: 'normal'
      };

      setFormData(sampleExpense);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch expense details');
      setLoading(false);
    }
  };

  const checkPolicies = () => {
    const violations = [];
    const amount = parseFloat(formData.amount);

    // Policy checks
    if (amount > 50000 && !formData.receiptFile) {
      violations.push({
        type: 'missing_receipt',
        severity: 'high',
        message: 'Receipt required for expenses above ₹50,000'
      });
    }

    if (formData.category === 'meals' && amount > 5000) {
      violations.push({
        type: 'meal_limit',
        severity: 'medium',
        message: 'Meal expenses above ₹5,000 require manager approval'
      });
    }

    if (!formData.businessPurpose || formData.businessPurpose.length < 10) {
      violations.push({
        type: 'insufficient_purpose',
        severity: 'low',
        message: 'Business purpose should be more detailed'
      });
    }

    setPolicyViolations(violations);
  };

  const checkBudget = () => {
    const amount = parseFloat(formData.amount);
    const category = formData.category;

    // Simulate budget check
    const budgets = {
      travel: { allocated: 100000, used: 75000 },
      meals: { allocated: 30000, used: 15000 },
      office_supplies: { allocated: 50000, used: 20000 },
      software: { allocated: 200000, used: 120000 }
    };

    const budget = budgets[category];
    if (budget) {
      const remaining = budget.allocated - budget.used;
      const afterExpense = remaining - amount;
      
      setBudgetStatus({
        allocated: budget.allocated,
        used: budget.used,
        remaining: remaining,
        afterExpense: afterExpense,
        percentage: ((budget.used + amount) / budget.allocated) * 100,
        withinBudget: afterExpense >= 0
      });
    } else {
      setBudgetStatus(null);
    }
  };

  const calculateTax = () => {
    const amount = parseFloat(formData.amount) || 0;
    const gstRate = formData.gstRate || 0;
    
    if (amount > 0) {
      const baseAmount = amount / (1 + gstRate / 100);
      const taxAmount = amount - baseAmount;
      
      setTaxCalculation({
        baseAmount: baseAmount,
        taxAmount: taxAmount,
        totalAmount: amount,
        gstRate: gstRate
      });
    } else {
      setTaxCalculation(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleFileChange = (file) => {
    if (file) {
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

  const handleOCRResult = (ocrData) => {
    // Update form with OCR extracted data
    if (ocrData.amount) {
      setFormData(prev => ({
        ...prev,
        amount: ocrData.amount.toString()
      }));
    }
    if (ocrData.vendor) {
      setFormData(prev => ({
        ...prev,
        vendorName: ocrData.vendor
      }));
    }
    if (ocrData.date) {
      setFormData(prev => ({
        ...prev,
        expenseDate: ocrData.date
      }));
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

    // Policy validation
    const highSeverityViolations = policyViolations.filter(v => v.severity === 'high');
    if (highSeverityViolations.length > 0) {
      errors.push('Please resolve all high-severity policy violations');
    }

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
    try {
      // Prepare form data for submission
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'receiptFile' && formData[key]) {
          submitData.append('receipt', formData[key]);
        } else if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      submitData.append('status', asDraft ? 'draft' : 'pending');
      submitData.append('submittedBy', user.id);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess(asDraft ? 'Expense saved as draft successfully!' : 'Expense submitted successfully!');
      
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Expense' : 'Create New Expense'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update your expense details' : 'Fill in the details for your new expense'}
          </p>
        </div>
        <button
          onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
          className="px-4 py-2 bg-gradient-to-r from-[#FFD6E2] to-[#ff6b9d] text-gray-900 rounded-lg hover:shadow-lg transition-all"
        >
          {showAdvancedFeatures ? '🔽' : '🔼'} Advanced Features
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Policy Violations Alert */}
      {policyViolations.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium mb-2">⚠️ Policy Violations Detected</h3>
          <ul className="space-y-1">
            {policyViolations.map((violation, index) => (
              <li key={index} className={`text-sm ${
                violation.severity === 'high' ? 'text-red-700' :
                violation.severity === 'medium' ? 'text-yellow-700' :
                'text-blue-700'
              }`}>
                • {violation.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Budget Status */}
      {budgetStatus && (
        <div className={`border rounded-lg p-4 ${
          budgetStatus.withinBudget ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <h3 className={`font-medium mb-2 ${
            budgetStatus.withinBudget ? 'text-green-800' : 'text-red-800'
          }`}>
            💰 Budget Impact
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Allocated:</span>
              <div className="font-medium">{formatRupees(budgetStatus.allocated)}</div>
            </div>
            <div>
              <span className="text-gray-600">Used:</span>
              <div className="font-medium">{formatRupees(budgetStatus.used)}</div>
            </div>
            <div>
              <span className="text-gray-600">Remaining:</span>
              <div className="font-medium">{formatRupees(budgetStatus.remaining)}</div>
            </div>
            <div>
              <span className="text-gray-600">After Expense:</span>
              <div className={`font-medium ${budgetStatus.withinBudget ? 'text-green-600' : 'text-red-600'}`}>
                {formatRupees(budgetStatus.afterExpense)}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  budgetStatus.percentage > 100 ? 'bg-red-500' :
                  budgetStatus.percentage > 80 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {budgetStatus.percentage.toFixed(1)}% of budget utilized
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter expense title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Date *
              </label>
              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.icon} {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Center
              </label>
              <select
                name="costCenter"
                value={formData.costCenter}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select cost center...</option>
                {costCenters.map((center) => (
                  <option key={center.value} value={center.value}>
                    {center.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide additional details about the expense"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Purpose *
            </label>
            <textarea
              name="businessPurpose"
              value={formData.businessPurpose}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Explain the business purpose of this expense"
              required
            />
          </div>
        </div>

        {/* Vendor Information */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vendor Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Name
              </label>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter vendor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Email
              </label>
              <input
                type="email"
                name="vendorEmail"
                value={formData.vendorEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter vendor email"
              />
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tax Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Rate (%)
              </label>
              <select
                name="gstRate"
                value={formData.gstRate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {gstRates.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}%
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Code
              </label>
              <input
                type="text"
                name="projectCode"
                value={formData.projectCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., PROJ-001"
              />
            </div>
          </div>

          {/* Tax Calculation Display */}
          {taxCalculation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-blue-800 font-medium mb-3">Tax Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Base Amount:</span>
                  <div className="font-medium">{formatRupees(taxCalculation.baseAmount)}</div>
                </div>
                <div>
                  <span className="text-blue-600">GST ({taxCalculation.gstRate}%):</span>
                  <div className="font-medium">{formatRupees(taxCalculation.taxAmount)}</div>
                </div>
                <div>
                  <span className="text-blue-600">Total Amount:</span>
                  <div className="font-medium">{formatRupees(taxCalculation.totalAmount)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Receipt Management */}
        {showAdvancedFeatures && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Advanced Receipt Management</h2>
            <AdvancedReceiptManager 
              onFileSelect={handleFileChange}
              onOCRComplete={handleOCRResult}
              currentFile={formData.receiptFile}
            />
          </div>
        )}

        {/* Regular Receipt Upload */}
        {!showAdvancedFeatures && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Receipt</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="receipt"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="receipt"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-gray-600">
                  {formData.receiptFile ? formData.receiptFile.name : 'Click to upload receipt'}
                </span>
                <span className="text-sm text-gray-400">PNG, JPG, GIF, or PDF (max 10MB)</span>
              </label>
            </div>

            {receiptPreview && (
              <div className="mt-4">
                <img
                  src={receiptPreview}
                  alt="Receipt preview"
                  className="max-w-full h-64 object-contain mx-auto border border-gray-200 rounded"
                />
              </div>
            )}
          </div>
        )}

        {/* Advanced Features Section */}
        {showAdvancedFeatures && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Advanced Options</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isReimbursable"
                  checked={formData.isReimbursable}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  This expense is reimbursable
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="approvalRequired"
                  checked={formData.approvalRequired}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Requires manager approval
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">🟢 Low</option>
                  <option value="normal">🟡 Normal</option>
                  <option value="high">🔴 High</option>
                  <option value="urgent">🚨 Urgent</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Notes</h2>
          
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any additional notes or comments..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              '💾 Save as Draft'
            )}
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-[#FFD6E2] to-[#ff6b9d] text-gray-900 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              '🚀 Submit Expense'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedExpenseForm;