import { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUser, TelegramUser } from '@/types';

const useTelegramUser = () => {
  const [user, setUser] = useState<BackendUser | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user as TelegramUser | undefined;


        if (!telegramUser) {
          console.error('Telegram user not found');
          return;
        }

        // const telegramId = telegramUser.id;

        const storedUser = localStorage.getItem('telegramUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser) as BackendUser);
          return;
        }

        // Try to get user from backend
        const { data } = await axios.get<BackendUser>(`/api/users/f59d7072-bfaf-42b1-aa7d-d07e1f3b3f98`);

        if (data && data.id) {
          localStorage.setItem('telegramUser', JSON.stringify(data));
          setUser(data);
        } else {
          // User not found, create one
          const newUserPayload = {
            telegramId: telegramUser.id,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
            username: telegramUser.username,
          };

          const createResponse = await axios.post<BackendUser>('/api/users', newUserPayload);

          localStorage.setItem('telegramUser', JSON.stringify(createResponse.data));
          setUser(createResponse.data);
        }
      } catch (error) {
        console.error('Error initializing Telegram user:', error);
      }
    };

    init();
  }, []);

  return user;
};

export default useTelegramUser;
