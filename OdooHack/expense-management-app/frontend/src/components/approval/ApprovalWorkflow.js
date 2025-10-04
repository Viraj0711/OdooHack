import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const ApprovalWorkflow = ({ expense, onApprove, onReject, onDelegate }) => {
  const { user } = useAuth();
  const [approvalLimits, setApprovalLimits] = useState({
    employee: 0,
    departmentHead: 50000,
    manager: 200000,
    finance: 1000000
  });
  const [delegatedApprovers, setDelegatedApprovers] = useState([]);
  const [bulkApprovalMode, setBulkApprovalMode] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  const getRequiredApprovers = (amount) => {
    const approvers = [];
    if (amount > approvalLimits.employee) {
      approvers.push('Department Head');
    }
    if (amount > approvalLimits.departmentHead) {
      approvers.push('Manager');
    }
    if (amount > approvalLimits.manager) {
      approvers.push('Finance Team');
    }
    return approvers;
  };

  const getApprovalStatus = (expense) => {
    const requiredApprovers = getRequiredApprovers(expense.amount);
    const currentApprovals = expense.approvals || [];
    
    return {
      required: requiredApprovers,
      completed: currentApprovals,
      pending: requiredApprovers.filter(approver => 
        !currentApprovals.some(approval => approval.role === approver)
      ),
      canApprove: requiredApprovers.includes(user.role) && 
                  !currentApprovals.some(approval => approval.userId === user.id)
    };
  };

  const handleBulkApproval = async (expenses, action) => {
    const results = [];
    for (const expense of expenses) {
      try {
        if (action === 'approve') {
          await onApprove(expense.id, {
            userId: user.id,
            role: user.role,
            comments: 'Bulk approval',
            timestamp: new Date().toISOString()
          });
        } else {
          await onReject(expense.id, {
            userId: user.id,
            role: user.role,
            comments: 'Bulk rejection',
            timestamp: new Date().toISOString()
          });
        }
        results.push({ id: expense.id, status: 'success' });
      } catch (error) {
        results.push({ id: expense.id, status: 'error', error });
      }
    }
    return results;
  };

  const ApprovalSteps = ({ expense }) => {
    const status = getApprovalStatus(expense);
    
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Approval Workflow</h4>
        <div className="space-y-2">
          {status.required.map((approver, index) => {
            const isCompleted = status.completed.some(approval => approval.role === approver);
            const isPending = status.pending.includes(approver);
            
            return (
              <div key={approver} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500 text-white' : 
                  isPending ? 'bg-yellow-500 text-white' : 
                  'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isCompleted ? 'text-green-600' : 
                    isPending ? 'text-yellow-600' : 
                    'text-gray-500'
                  }`}>
                    {approver}
                  </p>
                  {isCompleted && (
                    <p className="text-xs text-gray-500">
                      Approved by {status.completed.find(a => a.role === approver)?.userName}
                    </p>
                  )}
                </div>
                <div>
                  {isCompleted && (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isPending && (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ApprovalActions = ({ expense }) => {
    const status = getApprovalStatus(expense);
    const [comments, setComments] = useState('');
    const [delegateeTo, setDelegateeTo] = useState('');

    if (!status.canApprove) {
      return null;
    }

    return (
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900">Your Approval Required</h5>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comments (Optional)
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Add approval comments..."
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => onApprove(expense.id, {
              userId: user.id,
              role: user.role,
              comments,
              timestamp: new Date().toISOString()
            })}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            ✅ Approve
          </button>
          
          <button
            onClick={() => onReject(expense.id, {
              userId: user.id,
              role: user.role,
              comments,
              timestamp: new Date().toISOString()
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            ❌ Reject
          </button>

          <button
            onClick={() => {
              // Open delegate modal
              setDelegateeTo('');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            👥 Delegate
          </button>
        </div>
      </div>
    );
  };

  const BulkApprovalInterface = ({ expenses }) => {
    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const [bulkComments, setBulkComments] = useState('');

    const handleSelectAll = () => {
      if (selectedExpenses.length === expenses.length) {
        setSelectedExpenses([]);
      } else {
        setSelectedExpenses(expenses.map(e => e.id));
      }
    };

    const handleBulkAction = async (action) => {
      const expensesToProcess = expenses.filter(e => selectedExpenses.includes(e.id));
      const results = await handleBulkApproval(expensesToProcess, action);
      
      // Show results notification
      const successful = results.filter(r => r.status === 'success').length;
      const failed = results.filter(r => r.status === 'error').length;
      
      alert(`Bulk ${action}: ${successful} successful, ${failed} failed`);
      setSelectedExpenses([]);
    };

    return (
      <div className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Bulk Approval Interface</h4>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedExpenses.length === expenses.length}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Select All</span>
          </label>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {expenses.map(expense => (
            <div key={expense.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={selectedExpenses.includes(expense.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedExpenses([...selectedExpenses, expense.id]);
                  } else {
                    setSelectedExpenses(selectedExpenses.filter(id => id !== expense.id));
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{expense.title}</p>
                <p className="text-xs text-gray-500">₹{expense.amount.toLocaleString()} • {expense.submittedBy}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedExpenses.length > 0 && (
          <div className="space-y-3">
            <textarea
              value={bulkComments}
              onChange={(e) => setBulkComments(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="Bulk approval comments..."
            />
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                ✅ Bulk Approve ({selectedExpenses.length})
              </button>
              
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                ❌ Bulk Reject ({selectedExpenses.length})
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {expense && (
        <>
          <ApprovalSteps expense={expense} />
          <ApprovalActions expense={expense} />
        </>
      )}
      
      {bulkApprovalMode && (
        <BulkApprovalInterface expenses={selectedExpenses} />
      )}
    </div>
  );
};

export default ApprovalWorkflow;