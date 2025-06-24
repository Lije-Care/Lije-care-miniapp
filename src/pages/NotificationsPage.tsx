// src/pages/NotificationsPage.tsx
import { FC } from 'react';
import { Page } from '@/components/Page.tsx';

const NotificationsPage: FC = () => {
  return (
    <Page back={true}>
      <div className="h-96 flex flex-col justify-center items-center text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7486/7486800.png"
          alt="Coming Soon"
          className="w-32 h-32 mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-700">Notifications</h2>
        <p className="text-gray-500 mt-2">Coming Soon...</p>
      </div>
    </Page>
  );
};

export default NotificationsPage;
