'use client';

import { useEffect, useState } from 'react';

import api from '@/api/axios';
import { Spinner, Button } from '@telegram-apps/telegram-ui';
import useTelegramUser from '@/hooks/useTelegramUser';
import { Page } from '@/components/Page';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export default function DoctorDetailPage() {
  const { doctorId } = useParams();
  const telegramuser = JSON.parse(localStorage.getItem("user") || "{}");
  const [doctor, setDoctor] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetchDoctorInfo();
    fetchAvailability();
  }, [doctorId]);

  const fetchDoctorInfo = async () => {
    try {
      const res = await api.get(`/specialists/find-one/${doctorId}`);
      setDoctor(res.data);
    } catch (err) {
      console.error('Doctor fetch failed');
    }
  };

  const fetchAvailability = async () => {
    try {
      setLoadingSlots(true);
      const res = await api.get(`/availability/find-availability/${doctorId}`);
      setAvailability(res.data);
    } catch {
      setAvailability([]);
    } finally {
      setLoadingSlots(false);
    }
  };
  const navigate = useNavigate();
  const bookSlot = async () => {
    if (!selectedSlot) {
      setErrorMsg('Please select a slot.');
      return;
    }

    try {
      await api.post('/booking/create', {
        parentId: telegramuser?.id,
        expertId: doctorId,
        slotId: selectedSlot,
      });
      navigate(`/consultation/${doctorId}`);
      //setConfirmed(true);

    } catch (err) {
      setErrorMsg('Booking failed. Try again.');
    }
  };

  if (confirmed && doctor) {
    return (
      <Page back={true}>
        <div className="p-6 text-center text-white space-y-4">
          <h2 className="text-2xl font-semibold text-green-400">🎉 Consultation Confirmed</h2>
          <p>
            Session booked with <span className="font-bold">{doctor?.firstName} {doctor?.lastName}</span>
          </p>
          <Button className="bg-indigo-600 text-white mt-4">Join Video Call</Button>
        </div>
      </Page>
    );
  }

  return (
    <Page back={true}>
      <div className="p-6 space-y-4 text-white">
        <h2 className="text-xl font-bold text-emerald-400">Doctor Info</h2>
        {doctor ? (
          <div className="flex gap-4 items-center">
            <img
              src={doctor?.avatarUrl || '/doctors/default-avatar.png'}
              alt={`${doctor.firstName} ${doctor.lastName}`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-bold">
                {doctor.firstName} {doctor.lastName}
              </p>
              <p className="text-sm text-gray-400">{doctor.SpecialistProfile?.specialty}</p>
            </div>
          </div>
        ) : (
          <Spinner size="l" />
        )}

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
              <option value="">Select a time slot</option>
              {availability
                .filter((slot) => !slot.isBooked)
                .map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.startTime} - {slot.endTime}
                  </option>
                ))}
            </select>
          )}
        </div>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        {selectedSlot && (
          <Button className="w-full mt-4 bg-emerald-600 text-white" onClick={bookSlot}>
            Confirm Booking
          </Button>
        )}
      </div>
    </Page>
  );
}
