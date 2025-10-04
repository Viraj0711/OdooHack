import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DemoModal from '../components/common/DemoModal';

const LandingPage = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered OCR',
      description: 'Automatically extract data from receipts using advanced machine learning',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🚀',
      title: 'Smart Approvals',
      description: 'Intelligent multi-level approval workflows that adapt to your organization',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '💼',
      title: 'Financial Controls',
      description: 'Real-time budget tracking, policy validation, and automated tax calculations',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Custom dashboards, expense forecasting, and comprehensive reporting',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🔗',
      title: 'System Integration',
      description: 'Connect with Tally ERP, banking systems, and popular business tools',
      color: 'from-teal-500 to-blue-500'
    },
    {
      icon: '📱',
      title: 'Mobile-First',
      description: 'Responsive design with camera integration for instant receipt capture',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Finance Manager',
      company: 'Tech Solutions Ltd',
      image: '👩‍💼',
      quote: 'This system reduced our expense processing time by 75%. The OCR feature is incredibly accurate!'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Operations Director',
      company: 'Manufacturing Corp',
      image: '👨‍💼',
      quote: 'The automated approval workflows have streamlined our entire expense management process.'
    },
    {
      name: 'Anita Patel',
      role: 'CEO',
      company: 'StartupHub India',
      image: '👩‍💻',
      quote: 'Real-time budget tracking and policy compliance have saved us thousands in unnecessary expenses.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Expenses Processed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '75%', label: 'Time Saved' },
    { number: '500+', label: 'Happy Users' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#6037d9] to-[#be42c3] text-white py-2 px-4 text-center text-sm">
        <span className="font-medium">🎉 Limited Time: Get 30 days FREE trial + 20% off first year!</span>
        <Link to="/register" className="ml-2 underline hover:no-underline font-semibold">
          Sign Up Now →
        </Link>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-50 top-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFD6E2] to-[#ff6b9d] rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ExpenseApp</h1>
                <p className="text-xs text-gray-500">Smart Management</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="hidden lg:flex space-x-6">
                <a href="#features" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">Features</a>
                <Link to="/pricing" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">Pricing</Link>
                <a href="#testimonials" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">Reviews</a>
              </nav>
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:border-gray-400 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-[#FFD6E2] to-[#ff6b9d] text-gray-900 px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium">Features</a>
                <Link to="/pricing" className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium">Pricing</Link>
                <a href="#testimonials" className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium">Reviews</a>
                <div className="border-t border-gray-200 pt-4 px-4 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center text-gray-700 hover:text-gray-900 px-4 py-3 rounded-lg text-sm font-medium border border-gray-300 hover:border-gray-400 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center bg-gradient-to-r from-[#FFD6E2] to-[#ff6b9d] text-gray-900 px-4 py-3 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up Free
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Revolutionize Your
              <span className="bg-gradient-to-r from-[#ff6b9d] to-[#FFD6E2] bg-clip-text text-transparent">
                <br className="sm:hidden" /> Expense Management
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the future of expense management with AI-powered OCR, smart approval workflows, 
              and real-time financial controls. Save time, reduce errors, and gain complete visibility 
              into your organization's spending.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#ff6b9d] to-[#FFD6E2] text-gray-900 px-10 py-4 rounded-xl text-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                🚀 Sign Up - Start Free Trial
              </Link>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowDemo(true)}
                  className="border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  📹 Watch Demo
                </button>
                <Link
                  to="/login"
                  className="border-2 border-blue-500 text-blue-600 px-6 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-200"
                >
                  👤 Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#6037d9] to-[#be42c3] p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 text-white text-sm font-medium">ExpenseApp Dashboard</div>
                </div>
              </div>
              <div className="p-8 bg-gradient-to-br from-white to-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                    <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
                    <p className="text-3xl font-bold">₹2,45,000</p>
                    <p className="text-blue-100 text-sm mt-1">↗ +12% from last month</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
                    <h3 className="text-lg font-semibold mb-2">Pending Approvals</h3>
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-green-100 text-sm mt-1">⏳ Awaiting review</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                    <h3 className="text-lg font-semibold mb-2">Budget Usage</h3>
                    <p className="text-3xl font-bold">67%</p>
                    <p className="text-purple-100 text-sm mt-1">📊 Within limits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced expense management platform combines cutting-edge technology 
              with intuitive design to deliver unmatched efficiency and control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-[#6037d9] to-[#be42c3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Businesses Across India
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join thousands of companies that have transformed their expense management process
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/80 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real businesses who've transformed their expense management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FFD6E2] to-[#ff6b9d] rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-gray-500 text-xs">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Expense Management?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses already using our platform to save time, 
            reduce costs, and gain complete control over their expenses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-[#ff6b9d] to-[#FFD6E2] text-gray-900 px-10 py-4 rounded-xl text-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🚀 Sign Up - Start Free Trial
            </Link>
            <Link
              to="/login"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:border-white/50 hover:bg-white/10 transition-all duration-200"
            >
              � Already a Member? Sign In
            </Link>
          </div>
          <p className="text-white/70 text-sm mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FFD6E2] to-[#ff6b9d] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">ExpenseApp</h3>
              </div>
              <p className="text-gray-400">
                The future of expense management is here. Smart, efficient, and designed for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><a href="#integrations" className="hover:text-white">Integrations</a></li>
                <li><a href="#api" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ExpenseApp. All rights reserved. Built with ❤️ for modern businesses.</p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
};

export default LandingPage;