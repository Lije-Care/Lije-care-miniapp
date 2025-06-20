// src/pages/MyAppointments.tsx
import { Page } from '@/components/Page';
import BookingsList from '@/components/booking/BookingsList';

const MyAppointments = () => {
  return (
    <Page>
      <div className="p-6 max-w-3xl mx-auto text-white space-y-6">
        <h2 className="text-2xl font-bold text-emerald-400">📅 Your Booked Sessions</h2>
        <BookingsList />
      </div>
    </Page>
  );
};

export default MyAppointments;
