import React, { useState, useEffect } from 'react';

const IntegrationAutomation = () => {
  const [integrations, setIntegrations] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);
  const [connectedSystems, setConnectedSystems] = useState([]);
  const [selectedTab, setSelectedTab] = useState('integrations');

  // Available integrations
  const availableIntegrations = [
    {
      id: 'accounting_tally',
      name: 'Tally ERP',
      type: 'accounting',
      icon: '📊',
      description: 'Sync expenses with Tally accounting software',
      status: 'available',
      features: ['Auto expense posting', 'Chart of accounts sync', 'GST compliance']
    },
    {
      id: 'banking_icici',
      name: 'ICICI Bank',
      type: 'banking',
      icon: '🏦',
      description: 'Import bank statements and credit card transactions',
      status: 'connected',
      features: ['Transaction import', 'Auto-categorization', 'Duplicate detection']
    },
    {
      id: 'email_outlook',
      name: 'Microsoft Outlook',
      type: 'email',
      icon: '📧',
      description: 'Extract receipts from email attachments',
      status: 'available',
      features: ['Email scanning', 'Receipt extraction', 'Auto-processing']
    },
    {
      id: 'travel_makemytrip',
      name: 'MakeMyTrip',
      type: 'travel',
      icon: '✈️',
      description: 'Import travel bookings and expenses',
      status: 'available',
      features: ['Booking import', 'Travel expense creation', 'Itinerary sync']
    },
    {
      id: 'hr_bamboohr',
      name: 'BambooHR',
      type: 'hr',
      icon: '👥',
      description: 'Sync employee data and organizational structure',
      status: 'connected',
      features: ['Employee sync', 'Department mapping', 'Manager hierarchy']
    },
    {
      id: 'cloud_drive',
      name: 'Google Drive',
      type: 'storage',
      icon: '☁️',
      description: 'Store and organize expense receipts',
      status: 'available',
      features: ['Receipt backup', 'Folder organization', 'Sharing controls']
    }
  ];

  // Integration Configuration Component
  const IntegrationConfig = ({ integration, onConnect, onDisconnect }) => {
    const [config, setConfig] = useState({});
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = async () => {
      setIsConnecting(true);
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onConnect(integration.id, config);
      setIsConnecting(false);
    };

    const getConfigFields = () => {
      switch (integration.type) {
        case 'accounting':
          return [
            { key: 'server_url', label: 'Server URL', type: 'url', required: true },
            { key: 'company_db', label: 'Company Database', type: 'text', required: true },
            { key: 'username', label: 'Username', type: 'text', required: true },
            { key: 'password', label: 'Password', type: 'password', required: true }
          ];
        case 'banking':
          return [
            { key: 'account_number', label: 'Account Number', type: 'text', required: true },
            { key: 'api_key', label: 'API Key', type: 'password', required: true },
            { key: 'sync_days', label: 'Sync Last N Days', type: 'number', required: false, default: 30 }
          ];
        case 'email':
          return [
            { key: 'email_address', label: 'Email Address', type: 'email', required: true },
            { key: 'app_password', label: 'App Password', type: 'password', required: true },
            { key: 'folder_name', label: 'Receipt Folder', type: 'text', required: false, default: 'Receipts' }
          ];
        default:
          return [
            { key: 'api_key', label: 'API Key', type: 'password', required: true },
            { key: 'endpoint', label: 'API Endpoint', type: 'url', required: false }
          ];
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-3xl">{integration.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
            <p className="text-sm text-gray-600">{integration.description}</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {integration.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        {integration.status === 'available' ? (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Configuration:</h4>
            {getConfigFields().map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  value={config[field.key] || field.default || ''}
                  onChange={(e) => setConfig({...config, [field.key]: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={field.placeholder}
                  required={field.required}
                />
              </div>
            ))}
            
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                '🔗 Connect Integration'
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 font-medium">Connected</span>
            </div>
            <button
              onClick={() => onDisconnect(integration.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              🔌 Disconnect
            </button>
          </div>
        )}
      </div>
    );
  };

  // Automation Rules Component
  const AutomationRules = () => {
    const [rules, setRules] = useState([
      {
        id: 1,
        name: 'Auto-approve small expenses',
        description: 'Automatically approve expenses under ₹5,000 from verified employees',
        trigger: 'expense_submitted',
        conditions: [
          { field: 'amount', operator: 'less_than', value: 5000 },
          { field: 'employee_status', operator: 'equals', value: 'verified' }
        ],
        actions: [
          { type: 'approve_expense', level: 1 },
          { type: 'send_notification', recipient: 'employee' }
        ],
        status: 'active',
        executions: 45
      },
      {
        id: 2,
        name: 'Receipt reminder',
        description: 'Send reminder to employees missing receipts after 24 hours',
        trigger: 'expense_missing_receipt',
        conditions: [
          { field: 'hours_since_submission', operator: 'greater_than', value: 24 }
        ],
        actions: [
          { type: 'send_email', template: 'receipt_reminder' },
          { type: 'create_task', assignee: 'employee' }
        ],
        status: 'active',
        executions: 12
      },
      {
        id: 3,
        name: 'Policy violation alert',
        description: 'Alert managers when expenses violate company policies',
        trigger: 'policy_violation',
        conditions: [
          { field: 'violation_severity', operator: 'in', value: ['medium', 'high'] }
        ],
        actions: [
          { type: 'send_notification', recipient: 'manager' },
          { type: 'flag_expense', priority: 'high' }
        ],
        status: 'active',
        executions: 8
      }
    ]);

    const [showRuleBuilder, setShowRuleBuilder] = useState(false);
    const [newRule, setNewRule] = useState({
      name: '',
      description: '',
      trigger: '',
      conditions: [],
      actions: [],
      status: 'active'
    });

    const availableTriggers = [
      { key: 'expense_submitted', label: 'Expense Submitted' },
      { key: 'expense_approved', label: 'Expense Approved' },
      { key: 'expense_rejected', label: 'Expense Rejected' },
      { key: 'receipt_uploaded', label: 'Receipt Uploaded' },
      { key: 'policy_violation', label: 'Policy Violation' },
      { key: 'budget_threshold', label: 'Budget Threshold Reached' }
    ];

    const availableConditions = [
      { field: 'amount', label: 'Amount', operators: ['less_than', 'greater_than', 'equals', 'between'] },
      { field: 'category', label: 'Category', operators: ['equals', 'in', 'not_in'] },
      { field: 'employee_role', label: 'Employee Role', operators: ['equals', 'in'] },
      { field: 'department', label: 'Department', operators: ['equals', 'in'] },
      { field: 'receipt_status', label: 'Receipt Status', operators: ['equals'] }
    ];

    const availableActions = [
      { type: 'approve_expense', label: 'Approve Expense', params: ['level'] },
      { type: 'reject_expense', label: 'Reject Expense', params: ['reason'] },
      { type: 'send_notification', label: 'Send Notification', params: ['recipient', 'message'] },
      { type: 'send_email', label: 'Send Email', params: ['template', 'recipient'] },
      { type: 'create_task', label: 'Create Task', params: ['assignee', 'description'] },
      { type: 'flag_expense', label: 'Flag Expense', params: ['priority'] }
    ];

    const RuleBuilder = () => (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Automation Rule</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter rule name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Event</label>
              <select
                value={newRule.trigger}
                onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select trigger...</option>
                {availableTriggers.map(trigger => (
                  <option key={trigger.key} value={trigger.key}>{trigger.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newRule.description}
              onChange={(e) => setNewRule({...newRule, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Describe what this rule does"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conditions</label>
            <div className="space-y-2">
              {newRule.conditions.map((condition, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                    {availableConditions.map(cond => (
                      <option key={cond.field} value={cond.field}>{cond.label}</option>
                    ))}
                  </select>
                  <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                    <option value="equals">Equals</option>
                    <option value="greater_than">Greater Than</option>
                    <option value="less_than">Less Than</option>
                  </select>
                  <input
                    type="text"
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Value"
                  />
                  <button className="text-red-600 hover:text-red-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => setNewRule({
                  ...newRule,
                  conditions: [...newRule.conditions, { field: '', operator: '', value: '' }]
                })}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Condition
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
            <div className="space-y-2">
              {newRule.actions.map((action, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                    {availableActions.map(act => (
                      <option key={act.type} value={act.type}>{act.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Parameters"
                  />
                  <button className="text-red-600 hover:text-red-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => setNewRule({
                  ...newRule,
                  actions: [...newRule.actions, { type: '', params: {} }]
                })}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Action
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setRules([...rules, { ...newRule, id: Date.now(), executions: 0 }]);
                setNewRule({ name: '', description: '', trigger: '', conditions: [], actions: [], status: 'active' });
                setShowRuleBuilder(false);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              💾 Save Rule
            </button>
            <button
              onClick={() => setShowRuleBuilder(false)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Automation Rules</h3>
          <button
            onClick={() => setShowRuleBuilder(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            ⚡ Create Rule
          </button>
        </div>

        {showRuleBuilder && <RuleBuilder />}

        <div className="grid gap-4">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rule.status}
                  </span>
                  <span className="text-sm text-gray-500">{rule.executions} runs</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Trigger</h5>
                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {availableTriggers.find(t => t.key === rule.trigger)?.label || rule.trigger}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Actions</h5>
                  <div className="flex flex-wrap gap-1">
                    {rule.actions.map((action, index) => (
                      <span key={index} className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        {availableActions.find(a => a.type === action.type)?.label || action.type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 Integration & Automation</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { key: 'integrations', label: 'System Integrations', icon: '🔌' },
            { key: 'automation', label: 'Automation Rules', icon: '⚡' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`p-4 rounded-lg text-center transition-colors ${
                selectedTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-3xl mb-2">{tab.icon}</div>
              <div className="font-medium">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedTab === 'integrations' && (
        <div className="grid gap-6">
          {availableIntegrations.map((integration) => (
            <IntegrationConfig
              key={integration.id}
              integration={integration}
              onConnect={(id, config) => {
                console.log('Connecting integration:', id, config);
                // Update integration status
                setConnectedSystems([...connectedSystems, { id, config, connectedAt: new Date() }]);
              }}
              onDisconnect={(id) => {
                console.log('Disconnecting integration:', id);
                setConnectedSystems(connectedSystems.filter(s => s.id !== id));
              }}
            />
          ))}
        </div>
      )}

      {selectedTab === 'automation' && <AutomationRules />}
    </div>
  );
};

export default IntegrationAutomation;