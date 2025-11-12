import { useState, useEffect, useMemo } from "react";
import api from "@/api/axios";
import { Badge, Placeholder } from "@telegram-apps/telegram-ui";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/Page";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";

type Meal = {
  id: string;
  name: string;
  mealType: string;
  mealTimes: string[];
};

type MealPlan = {
  id: string;
  meal_description: string;
  calories: number;
  createdAt: string;
  meal_date: string;
  expert: {
    firstName: string;
    lastName: string;
    role: string;
  };
  child: {
    name: string;
    dietary_restrictions: string;
    allergies: string;
  };
  meals?: Meal[];
};

const ChildMealPlanSummary = () => {
  const { t } = useTranslation();
  const [mealPlans, setMealPlans] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const childId = id;
  const navigate = useNavigate();

  // console.log({ mealPlans });
  const getDateKey = (dateStr: string) =>
    new Date(dateStr).toISOString().split("T")[0];

  const fetchMealDetails = async (mealPlanId: string) => {
    try {
      const res = await api.get(`/meal-plans/find-one/${mealPlanId}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching meal detail:", err);
      return null;
    }
  };

  useEffect(() => {
    if (!childId) return;
    api
      .get(`/meal-plans/by-child/${childId}`)
      .then(async (response) => {
        const basicPlans = response.data?.data ?? [];
        const detailedPlans = await Promise.all(
          basicPlans.map(async (plan: MealPlan) => {
            const detail = await fetchMealDetails(plan.id);
            return detail || plan;
          })
        );
        // normalize mealTimes to array
        const normalizedPlans = detailedPlans.map((plan) => ({
          ...plan,
          mealTimes: plan.mealTimes || {}, // ensure it’s an object
          meals:
            plan.meals?.map((meal: any) => ({
              ...meal,
              // we don’t need to overwrite mealTimes here, it comes from plan
            })) || [],
        }));

        setMealPlans(normalizedPlans);
      })
      .catch((err) => {
        console.error("Error fetching meal plans:", err);
        setMealPlans([]);
      });
  }, [childId]);

  useEffect(() => {
    if (mealPlans && mealPlans.length > 0 && activeDate && !activeTab) {
      const allMealTimess = Array.from(
        new Set(
          mealPlans.flatMap(
            (plan) => plan.meals?.flatMap((meal: any) => meal.mealTimes) || []
          )
        )
      );
      if (allMealTimess.length > 0) setActiveTab(allMealTimess[0]);
    }
  }, [mealPlans, activeDate, activeTab]);

  const uniqueDates = useMemo(() => {
    if (!mealPlans) return [];
    return Array.from(
      new Set(mealPlans.map((p) => getDateKey(p.meal_date)))
    ).sort((b, a) => new Date(b).getTime() - new Date(a).getTime());
  }, [mealPlans]);

  // const dateSummaries = useMemo(() => {
  //   if (!mealPlans) return {};
  //   const summaries: Record<string, { count: number; totalCalories: number }> =
  //     {};
  //   mealPlans.forEach((plan) => {
  //     const key = getDateKey(plan.meal_date);
  //     if (!summaries[key]) {
  //       summaries[key] = { count: 0, totalCalories: 0 };
  //     }
  //     summaries[key].count++;
  //     summaries[key].totalCalories += plan.calories;
  //   });
  //   return summaries;
  // }, [mealPlans]);

  const filteredPlans = useMemo(() => {
    if (!activeDate || !mealPlans) return [];
    return mealPlans
      .filter((p) => getDateKey(p.meal_date) === activeDate)
      .sort(
        (a, b) =>
          new Date(b.meal_date).getTime() - new Date(a.meal_date).getTime()
      );
  }, [mealPlans, activeDate]);

  // collect all unique meal times for tabs
  const allMealTimess = useMemo(() => {
    if (!mealPlans) return [];
    const times = mealPlans.flatMap(
      (plan) => Object.values(plan.mealTimes).flat() // flatten all mealTimes arrays
    );
    return Array.from(new Set(times)); // unique
  }, [mealPlans]);

  const handleDeleteMealPlan = async () => {
    if (!selectedMealPlan) return;
    setDeleting(true);
    try {
      await api.delete(`/meal-plans/${selectedMealPlan.id}`);
      setMealPlans((prev) =>
        prev ? prev.filter((plan) => plan.id !== selectedMealPlan.id) : []
      );
      setShowConfirmDelete(false);
      setSelectedMealPlan(null);
    } catch (err) {
      console.error("Error deleting meal plan:", err);
      setError(t("Failed to delete meal plan. Please try again."));
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan);
    setShowConfirmDelete(true);
  };

  // date card
  const DateCard = ({ dateKey }: { dateKey: string }) => {
    // const summary = dateSummaries[dateKey];
    const formattedDate = new Date(dateKey).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
      <div className=" flex justify-between p-4 shadow-sm bg-[#0B8FAC] rounded-xl w-full border border-gray-200 hover:shadow-md cursor-pointer transition-all">
        <div
          key={dateKey}
          className=" py-2"
          onClick={() => setActiveDate(dateKey)}
        >
          <h3 className="text-lg font-bold text-emerald-300">
            {formattedDate}
          </h3>
          {/* <p className="text-sm text-gray-300">
            Plans: {summary?.count || 0} | Total: {summary?.totalCalories || 0}{" "}
            kcal
          </p> */}
        </div>
        <button
          onClick={() => setActiveDate(dateKey)}
          className=" font-serif text-base"
        >
          View Detail
        </button>
      </div>
    );
  };

  const PlanCard = ({ mealPlan }: { mealPlan: any }) => {
    const selected = selectedMealPlan?.id === mealPlan.id;
    console.log({ selected });
    return (
      <div
        key={mealPlan.id}
        className="p-4 shadow-sm bg-[#0B8FAC] rounded-xl w-full border border-gray-200 hover:shadow-md cursor-pointer transition-all relative"
        onClick={() => navigate(`/detail/${mealPlan.id}`)}
      >
        {/* Delete button */}
        <div className="absolute right-2 top-2">
          <button
            className="text-red-500 hover:text-red-300 transition"
            onClick={(e) => {
              e.stopPropagation();
              confirmDelete(mealPlan);
            }}
          >
            <FaTrash className="w-6 h-6" />
          </button>
        </div>
        {/* Description + Metadata */}
        <div className="space-y-1 pr-8">
          <p className="text-sm line-clamp-2 font-medium">
            {mealPlan.meal_description || "No description available."}
          </p>
          {/* <p className="text-xs">
            🔥 {mealPlan.calories} kcal · 🕒{" "}
            Date: {new Date(mealPlan.meal_date).toLocaleDateString()}
          </p> */}
        </div>
        {/* Child Info */}
        <div className="my-2 border-t border-gray-200" />
        <div className="text-sm py-1 text-gray-300">
          <span>{t("👶 Child")}: </span>
          {mealPlan.child?.name || t("Unnamed")} <br />
          <span>{t("Allergies")}: </span>
          {mealPlan.child?.allergies || t("None")} <br />
          <span>{t("Restrictions")}: </span>
          {mealPlan.child?.dietary_restrictions || t("None")}
        </div>
        {/* Meals filtered by active tab */}
        <div className="my-2 border-t border-gray-200" />
        <div>
          <h4 className="text-sm font-semibold mb-1">🍽️ Meals</h4>
          {Array.isArray(mealPlan.meals) &&
          Object.entries(mealPlan.mealTimes).some(([times]) =>
            times.includes(activeTab)
          ) ? (
            <div className="space-y-1">
              {mealPlan.meals
                .filter((meal: any) =>
                  mealPlan.mealTimes[meal.id]?.includes(activeTab)
                )
                .map((meal: any) => (
                  <div
                    key={meal.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>Meal name: {meal.name || "Untitled"}</span>
                    <Badge type="dot">{meal.mealType || "Unknown"}</Badge>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-xs">No meals for this meal time.</p>
          )}
        </div>

        <span className="block mt-2 text-teal-300 rounded-sm px-2 py-1 underline text-sm">
          View detail
        </span>
      </div>
    );
  };

  return (
    <Page back={true}>
      <div className=" min-h-screen bg-gray-800">
        <h2 className=" pt-4 pb-10 bg-[#013222] text-xl font-bold text-center text-emerald-500">
          {t("📋 Your Meal Plans")}
        </h2>

        {error && (
          <div className="text-red-500 text-center text-sm">{error}</div>
        )}
        {mealPlans === null ? (
          <Placeholder />
        ) : !activeDate ? (
          <div className="space-y-4 mt-4 mx-3">
            {uniqueDates.length > 0 ? (
              uniqueDates.map((date) => <DateCard key={date} dateKey={date} />)
            ) : (
              <div className="text-center text-gray-500">
                {t("No meal plans found. You can create one below!")}
              </div>
            )}
          </div>
        ) : (
          <div className="">
            <div className=" flex justify-between pl-4 mb-2 pb-2 bg-[#013222] -mt-6 pr-2">
              <button
                onClick={() => {
                  setActiveDate(null);
                  setActiveTab("");
                }}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium pb-2"
              >
                ← Back to Dates
              </button>
              <h3 className="text-sm font-base font-serif text-emerald-300 ">
                Plans for{" "}
                {new Date(activeDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
            </div>
            {/* Meal Time Tabs - only show after date selection */}
            {allMealTimess.length > 0 && (
              <ul className="bg-[#013222] px-2 -mt-2 flex flex-wrap text-sm font-medium text-center border-b border-gray-200 mb-4">
                {allMealTimess.map((time) => (
                  <li key={time as any} className="mr-2">
                    <button
                      onClick={() => setActiveTab(time as any)}
                      className={`py-2 px-2 text-[18px] font-normal whitespace-nowrap mx-auto w-full rounded-sm ${
                        activeTab === time
                          ? "bg-[#0B8FAC] text-white" // filled style
                          : " text-gray-200 text-xl font-extrabold" // outline style
                      } rounded-lg`}
                    >
                      {time as any}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {filteredPlans.length > 0 ? (
              <div className="space-y-4">
                {filteredPlans.map((plan) => (
                  <PlanCard key={plan.id} mealPlan={plan} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No meal plans for this date.
              </div>
            )}
          </div>
        )}
        <div className="text-center mt-6 mx-16">
          <button
            className="bg-[#0B8FAC] hover:bg-[#0ea4c6] px-4 py-2 rounded text-gray-100"
            onClick={() => navigate(`/meal/${childId}`)}
          >
            ➕ {t("Create a Meal Plan")}
          </button>
        </div>

        {/* Confirm Delete Modal */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full shadow-xl">
              <h2 className="text-lg font-bold mb-3 text-red-500">
                {t("Confirm Delete")}
              </h2>
              <p className="mb-4">
                {t("Are you sure you want to delete this meal plan for")}{" "}
                <strong>{selectedMealPlan?.child.name}</strong>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                  onClick={() => {
                    setShowConfirmDelete(false);
                    setSelectedMealPlan(null);
                  }}
                  disabled={deleting}
                >
                  {t("Cancel")}
                </button>
                <button
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                  onClick={handleDeleteMealPlan}
                  disabled={deleting}
                >
                  {deleting ? t("Deleting...") : t("Delete")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default ChildMealPlanSummary;
