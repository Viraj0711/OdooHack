import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const FinancialControls = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [taxRates, setTaxRates] = useState({
    cgst: 9,
    sgst: 9,
    igst: 18,
    tds: 10
  });

  // Budget Management Component
  const BudgetTracker = ({ category, department, project }) => {
    const [budgetData, setBudgetData] = useState({
      allocated: 0,
      spent: 0,
      remaining: 0,
      percentage: 0
    });

    const [budgetAlerts, setBudgetAlerts] = useState([]);

    useEffect(() => {
      fetchBudgetData();
    }, [category, department, project]);

    const fetchBudgetData = async () => {
      // Simulate API call
      const mockData = {
        allocated: 100000,
        spent: 75000,
        remaining: 25000,
        percentage: 75
      };
      setBudgetData(mockData);

      // Check for budget alerts
      if (mockData.percentage > 90) {
        setBudgetAlerts(['Budget exceeded 90% threshold']);
      } else if (mockData.percentage > 80) {
        setBudgetAlerts(['Budget approaching limit (80% used)']);
      }
    };

    const getBudgetStatus = () => {
      if (budgetData.percentage > 100) return 'over';
      if (budgetData.percentage > 90) return 'critical';
      if (budgetData.percentage > 80) return 'warning';
      return 'healthy';
    };

    const statusColors = {
      healthy: 'bg-green-500',
      warning: 'bg-yellow-500',
      critical: 'bg-orange-500',
      over: 'bg-red-500'
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Tracker</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Budget Utilization</span>
            <span className="text-sm font-medium">{budgetData.percentage.toFixed(1)}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${statusColors[getBudgetStatus()]}`}
              style={{ width: `${Math.min(budgetData.percentage, 100)}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">Allocated</p>
              <p className="text-lg font-semibold text-blue-600">₹{budgetData.allocated.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Spent</p>
              <p className="text-lg font-semibold text-red-600">₹{budgetData.spent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Remaining</p>
              <p className="text-lg font-semibold text-green-600">₹{budgetData.remaining.toLocaleString()}</p>
            </div>
          </div>

          {budgetAlerts.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Budget Alert</h4>
                  <ul className="mt-1 text-xs text-yellow-700">
                    {budgetAlerts.map((alert, index) => (
                      <li key={index}>{alert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Expense Policy Validator
  const PolicyValidator = ({ expense }) => {
    const [violations, setViolations] = useState([]);
    const [policyChecks, setPolicyChecks] = useState([]);

    useEffect(() => {
      validateExpense(expense);
    }, [expense]);

    const validateExpense = async (expense) => {
      const checks = [];
      const newViolations = [];

      // Sample policy validations
      if (expense.amount > 50000 && !expense.receiptUrl) {
        newViolations.push({
          type: 'missing_receipt',
          message: 'Receipt required for expenses above ₹50,000',
          severity: 'error'
        });
      }

      if (expense.category === 'Travel' && expense.amount > 100000) {
        newViolations.push({
          type: 'travel_limit',
          message: 'Travel expenses above ₹1,00,000 require pre-approval',
          severity: 'warning'
        });
      }

      if (!expense.businessPurpose || expense.businessPurpose.length < 20) {
        newViolations.push({
          type: 'insufficient_justification',
          message: 'Business justification must be at least 20 characters',
          severity: 'warning'
        });
      }

      // Date validation
      const expenseDate = new Date(expense.date);
      const daysDiff = Math.floor((new Date() - expenseDate) / (1000 * 60 * 60 * 24));
      if (daysDiff > 30) {
        newViolations.push({
          type: 'late_submission',
          message: 'Expenses should be submitted within 30 days',
          severity: 'warning'
        });
      }

      setViolations(newViolations);
      setPolicyChecks([
        { name: 'Receipt Attachment', status: expense.receiptUrl ? 'pass' : 'fail' },
        { name: 'Business Justification', status: expense.businessPurpose?.length > 20 ? 'pass' : 'fail' },
        { name: 'Amount Threshold', status: expense.amount <= 50000 ? 'pass' : 'warning' },
        { name: 'Submission Timeline', status: daysDiff <= 30 ? 'pass' : 'warning' }
      ]);
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Compliance</h3>
        
        <div className="space-y-3">
          {policyChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{check.name}</span>
              <div className="flex items-center space-x-2">
                {check.status === 'pass' && (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {check.status === 'fail' && (
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {check.status === 'warning' && (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {violations.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Policy Violations</h4>
            {violations.map((violation, index) => (
              <div key={index} className={`p-3 rounded-md ${
                violation.severity === 'error' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex">
                  <svg className={`w-5 h-5 ${violation.severity === 'error' ? 'text-red-400' : 'text-yellow-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-3">
                    <p className={`text-xs ${violation.severity === 'error' ? 'text-red-800' : 'text-yellow-800'}`}>
                      {violation.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Tax Calculator Component
  const TaxCalculator = ({ expense, onTaxCalculated }) => {
    const [taxBreakdown, setTaxBreakdown] = useState({});
    const [totalTax, setTotalTax] = useState(0);

    useEffect(() => {
      calculateTax(expense);
    }, [expense]);

    const calculateTax = (expense) => {
      const baseAmount = expense.amount || 0;
      let breakdown = {};
      let total = 0;

      // GST Calculation based on category
      if (expense.category === 'Office Supplies' || expense.category === 'Software') {
        breakdown.cgst = (baseAmount * taxRates.cgst) / 100;
        breakdown.sgst = (baseAmount * taxRates.sgst) / 100;
        total += breakdown.cgst + breakdown.sgst;
      }

      // TDS for certain categories
      if (expense.category === 'Professional Services' && baseAmount > 30000) {
        breakdown.tds = (baseAmount * taxRates.tds) / 100;
        total += breakdown.tds;
      }

      setTaxBreakdown(breakdown);
      setTotalTax(total);
      
      if (onTaxCalculated) {
        onTaxCalculated({ breakdown, total });
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Calculation</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Base Amount</span>
            <span className="text-sm font-medium">₹{(expense.amount || 0).toLocaleString()}</span>
          </div>

          {Object.entries(taxBreakdown).map(([taxType, amount]) => (
            <div key={taxType} className="flex justify-between">
              <span className="text-sm text-gray-600">{taxType.toUpperCase()}</span>
              <span className="text-sm font-medium">₹{amount.toLocaleString()}</span>
            </div>
          ))}

          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-gray-900">Total Tax</span>
              <span className="text-sm font-semibold text-red-600">₹{totalTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm font-semibold text-gray-900">Final Amount</span>
              <span className="text-sm font-semibold text-blue-600">₹{((expense.amount || 0) + totalTax).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Cost Center Allocation
  const CostCenterSelector = ({ onCostCenterChange, selectedCostCenter }) => {
    const [costCenters] = useState([
      { id: 'cc001', name: 'Marketing', description: 'Marketing and promotional activities' },
      { id: 'cc002', name: 'R&D', description: 'Research and development' },
      { id: 'cc003', name: 'Operations', description: 'Day-to-day operations' },
      { id: 'cc004', name: 'HR', description: 'Human resources' },
      { id: 'cc005', name: 'Finance', description: 'Finance and accounting' }
    ]);

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Center Allocation</h3>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Select Cost Center *
          </label>
          <select
            value={selectedCostCenter || ''}
            onChange={(e) => onCostCenterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a cost center...</option>
            {costCenters.map(center => (
              <option key={center.id} value={center.id}>
                {center.name} - {center.description}
              </option>
            ))}
          </select>
          
          {selectedCostCenter && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-700">
                This expense will be allocated to the selected cost center for budget tracking and reporting.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return {
    BudgetTracker,
    PolicyValidator,
    TaxCalculator,
    CostCenterSelector
  };
};

export default FinancialControls;