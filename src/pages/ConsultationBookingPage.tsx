'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@telegram-apps/telegram-ui';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchSpecialists } from '@/redux/slices/specialistSlice';
import { Page } from '@/components/Page';
import { useNavigate } from 'react-router-dom';

export default function ConsultationTab() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { specialists, loading, error } = useSelector((state: RootState) => state.specialists);

  const categories = ['All', 'nutritionist', 'Medical doctor', 'Any Question(CS)'];
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    dispatch(fetchSpecialists({ page: 1, limit: 10 }));
  }, [dispatch]);

  const filteredSpecialists =
    activeCategory === 'All'
      ? specialists.filter((doc) => doc.availabilitySlots?.some((slot) => !slot.isBooked))
      : specialists.filter(
          (doc) =>
            doc?.SpecialistProfile?.specialty.toLowerCase() === activeCategory.toLowerCase() &&
            doc.availabilitySlots?.some((slot) => !slot.isBooked)
        );

  return (
    <Page>
      <div className="p-6 max-w-3xl mx-auto space-y-6 text-white">
        <div className="flex justify-end">
          <button
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-white"
            onClick={() => navigate('/my-appointments')}
          >
            My Appointments
          </button>
        </div>

        <div className="flex bg-gray-900 gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 font-semibold rounded ${
                activeCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-600 text-gray-100 text-[13px] hover:bg-gray-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-emerald-400">Consult a Specialist</h1>
        <p className="font-medium text-gray-300">👩‍⚕️ Choose a Specialist</p>

        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner size="l" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-3">
            {filteredSpecialists.map((doc) => {
              const fullName = `${doc?.firstName} ${doc?.lastName}`;
              return (
                <div
                  key={doc.id}
                  className="p-4 border rounded-lg flex justify-between items-center border-gray-700 bg-gray-800 cursor-pointer"
                  onClick={() => navigate(`/chat/${doc.id}`)}
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={doc?.avatarUrl || '/doctors/default-avatar.png'}
                      alt={fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <p className="font-bold">{fullName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Page>
  );
}
