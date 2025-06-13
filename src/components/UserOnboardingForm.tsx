import React, { useState } from 'react';
import api from '@/api/axios';
import { useNavigate } from 'react-router-dom';

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

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!/^\+?\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Enter a valid phone number';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
 const navigate = useNavigate(); 
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
    //   const response = await fetch('/api/users', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });

       const response = await api.post('users/create', formData);

      if (response.status !== 200) {
        throw new Error('Submission failed. Please try again.');
      }

      localStorage.setItem('onboarding_complete', 'true');
      window.location.href = '/dashboard';
      navigate('/navigate');
    } catch (err: any) {
        console.error('Error during submission:', err.response.data.message);
      setSubmitError(err.response.data.message|| 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 rounded-2xl shadow-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-center ">👋 Welcome! Set up your account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && <div className="text-red-500 text-sm">{submitError}</div>}

        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none`}
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none`}
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <select
            name="gender"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            name="city"
            placeholder="City"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none`}
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
        </div>

        <div>
          <input
            type="text"
            name="address"
            placeholder="Address"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none`}
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
        </div>

        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone (+251...)"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none`}
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Choose a password"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Create My Account'}
        </button>
      </form>
    </div>
  );
};

export default UserOnboardingForm;
