import { useEffect, useState } from 'react';

import { BackendUser, TelegramUser } from '@/types';
import api from '@/api/axios';
const dummyTelegramUser: TelegramUser = {
  id: '6d5343b3-eab2-4fef-a924-b5f9730cd898',
  // id: '4d4adf16-02c9-488f-8f01-2dba7138e050',
  first_name: 'John',
  last_name: 'Doe',
  username: 'johndoe_dev',
  // If your TelegramUser type expects other fields like `photo_url`, you can add them here
};

const useTelegramUser = () => {
  const [user, setUser] = useState<BackendUser | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user as TelegramUser | undefined;
        
       
        // --- If Telegram user is not found, use the dummy user ---
        const userToUse = telegramUser || dummyTelegramUser;
        console.log("userToUse");
        console.log(userToUse);
        
        const storedUser = localStorage.getItem('telegramUser');
       
        
        if (storedUser) {
          setUser(JSON.parse(storedUser) as BackendUser);
          return;
        }

        // Try to get user from backend
        const { data } = await api.get<BackendUser>(`users/find-one/${userToUse.id}`);
         
        if (data && data.id) {
          localStorage.setItem('telegramUser', JSON.stringify(data));
          setUser(data);
        } else {
          // User not found, create one
          const newUserPayload = {
            telegramId: userToUse.id,
            firstName: userToUse.first_name,
            lastName: userToUse.last_name,
            username: userToUse.username,
          };

          const createResponse = await api.post('https://lije-care-api-dev.zikollab.com/api/v1/api/users', newUserPayload);

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
