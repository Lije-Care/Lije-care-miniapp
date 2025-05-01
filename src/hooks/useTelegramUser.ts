import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import api from '@/api/axios';
import { BackendUser, TelegramUser } from '@/types';

const useTelegramUser = () => {
  const [user, setUser] = useState<BackendUser | null>(null);

  useEffect(() => {
    const fetchOrCreateUser = async () => {
      const telegramUser = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user as TelegramUser | undefined;

      const generatedId = crypto.randomUUID();
      const telegramId = telegramUser?.id || generatedId;

      const storedUser = localStorage.getItem('telegramUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        return;
      }

      try {
        if (telegramUser?.id) {
          const { data } = await api.get<BackendUser>(`users/findbyTelegramId/${telegramUser.id}`);
          localStorage.setItem('telegramUser', JSON.stringify(data));
          setUser(data);
          console.log('Fetched existing user:', data);
          return;
        }

        throw new Error('No Telegram ID, fallback to new user creation.');
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;

        if (
          err?.response?.data?.message === 'User not found' ||
          err.message === 'No Telegram ID, fallback to new user creation.'
        ) {
          const fallbackUser: TelegramUser = {
            id: telegramId,
            firstName: telegramUser?.firstName || 'John',
            lastName: telegramUser?.lastName || 'Doe',
            telegram_username: telegramUser?.telegram_username || 'john_doe_telegram',
            gender: telegramUser?.gender || 'MALE',
            city: 'Addis Ababa',
            address: '123 Main St',
            phone: '+251911000000', // ensure uniqueness in production
            password: 'securePassword123',
            role: 'PARENT',
            avatarUrl: telegramUser?.avatarUrl || '', // optional
            status: 'ACTIVE', // optional
          };

          try {
            const { data: createdUser } = await api.post<BackendUser>('users/create', fallbackUser);
            localStorage.setItem('telegramUser', JSON.stringify(createdUser));
            setUser(createdUser);
            console.log('Created new user:', createdUser);
          } catch (creationError) {
            console.error('Error creating new user:', creationError);
          }
        } else {
          console.error('Unexpected error during fetch/create:', err.message);
        }
      }
    };

    fetchOrCreateUser();
  }, []);

  return user;
};

export default useTelegramUser;
