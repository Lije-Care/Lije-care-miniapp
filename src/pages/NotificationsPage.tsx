// src/pages/NotificationsPage.tsx
import { FC, useEffect, useState } from "react";
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

const MAX_MESSAGE_LENGTH = 120;

const NotificationsPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notificationsState = useSelector(
    (state: RootState) => state.notificartions
  );
  const { data = [], loading, error } = notificationsState || {};

  console.log({ data });

  // Track which notifications are expanded
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    dispatch(fetchAllNotifications());
  }, [dispatch]);

  const renderIcon = (type: string) => {
    const normalizedType = type?.toUpperCase();
    switch (normalizedType) {
      case "INFO":
        return <FiInfo className="text-blue-500 w-5 h-5" />;
      case "SUCCESS":
        return <FiCheckCircle className="text-green-500 w-5 h-5" />;
      case "WARNING":
        return <FiAlertTriangle className="text-yellow-500 w-5 h-5" />;
      case "ERROR":
        return <FiAlertTriangle className="text-red-500 w-5 h-5" />;
      case "GROWTH_MILESTONE":
        return <FiCheckCircle className="text-purple-500 w-5 h-5" />;
      case "REMINDER":
        return <FiBell className="text-orange-500 w-5 h-5" />;
      case "ALERT":
        return <FiAlertTriangle className="text-red-500 w-5 h-5" />;
      default:
        return <FiBell className="text-gray-500 w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    const normalizedType = type?.toUpperCase();
    switch (normalizedType) {
      case "GROWTH_MILESTONE":
        return "bg-purple-100 text-purple-700";
      case "REMINDER":
        return "bg-orange-100 text-orange-700";
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "ERROR":
        return "bg-red-100 text-red-700";
      case "WARNING":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Page back={true}>
      <div className="min-h-screen px-4 py-6 bg-gray-800">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <FiLoader className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-10 min-h-[60vh] flex flex-col justify-center">
            <FiAlertTriangle className="mx-auto mb-2 w-8 h-8" />
            <p className="text-sm font-medium">Failed to load notifications</p>
            <p className="text-xs text-gray-500 mt-1">{String(error)}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col justify-center items-center min-h-[60vh] text-center text-gray-500">
            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486800.png"
              alt="No notifications"
              className="w-24 h-24 mb-4"
            />
            <p className="text-sm">You have no notifications</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {data.map((notification) => {
              const isExpanded = expanded[notification.id];
              const message = notification.message || "";
              const shouldTruncate = message.length > MAX_MESSAGE_LENGTH;
              const displayMessage = isExpanded
                ? message
                : message.slice(0, MAX_MESSAGE_LENGTH);
              return (
                <li
                  key={notification.id}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-4 border"
                >
                  <div className="flex-shrink-0">
                    {renderIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    {/* Title */}
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {notification.title || "Notification"}
                    </h3>
                    {/* Type Badge */}
                    {notification.type && (
                      <span
                        className={`inline-block text-[10px] px-2 py-1 rounded-full font-medium uppercase mt-1 ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        {notification.type.replace(/_/g, " ")}
                      </span>
                    )}
                    {/* Message */}
                    <p className="text-gray-600 text-sm mt-2 leading-snug">
                      {displayMessage}
                      {shouldTruncate && !isExpanded && "..."}
                    </p>
                    {/* View More / Less */}
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpand(notification.id)}
                        className="text-blue-500 text-xs font-medium mt-1 hover:underline focus:outline-none"
                      >
                        {isExpanded ? "View less" : "View more"}
                      </button>
                    )}
                    {/* Timestamp */}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Page>
  );
};

export default NotificationsPage;
