// src/pages/NotificationsPage.tsx
import { FC, useEffect } from "react";

import { Page } from "@/components/Page";
import {
  FiBell,
  FiAlertTriangle,
  FiInfo,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllNotifications } from "@/redux/slices/notificationSlice";
import { RootState, AppDispatch } from "@/redux/store";

const NotificationsPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Safe selector with optional chaining
  // Import RootState from your store definition

  const notificationsState = useSelector(
    (state: RootState) => state.notificartions
  );
  const { data = [], loading, error } = notificationsState || {};
  console.log({ data });

  useEffect(() => {
    dispatch(fetchAllNotifications());
  }, [dispatch]);

  const renderIcon = (type: string) => {
    switch (type) {
      case "info":
        return <FiInfo className="text-blue-500 w-5 h-5" />;
      case "success":
        return <FiCheckCircle className="text-green-500 w-5 h-5" />;
      case "warning":
        return <FiAlertTriangle className="text-yellow-500 w-5 h-5" />;
      case "error":
        return <FiAlertTriangle className="text-red-500 w-5 h-5" />;
      default:
        return <FiBell className="text-gray-500 w-5 h-5" />;
    }
  };

  return (
    <Page back={true}>
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <FiLoader className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-10">
            <FiAlertTriangle className="mx-auto mb-2 w-8 h-8" />
            <p className="text-sm font-medium">Failed to load notifications</p>
            <p className="text-xs text-gray-500 mt-1">{String(error)}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-60 text-center text-gray-500">
            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486800.png"
              alt="No notifications"
              className="w-24 h-24 mb-4"
            />
            <p className="text-sm">You have no notifications</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {data.map((notification) => (
              <li
                key={notification.id}
                className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-4 border"
              >
                <div className="flex-shrink-0">
                  {renderIcon(notification.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 leading-snug">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Page>
  );
};

export default NotificationsPage;
