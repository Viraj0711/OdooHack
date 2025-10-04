import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdvancedReporting = () => {
  const [reportData, setReportData] = useState({});
  const [selectedReport, setSelectedReport] = useState('overview');
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    department: 'all',
    category: 'all',
    employee: 'all',
    status: 'all'
  });
  const [customFilters, setCustomFilters] = useState({});
  const [scheduledReports, setScheduledReports] = useState([]);

  // Custom Report Builder Component
  const CustomReportBuilder = () => {
    const [reportConfig, setReportConfig] = useState({
      name: '',
      description: '',
      dataSource: 'expenses',
      groupBy: [],
      filters: {},
      charts: [],
      schedule: {
        enabled: false,
        frequency: 'weekly',
        recipients: []
      }
    });

    const availableFields = {
      expenses: [
        { key: 'amount', label: 'Amount', type: 'number' },
        { key: 'category', label: 'Category', type: 'string' },
        { key: 'department', label: 'Department', type: 'string' },
        { key: 'employee', label: 'Employee', type: 'string' },
        { key: 'status', label: 'Status', type: 'string' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'vendor', label: 'Vendor', type: 'string' }
      ]
    };

    const chartTypes = [
      { key: 'bar', label: 'Bar Chart', icon: '📊' },
      { key: 'line', label: 'Line Chart', icon: '📈' },
      { key: 'pie', label: 'Pie Chart', icon: '🥧' },
      { key: 'doughnut', label: 'Doughnut Chart', icon: '🍩' },
      { key: 'table', label: 'Data Table', icon: '📋' }
    ];

    const handleSaveReport = () => {
      // Save custom report configuration
      console.log('Saving custom report:', reportConfig);
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Custom Report Builder</h3>
        
        <div className="space-y-6">
          {/* Report Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
              <input
                type="text"
                value={reportConfig.name}
                onChange={(e) => setReportConfig({...reportConfig, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter report name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Source</label>
              <select
                value={reportConfig.dataSource}
                onChange={(e) => setReportConfig({...reportConfig, dataSource: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="expenses">Expenses</option>
                <option value="approvals">Approvals</option>
                <option value="budgets">Budgets</option>
                <option value="users">Users</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={reportConfig.description}
              onChange={(e) => setReportConfig({...reportConfig, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Describe what this report shows"
            />
          </div>

          {/* Field Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group By Fields</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableFields[reportConfig.dataSource]?.map(field => (
                <label key={field.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={reportConfig.groupBy.includes(field.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setReportConfig({
                          ...reportConfig,
                          groupBy: [...reportConfig.groupBy, field.key]
                        });
                      } else {
                        setReportConfig({
                          ...reportConfig,
                          groupBy: reportConfig.groupBy.filter(k => k !== field.key)
                        });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Chart Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visualization Types</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {chartTypes.map(chart => (
                <button
                  key={chart.key}
                  onClick={() => {
                    const charts = reportConfig.charts.includes(chart.key)
                      ? reportConfig.charts.filter(c => c !== chart.key)
                      : [...reportConfig.charts, chart.key];
                    setReportConfig({...reportConfig, charts});
                  }}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    reportConfig.charts.includes(chart.key)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-1">{chart.icon}</div>
                  <div className="text-xs font-medium">{chart.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Report Scheduling */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                checked={reportConfig.schedule.enabled}
                onChange={(e) => setReportConfig({
                  ...reportConfig,
                  schedule: {...reportConfig.schedule, enabled: e.target.checked}
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">Schedule this report</label>
            </div>
            
            {reportConfig.schedule.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    value={reportConfig.schedule.frequency}
                    onChange={(e) => setReportConfig({
                      ...reportConfig,
                      schedule: {...reportConfig.schedule, frequency: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                  <input
                    type="text"
                    placeholder="email1@company.com, email2@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSaveReport}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              💾 Save Report
            </button>
            <button
              onClick={() => {
                // Generate preview
                console.log('Generating preview for:', reportConfig);
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              👁️ Preview Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Expense Forecasting Component
  const ExpenseForecasting = () => {
    const [forecastData, setForecastData] = useState(null);
    const [forecastPeriod, setForecastPeriod] = useState('6months');

    useEffect(() => {
      generateForecast();
    }, [forecastPeriod]);

    const generateForecast = () => {
      // Simulate AI-based forecasting
      const historical = [65000, 72000, 68000, 74000, 81000, 77000]; // Last 6 months
      const trend = 0.05; // 5% growth trend
      
      const forecast = [];
      const periods = forecastPeriod === '6months' ? 6 : 12;
      
      for (let i = 0; i < periods; i++) {
        const lastValue = i === 0 ? historical[historical.length - 1] : forecast[i - 1];
        const seasonal = Math.sin((i + 6) * Math.PI / 6) * 0.1; // Seasonal variation
        const predicted = lastValue * (1 + trend + seasonal + (Math.random() - 0.5) * 0.1);
        forecast.push(Math.round(predicted));
      }

      setForecastData({
        historical,
        forecast,
        confidence: 85,
        trends: {
          overall: 'increasing',
          seasonal: 'Q1 typically lower, Q4 higher',
          categories: {
            'Travel': { trend: 'increasing', confidence: 78 },
            'Office Supplies': { trend: 'stable', confidence: 92 },
            'Software': { trend: 'increasing', confidence: 83 }
          }
        }
      });
    };

    const chartData = {
      labels: [
        ...['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Historical
        ...Array.from({length: forecastData?.forecast.length || 0}, (_, i) => {
          const month = new Date();
          month.setMonth(month.getMonth() + i + 1);
          return month.toLocaleString('default', { month: 'short' });
        })
      ],
      datasets: [
        {
          label: 'Historical',
          data: [...(forecastData?.historical || []), ...Array(forecastData?.forecast.length || 0).fill(null)],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
        },
        {
          label: 'Forecast',
          data: [...Array(forecastData?.historical.length || 0).fill(null), ...(forecastData?.forecast || [])],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderDash: [10, 5],
          borderWidth: 2,
        }
      ]
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Expense Forecasting</h3>
          <select
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="6months">Next 6 Months</option>
            <option value="12months">Next 12 Months</option>
          </select>
        </div>

        {forecastData && (
          <div className="space-y-6">
            <div className="h-64">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Expense Forecast with Historical Data'
                    },
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: function(value) {
                          return '₹' + (value / 1000).toFixed(0) + 'K';
                        }
                      }
                    }
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📈 Overall Trend</h4>
                <p className="text-sm text-blue-700 capitalize">{forecastData.trends.overall}</p>
                <p className="text-xs text-blue-600 mt-1">Confidence: {forecastData.confidence}%</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">📊 Seasonal Pattern</h4>
                <p className="text-sm text-green-700">{forecastData.trends.seasonal}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">🔮 Next Month Prediction</h4>
                <p className="text-lg font-semibold text-purple-700">
                  ₹{forecastData.forecast[0]?.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Category-wise Trends</h4>
              <div className="space-y-2">
                {Object.entries(forecastData.trends.categories).map(([category, trend]) => (
                  <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{category}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        trend.trend === 'increasing' ? 'bg-orange-100 text-orange-800' :
                        trend.trend === 'stable' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {trend.trend}
                      </span>
                      <span className="text-xs text-gray-500">{trend.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Policy Violation Reports
  const PolicyViolationReports = () => {
    const [violations, setViolations] = useState([]);
    const [severityFilter, setSeverityFilter] = useState('all');

    useEffect(() => {
      fetchViolations();
    }, [severityFilter]);

    const fetchViolations = () => {
      // Simulate policy violation data
      const mockViolations = [
        {
          id: 1,
          employee: 'John Smith',
          expense: 'EXP-001',
          violation: 'Missing receipt for expense above ₹50,000',
          severity: 'high',
          amount: 75000,
          date: '2025-10-01',
          status: 'unresolved'
        },
        {
          id: 2,
          employee: 'Sarah Wilson',
          expense: 'EXP-002',
          violation: 'Late submission (45 days after expense date)',
          severity: 'medium',
          amount: 25000,
          date: '2025-09-28',
          status: 'resolved'
        },
        {
          id: 3,
          employee: 'Mike Johnson',
          expense: 'EXP-003',
          violation: 'Insufficient business justification',
          severity: 'low',
          amount: 15000,
          date: '2025-10-02',
          status: 'unresolved'
        }
      ];

      const filtered = severityFilter === 'all' 
        ? mockViolations 
        : mockViolations.filter(v => v.severity === severityFilter);
        
      setViolations(filtered);
    };

    const getSeverityColor = (severity) => {
      switch (severity) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusColor = (status) => {
      return status === 'resolved' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-orange-100 text-orange-800';
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Policy Violation Reports</h3>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-900">Employee</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Expense ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Violation</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Severity</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {violations.map((violation) => (
                <tr key={violation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{violation.employee}</td>
                  <td className="px-4 py-3 text-blue-600">{violation.expense}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{violation.violation}</td>
                  <td className="px-4 py-3 font-medium">₹{violation.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(violation.severity)}`}>
                      {violation.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(violation.status)}`}>
                      {violation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">View</button>
                    {violation.status === 'unresolved' && (
                      <button className="text-green-600 hover:text-green-800">Resolve</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {violations.length === 0 && (
          <div className="text-center py-8">
            <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No violations found</h3>
            <p className="mt-1 text-sm text-gray-500">All expenses are compliant with company policies.</p>
          </div>
        )}
      </div>
    );
  };

  // Export functionality
  const ExportOptions = ({ reportData }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState('pdf');

    const handleExport = async (format) => {
      setIsExporting(true);
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create download link
      const exportData = {
        reportName: 'Expense Report',
        generatedDate: new Date().toISOString(),
        data: reportData,
        format: format
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadLink = document.createElement('a');
      downloadLink.href = dataStr;
      downloadLink.download = `expense-report-${Date.now()}.${format}`;
      downloadLink.click();
      
      setIsExporting(false);
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Report</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pdf">📄 PDF Report</option>
              <option value="excel">📊 Excel Spreadsheet</option>
              <option value="csv">📋 CSV Data</option>
              <option value="json">🔧 JSON Data</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleExport(exportFormat)}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Exporting...</span>
                </div>
              ) : (
                `📥 Export ${exportFormat.toUpperCase()}`
              )}
            </button>
            
            <button
              onClick={() => {
                // Email report
                alert('Email functionality would be implemented here');
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              📧 Email Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Advanced Reporting & Analytics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'custom', label: 'Custom Reports', icon: '🔧' },
            { key: 'forecast', label: 'Forecasting', icon: '🔮' },
            { key: 'violations', label: 'Policy Violations', icon: '⚠️' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedReport(tab.key)}
              className={`p-3 rounded-lg text-center transition-colors ${
                selectedReport === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-2xl mb-1">{tab.icon}</div>
              <div className="text-sm font-medium">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedReport === 'custom' && <CustomReportBuilder />}
      {selectedReport === 'forecast' && <ExpenseForecasting />}
      {selectedReport === 'violations' && <PolicyViolationReports />}
      
      <ExportOptions reportData={reportData} />
    </div>
  );
};

export default AdvancedReporting;