import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import api from '@/api/axios';
import { BackendUser, TelegramUser } from '@/types';

const useTelegramUser = () => {
  const [user, setUser] = useState<BackendUser | null>(null);

  const generateDummyPhone = () => {
    const randomSuffix = Math.floor(1000000 + Math.random() * 9000000); // random 7-digit
    return `+25191${randomSuffix}`;
  };

  useEffect(() => {
    const fetchOrCreateUser = async () => {
      const telegramUser = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user as TelegramUser | undefined;
      const generatedId = crypto.randomUUID();
      const telegramId = telegramUser?.id || generatedId;

      const getOrCreateUser = async (id: string) => {
        try {
          const { data } = await api.get<BackendUser>(`users/find-one/${id}`);
          localStorage.setItem('telegramUser', JSON.stringify(data));
          setUser(data);
          console.log('Fetched existing user:', data);
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;

          if (
            err?.response?.data?.message === 'User not found' ||
            err.message === 'User not found'
          ) {
            localStorage.removeItem('telegramUser'); // ❌ Remove bad or missing user

            const fallbackUser: TelegramUser = {
              id: telegramId,
              firstName: telegramUser?.firstName || 'John',
              lastName: telegramUser?.lastName || 'Doe',
              telegram_username: telegramUser?.telegram_username || 'john_doe_telegram',
              gender: telegramUser?.gender || 'MALE',
              city: 'Addis Ababa',
              address: '123 Main St',
              phone: generateDummyPhone(),
              password: 'securePassword123',
              role: 'PARENT',
              avatarUrl: telegramUser?.avatarUrl || '',
              status: 'ACTIVE',
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

      const storedUser = localStorage.getItem('telegramUser');
      if (storedUser) {
        const parsedUser: BackendUser = JSON.parse(storedUser);
        try {
          await getOrCreateUser(parsedUser.id.toString());
          return;
        } catch (error) {
          console.warn('Stored user invalid, will create new one.');
        }
      }

      if (telegramUser?.id) {
        await getOrCreateUser(telegramUser.id.toString());
      } else {
        await getOrCreateUser(generatedId); // fallback
      }
    };

    fetchOrCreateUser();
  }, []);

  return user;
};

export default useTelegramUser;
