'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner } from '@telegram-apps/telegram-ui';
import { MdMessage } from 'react-icons/md';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchSpecialists } from '@/redux/slices/specialistSlice';
import ChatComponent from './Consultation/ChatComponent';
import api from '@/api/axios';

const concerns = ['Nutrition', 'Sleep Issues', 'Growth', 'Vaccination', 'Skin Issues'];

export default function ConsultationTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { specialists, loading, error } = useSelector((state: RootState) => state.specialists);
 
  const [selectedConcern, setSelectedConcern] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [userPackageId, setUserPackageId] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load specialists on mount
  useEffect(() => {
    dispatch(fetchSpecialists({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Load availability when doctor selected
  useEffect(() => {
    if (selectedDoctor) {
      fetchAvailability(selectedDoctor.id);
      fetchUserPackage();
    }
  }, [selectedDoctor]);

  const fetchAvailability = async (expertId: string) => {
    try {
      setLoadingSlots(true);
    
      const res = await api.get(`/availability/findbyExpert/${expertId}`);
      setAvailability(res.data);
    } catch (e) {
      setAvailability([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchUserPackage = async () => {
    try {
      const res = await api.get('/user-package/active?userId=f59d7072-bfaf-42b1-aa7d-d07e1f3b3f98'); // Replace 'ME' with real user context
      setUserPackageId(res.data.id);
    } catch (e) {
      setUserPackageId(null);
    }
  };

  const bookSlot = async () => {
    if (!selectedSlot || !selectedDoctor || !userPackageId) {
      setErrorMsg('Please complete all fields or purchase a package.');
      return;
    }

    try {
      await api.post('/booking', {
        parentId: 'f59d7072-bfaf-42b1-aa7d-d07e1f3b3f98', // should come from auth/user context
        expertId: selectedDoctor.userId,
        slotId: selectedSlot,
        userPackageId,
      });

      setConfirmed(true);
    } catch (err) {
      setErrorMsg('Booking failed. Try again.');
    }
  };

  if (chatOpen && selectedDoctor) {
    return <ChatComponent selectedDoctor={selectedDoctor} />;
  }

  if (confirmed) {
    return (
      <div className="p-6 text-center text-white space-y-4">
        <h2 className="text-2xl font-semibold text-green-400">🎉 Consultation Confirmed</h2>
        <p>
          Session booked with <span className="font-bold">{selectedDoctor?.user?.firstName} {selectedDoctor?.user?.lastName}</span>
        </p>
        <Button className="bg-indigo-600 text-white mt-4">Join Video Call</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 text-white">
      <h1 className="text-2xl font-bold text-emerald-400">Consult a Specialist</h1>

      <div>
        <p className="font-medium mb-2 text-gray-300">🩺 Select a Concern</p>
        <select
          value={selectedConcern}
          onChange={(e) => setSelectedConcern(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
        >
          <option value="" disabled>Select a concern</option>
          {concerns.map((concern) => (
            <option key={concern} value={concern}>{concern}</option>
          ))}
        </select>
      </div>

      {selectedConcern && (
        <>
          <p className="font-medium text-gray-300">👩‍⚕️ Choose a Specialist</p>

          {loading ? (
            <div className="flex justify-center py-4"><Spinner size="l" /></div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-3">
              {specialists.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                const fullName = `${doc?.firstName} ${doc?.lastName}`;
                return (
                  <div
                    key={doc.id}
                    className={`p-4 border rounded-lg flex justify-between items-center ${
                      isSelected ? 'border-emerald-500 bg-emerald-900/30' : 'border-gray-700 bg-gray-800'
                    }`}
                  >
                    <div className="flex gap-4 cursor-pointer" onClick={() => setSelectedDoctor(doc)}>
                      <img
                        src={doc?.avatarUrl || '/doctors/default-avatar.png'}
                        alt={fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold">{fullName}</p>
                        {/* <p className="text-sm text-gray-400">{doc?.certifications}</p> */}
                        {/* <p className="text-xs text-gray-500">⭐ {doc?.rating.toFixed(1)}</p> */}
                      </div>
                    </div>
                    <button onClick={() => {
                      setSelectedDoctor(doc);
                      setChatOpen(true);
                    }}>
                      <MdMessage className="text-blue-400 w-6 h-6" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Time Slot Picker */}
      {selectedDoctor && (
        <div>
          <p className="font-medium mb-2 text-gray-300">📅 Choose a Slot</p>
          {loadingSlots ? (
            <Spinner size='l'/>
          ) : (
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded"
            >
              <option value="" disabled>Select a time slot</option>
              {availability.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.startTime} - {slot.endTime}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

      {selectedSlot && userPackageId && (
        <Button className="w-full mt-4 bg-emerald-600 text-white" onClick={bookSlot}>
          Confirm Booking
        </Button>
      )}
    </div>
  );
}
