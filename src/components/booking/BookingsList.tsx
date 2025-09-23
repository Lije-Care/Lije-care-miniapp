import React, { useState } from "react";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BookingsList: React.FC = () => {
  const { t } = useTranslation();
  const [chatOpen] = useState(false);
  const { bookings, loading, error } = useBookings();
  const navigate = useNavigate();

  console.log(chatOpen);

  if (loading)
    return <p className="text-center text-gray-500">{t("Loading...")}</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">{t("Your Bookings")}</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">{t("No bookings found")}</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex items-start justify-between shadow-sm border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">{t("Status")}:</span>{" "}
                {t(booking.status)}
              </p>
              <p className="text-sm">
                <span className="font-medium">{t("Expert")}:</span>{" "}
                {booking.expert.firstName} {booking.expert.lastName}
              </p>
              <p className="text-sm">
                <span className="font-medium">{t("Date")}:</span>{" "}
                {new Date(booking.slot.date).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">{t("Time")}:</span>{" "}
                {booking.slot.startTime} - {booking.slot.endTime}
              </p>
            </div>

            <Button
              className="ml-4 p-2 rounded-full hover:bg-blue-200"
              onClick={() => navigate(`/chat/${booking.expert.id}`)}
            >
              <div>Join</div>
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingsList;
