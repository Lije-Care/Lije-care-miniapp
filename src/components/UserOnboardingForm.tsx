import React, { useState } from 'react';
import api from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import { Page } from './Page';

const UserOnboardingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'MALE',
    city: '',
    address: '',
    phone: '',
    avatarUrl: '',
    role: 'PARENT',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!/^\+251\d{9}$/.test(formData.phone)) newErrors.phone = 'Use format +2519XXXXXXXX';
    if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters required';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (response.status !== 200) throw new Error('Submission failed.');
      localStorage.setItem('onboarding_complete', 'true');
      navigate('/navigate');
    } catch (err: any) {
      console.error('Error:', err?.response?.data?.message || err.message);
      setSubmitError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page back={true}>
      <div className="max-w-md mx-auto mt-10 rounded-2xl shadow-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center">👋 Welcome! Set up your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && <div className="text-red-500 text-sm text-center">{submitError}</div>}

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block font-medium mb-1">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring`}
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block font-medium mb-1">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring`}
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block font-medium mb-1">Gender</label>
            <select
              id="gender"
              name="gender"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block font-medium mb-1">City</label>
            <input
              id="city"
              name="city"
              type="text"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none`}
              value={formData.city}
              onChange={handleChange}
            />
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block font-medium mb-1">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none`}
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
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
            {loading ? 'Submitting...' : 'Create My Account'}
          </button>
        </form>
      </div>
    </Page>
  );
};

export default UserOnboardingForm;
