import React, { useState } from 'react';
import api from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import { Page } from './Page';

const UserOnboardingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    password: '',
    role: 'PARENT',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.name = 'Name is required';
    if (!/^\+2519\d{8}$/.test(formData.phone)) newErrors.phone = 'Use format +2519XXXXXXXX';
    if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters required';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      const response = await api.post('users/create', formData);
      // if (response.status !== 201) throw new Error('Submission failed.');
      localStorage.setItem('onboarding_complete', 'true');
      console.log('User created successfully:', response);
      navigate('/');
    } catch (err: any) {
      console.log('Error creating user:', err);
      console.error('Error:', err?.response?.data?.message || err.message);
      setSubmitError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page back={true}>
      <div className="max-w-md mx-auto mt-10 rounded-2xl shadow-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center">👋 Create Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && <div className="text-red-500 text-sm text-center">{submitError}</div>}

          {/* Name */}
          <div>
            <label htmlFor="firstName" className="block font-medium mb-1">Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Your full name"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring`}
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block font-medium mb-1">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+2519XXXXXXXX"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none`}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-medium mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </Page>
  );
};

export default UserOnboardingForm;
