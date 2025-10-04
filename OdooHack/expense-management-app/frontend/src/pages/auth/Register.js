import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    country: '',
    role: 'employee',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#be42c3] via-[#6037d9] to-[#2a65e5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-[#be42c3] to-[#6037d9] bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-[#000000]/70">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-[#2a65e5] hover:text-[#be42c3] transition-colors duration-200"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#000000]">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border-2 border-[#000000]/20 rounded-xl shadow-sm placeholder-[#000000]/40 focus:outline-none focus:ring-2 focus:ring-[#6037d9] focus:border-[#6037d9] transition-all duration-200 bg-[#ffffff] text-[#000000]"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#000000]">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border-2 border-[#000000]/20 rounded-xl shadow-sm placeholder-[#000000]/40 focus:outline-none focus:ring-2 focus:ring-[#be42c3] focus:border-[#be42c3] transition-all duration-200 bg-[#ffffff] text-[#000000]"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#000000]">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border-2 border-[#000000]/20 rounded-xl shadow-sm placeholder-[#000000]/40 focus:outline-none focus:ring-2 focus:ring-[#2a65e5] focus:border-[#2a65e5] transition-all duration-200 bg-[#ffffff] text-[#000000]"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-[#000000]">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6037d9] focus:border-[#6037d9] transition-all duration-200"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-[#000000]">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                required
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#be42c3] focus:border-[#be42c3] transition-all duration-200"
                placeholder="Enter your country"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[#000000]">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border-2 border-[#000000]/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2a65e5] focus:border-[#2a65e5] transition-all duration-200 bg-[#ffffff] text-[#000000]"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              <p className="mt-1 text-xs text-[#000000]/60">
                Choose your role in the organization
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#000000]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6037d9] focus:border-[#6037d9] transition-all duration-200"
                placeholder="Enter your password"
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#000000]">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#be42c3] focus:border-[#be42c3] transition-all duration-200"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[#2a65e5] via-[#be42c3] to-[#6037d9] hover:from-[#6037d9] hover:via-[#2a65e5] hover:to-[#be42c3] focus:outline-none focus:ring-4 focus:ring-[#6037d9]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ffffff]"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;