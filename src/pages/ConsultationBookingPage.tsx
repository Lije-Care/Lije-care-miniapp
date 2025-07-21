'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@telegram-apps/telegram-ui';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchSpecialists } from '@/redux/slices/specialistSlice';
import { Page } from '@/components/Page';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ConsultationTab() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { specialists, loading, error } = useSelector((state: RootState) => state.specialists);

  const categories = [
    t('All'),
    t('nutritionist'),
    t('Medical doctor'),
    t('Any Question(CS)')
  ];
  const [activeCategory, setActiveCategory] = useState(t('All'));

  useEffect(() => {
    dispatch(fetchSpecialists({ page: 1, limit: 10 }));
  }, [dispatch]);

  // ✅ Helper to check future unbooked slots
  const hasFutureUnbookedSlot = (slots: any[] = []) => {
    return slots.some((slot) => {
      if (!slot || slot.isBooked || !slot.startTime || !slot.date) return false;
      try {
        const [hour, minute] = slot.startTime.split(':').map(Number);
        const dateObj = new Date(slot.date);
        const slotDateTime = new Date(
          dateObj.getFullYear(),
          dateObj.getMonth(),
          dateObj.getDate(),
          hour,
          minute
        );
        return slotDateTime.getTime() > Date.now();
      } catch {
        return false;
      }
    });
  };

  const filteredSpecialists = specialists.filter((doc) => {
    const hasAvailableSlot = hasFutureUnbookedSlot(doc.AvailabilitySlots);
    if (!hasAvailableSlot) return false;

    if (activeCategory === t('All')) return true;

    const specialty = doc?.SpecialistProfile?.specialty || '';
    return specialty.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <Page>
      <div className="p-6 max-w-3xl mx-auto space-y-6 text-white">
        <div className="flex justify-end">
          <button
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-white"
            onClick={() => navigate('/my-appointments')}
          >
            {t('My Appointments')}
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

        <p className="font-medium text-gray-300">👩‍⚕️ {t('Choose a Specialist')}</p>

        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner size="l" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {filteredSpecialists.length === 0 ? (
              <p className="text-center text-gray-400 py-4">
                {t('No specialists are currently available. Please try again later.')}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredSpecialists.map((doc) => {
                  const fullName = `${doc?.firstName} ${doc?.lastName}`;
                  return (
                    <div
                      key={doc.id}
                      className="p-4 border rounded-lg flex justify-between items-center border-gray-700 bg-gray-800 cursor-pointer"
                      onClick={() => navigate(`/consultat/${doc.id}`)}
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
          </>
        )}
      </div>
    </Page>
  );
}
