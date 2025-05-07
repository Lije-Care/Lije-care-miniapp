// hooks/useBookings.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Booking } from '@/types/booking';
import  useTelegramUser from '@/hooks/useTelegramUser'; // adjust path as needed

export const useBookings = () => {
  const telegramUserId = useTelegramUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async (parentID: string) => {
      try {
        const { data } = await axios.get(`https://lije-care-api-dev.zikollab.com/api/v1/booking/my-booking/parent/${parentID}`);
        console.log(data.data)

        
        
        const userBookings = data?.data?.filter((booking: Booking) => booking.parentId === telegramUserId?.id);
        console.log("filtered");
        console.log(userBookings)
        setBookings(userBookings);
        
      } catch (err) {
        console.log(err)
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    if (telegramUserId) fetchBookings(telegramUserId?.id);
  }, [telegramUserId]);

  return { bookings, loading, error };
};
