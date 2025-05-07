'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner } from '@telegram-apps/telegram-ui';
import { MdMessage } from 'react-icons/md';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchSpecialists } from '@/redux/slices/specialistSlice';
import ChatComponent from './Consultation/ChatComponent';
import api from '@/api/axios';
import useTelegramUser from '@/hooks/useTelegramUser';
import BookingsList from '@/components/booking/BookingsList';

export default function ConsultationTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { specialists, loading, error } = useSelector((state: RootState) => state.specialists);

  const [activeTab, setActiveTab] = useState<'bookings' | 'consult'>('consult');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [userPackageId, setUserPackageId] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingPackage, setLoadingPackage] = useState(false); // For package loading indicator
  const [errorMsg, setErrorMsg] = useState('');

  const telegramuser = useTelegramUser();

  useEffect(() => {
    dispatch(fetchSpecialists({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedDoctor) {
      fetchAvailability(selectedDoctor.id);
      fetchUserPackage(); // Check if user already has a package
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
    setLoadingPackage(true);
    try {
      // First, try to get active user package
      const res = await api.get(`/user-package/active?userId=${telegramuser?.id}`);
      setUserPackageId(res.data.id);
    } catch (e: any) {
      console.warn('No active user package found. Fetching available packages...');
      try {
        // Fetch available packages if no active user package found
        const packageRes = await api.get('/package/find-all');
        const availablePackages = packageRes.data;

        if (availablePackages.length === 0) {
          setErrorMsg('No packages available. Please try again later.');
          setLoadingPackage(false);
          return;
        }

        // Show available packages (You can implement a UI for selection here)
        const selectedPackage = availablePackages[0]; // Default to the first package for now

        // Create a new user package with the selected package
        const createRes = await api.post('/user-package', {
          userId: telegramuser?.id,
          packageId: selectedPackage.id,
        });

        setUserPackageId(createRes.data.id);
      } catch (packageErr) {
        console.error('Failed to fetch or create package:', packageErr);
        setErrorMsg('Unable to assign a package. Please try again later.');
      } finally {
        setLoadingPackage(false);
      }
    }
  };

  const bookSlot = async () => {
    if (!selectedSlot || !selectedDoctor || !userPackageId) {
      setErrorMsg('Please complete all fields or purchase a package.');
      return;
    }

    try {
      await api.post('/booking/create', {
        parentId: telegramuser?.id,
        expertId: selectedDoctor.id,
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
          Session booked with{' '}
          <span className="font-bold">
            {selectedDoctor?.user?.firstName} {selectedDoctor?.user?.lastName}
          </span>
        </p>
        <Button className="bg-indigo-600 text-white mt-4">Join Video Call</Button>
      </div>
    );
  }

  const categories = ["nutritionist", "Medical doctor", "Any Question(CS)"];
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 text-white">
      <div className="flex space-between gap-4 mb-6 w-full">
       <p style={{width: '50%'}}></p>
        {/* <Button
          className={`flex-1 ${activeTab === 'consult' ? 'bg-emerald-600' : 'bg-gray-700'}`}
          onClick={() => setActiveTab('consult')}
        >
          Consult Now
        </Button> */}
        <button
          className={`w-1/2 flex-1 rounded ${activeTab === 'bookings' ? 'bg-emerald-600' : 'bg-gray-700'}`}
          onClick={() => setActiveTab('bookings')}
        >
          my appointment
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="text-white">
          <h2 className="text-xl font-semibold mb-4">📅 Your Booked Sessions</h2>
          <BookingsList />
        </div>
      )}

<div className="flex gap-2 bg-gray-900 ">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveTab('consult')}
          className={`px-4 py-2  font-semibold rounded-none transition-all
            ${activeTab === category ? "bg-gray-600" : "bg-gray-500 hover:bg-red-600"}
          `}
        >
          {category}
        </button>
      ))}
    </div>

      {activeTab === 'consult' && (
        <>
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
              {specialists.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                const fullName = `${doc?.firstName} ${doc?.lastName}`;
                return (
                  <div
                    key={doc.id}
                    className={`p-4 border rounded-lg flex justify-between items-center ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-900/30'
                        : 'border-gray-700 bg-gray-800'
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
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setChatOpen(true);
                      }}
                    >
                      <MdMessage className="text-blue-400 w-6 h-6" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {selectedDoctor && (
            <div>
              <p className="font-medium mb-2 text-gray-300">📅 Choose a Slot</p>
              {loadingSlots ? (
                <Spinner size="l" />
              ) : (
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded"
                >
                  <option value="" disabled>
                    Select a time slot
                  </option>
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

          {loadingPackage && (
            <div className="flex justify-center py-4">
              <Spinner size="l" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
