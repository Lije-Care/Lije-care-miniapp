import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import api from '@/api/axios';
import { BackendUser, TelegramUser } from '@/types';

const defaultTelegramUser: TelegramUser = {
  id: '6d5343b3-eab2-4fef-a924-b5f9730cd898',
  firstName: 'John',
  lastName: 'Doe',
  telegram_username: 'john_doe_telegram',
  gender: 'MALE',
  avatarUrl: 'https://i.pravatar.cc/150?img=10',
  address: '123 Main St',
  city: 'Addis Ababa',
  phone: '+251973636223',
  password: 'securePassword123',
  role: 'PARENT',
  status: 'ACTIVE',
};

const useTelegramUser = () => {
  const [user, setUser] = useState<BackendUser | null>(null);

  useEffect(() => {
    const init = async () => {
      const telegramUser = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user as TelegramUser | undefined;
      const userToUse: TelegramUser = telegramUser ?? defaultTelegramUser;

      if (!userToUse?.id) {
        console.error('No Telegram user ID found.');
        return;
      }

      const storedUser = localStorage.getItem('telegramUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser) as BackendUser);
        return;
      }

      try {
        const { data } = await api.get<BackendUser>(`users/find-one/6d5343b3-eab2-4fef-a924-b5f9730cd898`);
        console.log('Fetched existing user:', data);
        localStorage.setItem('telegramUser', JSON.stringify(data));
        setUser(data);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;

        if (err.response?.data?.message === 'User not found') {
          const newUserPayload: TelegramUser = {
            ...userToUse,
            id: userToUse.id ?? crypto.randomUUID(), // fallback if no ID
          };

          const createResponse = await api.post<BackendUser>(
            'https://lije-care-api-dev.zikollab.com/api/v1/users/create',
            newUserPayload
          );

          localStorage.setItem('telegramUser', JSON.stringify(createResponse.data));
          setUser(createResponse.data);
        } else {
          console.error('Unexpected error during user fetch or create:', err.message);
        }
      }
    };

    init();
  }, []);

  return user;
};

export default useTelegramUser;
