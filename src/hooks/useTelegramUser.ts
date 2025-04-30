import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import api from '@/api/axios';
import { BackendUser, TelegramUser } from '@/types';
import { User } from '@/redux/slices/specialistSlice';

const dummyTelegramUser: TelegramUser = {
  id: '6d5343b3-eab2-4fef-a924-b5f9730cd899',
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
      const userToUse = telegramUser || dummyTelegramUser;
      const storedUser = localStorage.getItem('telegramUser');

      if (storedUser) {
        setUser(JSON.parse(storedUser) as BackendUser);
        return;
      }

      try {
        const { data } = await api.get<BackendUser>(`users/find-one/${userToUse.id}`);
        console.log('Fetched existing user:', data);
        localStorage.setItem('telegramUser', JSON.stringify(data));
        setUser(data);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;

        if (err.response?.data?.message === 'User not found') {
          const newUserPayload: TelegramUser = {
            id: userToUse.id,
            firstName: userToUse.firstName,
            lastName: userToUse.lastName,
            telegram_username: userToUse.telegram_username,
            gender: userToUse.gender,
            avatarUrl: userToUse.avatarUrl,
            address: userToUse.address,
            city: userToUse.city,
            phone: userToUse.phone,
            password: userToUse.password,
            role: userToUse.role || 'PARENT',
            status: userToUse.status || 'ACTIVE',
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
