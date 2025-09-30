"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Caption,
  // Headline,
  Spinner,
  Subheadline,
} from "@telegram-apps/telegram-ui";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchSpecialists } from "@/redux/slices/specialistSlice";
import { Page } from "@/components/Page";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { MdWidthFull } from "react-icons/md";

export default function ConsultationTab() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { specialists, loading, error } = useSelector(
    (state: RootState) => state.specialists
  );

  const categories = [
    t("All"),
    t("Nutritionist"),
    t("Doctors"),
    t("Questions"),
  ];
  const [activeCategory, setActiveCategory] = useState(t("All"));

  useEffect(() => {
    dispatch(fetchSpecialists({ page: 1, limit: 10 }));
  }, [dispatch]);

  // ✅ Helper to check future unbooked slots
  const hasFutureUnbookedSlot = (slots: any[] = []) => {
    return slots.some((slot) => {
      if (!slot || slot.isBooked || !slot.startTime || !slot.date) return false;
      try {
        const [hour, minute] = slot.startTime.split(":").map(Number);
        const dateObj = new Date(slot.date);
        const slotDateTime = new Date(
          dateObj.getFullYear(),
          dateObj.getMonth(),
          dateObj.getDate(),
          hour,
          minute
        );
        return slotDateTime.getTime() > Date.now();
      } catch {
        return false;
      }
    });
  };

  const filteredSpecialists = specialists.filter((doc) => {
    const hasAvailableSlot = hasFutureUnbookedSlot(doc.AvailabilitySlots);
    if (!hasAvailableSlot) return false;

    if (activeCategory === t("All")) return true;

    const specialty = doc?.SpecialistProfile?.specialty || "";
    return specialty.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <Page>
      <div className="p-2 w-full mx-auto space-y-6 ">
        <div className="flex justify-end">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded "
            onClick={() => navigate("/my-appointments")}
          >
            {t("My Appointments")}
          </Button>
        </div>

        <div
          className="w-full flex flex-between rounded-lg"
          style={{ background: "var(--tg-theme-bg-color)" }}
        >
          {categories.map((category) => (
            <Button
              key={category}
              className="py-3 -px-2 text-[10px] font-base whitespace-nowrap max-auto w-full"
              mode={activeCategory === category ? "filled" : "outline"}
              onClick={() => setActiveCategory(category)}
              title={`Filter by ${category}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <p className="font-extrabold text-gray-400 truncate">
          👩‍⚕️ {t("Choose a Specialist")}
        </p>

        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner size="l" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {filteredSpecialists.length === 0 ? (
              <p className="  flex flex-center justify-center font-semibold text-gray-400 px-6 mt-12 ">
                {t(
                  "No specialists are currently available. Please try again later."
                )}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredSpecialists.map((doc) => {
                  const fullName = `${doc?.firstName} ${doc?.lastName}`;
                  return (
                    <div
                      key={doc.id}
                      className="p-4 border rounded-lg flex justify-between items-center border-gray-700 bg-gray-800 cursor-pointer"
                      onClick={() => navigate(`/consultat/${doc.id}`)}
                    >
                      <div className="flex gap-4 items-center">
                        <img
                          src={doc?.avatarUrl || "/doctors/default-avatar.png"}
                          alt={fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <p className="font-bold">{fullName}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Page>
  );
}
