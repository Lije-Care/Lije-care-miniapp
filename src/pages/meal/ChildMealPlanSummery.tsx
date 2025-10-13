import { useState, useEffect } from "react";
import api from "@/api/axios";
import { Badge, Button, Placeholder } from "@telegram-apps/telegram-ui";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/Page";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";

type Meal = {
  id: string;
  title: string;
  meal_type: string;
  mealTime: string;
  name: string;
};

type MealPlan = {
  id: string;
  meal_description: string;
  calories: number;
  createdAt: string;
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

const ChildMealPlanSummery = () => {
  const { t } = useTranslation();
  const [mealPlans, setMealPlans] = useState<MealPlan[] | null>(null);
  // console.log(" mealPlans", mealPlans[0]?.meals[0]?.mealTime);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(
    null
  );
  console.log({ selectedMealPlan });
  const [deleting, setDeleting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const childId = id;
  const navigate = useNavigate();

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
      .get(`/meal-Plans/by-child/${childId}`)
      .then(async (response) => {
        const basicPlans = response.data?.data ?? [];
        const detailedPlans = await Promise.all(
          basicPlans.map(async (plan: MealPlan) => {
            const detail = await fetchMealDetails(plan.id);
            return detail || plan;
          })
        );
        setMealPlans(detailedPlans);
      })
      .catch((err) => {
        console.error("Error fetching meal plans:", err);
        setMealPlans([]);
      });
  }, [childId]);

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

  // add this state at the top inside your component
  const [activeTab, setActiveTab] = useState<string>("Lunch"); // default tab

  // extract all unique meal times from all mealPlans (to generate tabs dynamically)
  const allMealTimes = Array.from(
    new Set(
      mealPlans?.flatMap(
        (plan) => plan.meals?.map((meal) => meal.mealTime) || []
      )
    )
  );

  return (
    <Page back={true}>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-center text-emerald-500">
          {t("📋 Your Meal Plans")}
        </h2>

        {error && (
          <div className="text-red-500 text-center text-sm">{error}</div>
        )}

        {/* start tab  */}

        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
          {allMealTimes.map((time) => (
            <li key={time} className="me-2">
              <button
                onClick={() => setActiveTab(time)}
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === time
                    ? "text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500"
                    : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                }`}
              >
                {time}
              </button>
            </li>
          ))}
        </ul>
        {/* end tabs */}

        {mealPlans === null ? (
          <Placeholder />
        ) : mealPlans.length > 0 ? (
          mealPlans.map((mealPlan) => (
            <div
              key={mealPlan.id}
              className="p-4 shadow-sm bg-[#0B8FAC] rounded-xl w-full border border-gray-200 hover:shadow-md cursor-pointer transition-all"
              onClick={() => navigate(`/detail/${mealPlan.id}`)}
            >
              <div className="absolute right-2 mr-6 ">
                <button
                  className="text-red-500 hover:text-red-300 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent div click
                    confirmDelete(mealPlan);
                  }}
                >
                  <FaTrash className="w-6 h-6" />
                </button>
              </div>
              {/* Description + Metadata */}
              <div className="space-y-1 ">
                <p className="text-sm line-clamp-2 font-medium pr-6">
                  {mealPlan.meal_description || "No description available."}
                </p>
                <p className="text-xs">
                  🔥 {mealPlan.calories} kcal · 🕒{" "}
                  {new Date(mealPlan.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Divider */}
              <div className="my-2 border-t border-gray-200" />

              {/* Child Info */}
              <div className="text-sm py-1 text-gray-300">
                <span className="text-sm mt-1 text-gray-300">
                  {t("👶 Child")}:
                </span>{" "}
                {mealPlan.child?.name || t("Unnamed")} <br />
                <span className="text-sm mt-1 text-gray-300">
                  {t("Allergies")}:
                </span>{" "}
                {mealPlan.child?.allergies || t("None")} <br />
                <span className="text-sm mt-1 text-gray-300">
                  {t("Restrictions")}:
                </span>{" "}
                {mealPlan.child?.dietary_restrictions || t("None")}
              </div>

              {/* Divider */}
              <div className="my-2 border-t border-gray-200" />

              {/* Meals Preview */}
              {/* Meals Preview */}
              <div>
                <h4 className="text-sm font-semibold mb-1">🍽️ Meals</h4>
                {Array.isArray(mealPlan.meals) && mealPlan.meals.length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(
                      mealPlan.meals.reduce(
                        (acc: Record<string, Meal[]>, meal) => {
                          const key = meal.mealTime || "Unknown";
                          if (!acc[key]) acc[key] = [];
                          acc[key].push(meal);
                          return acc;
                        },
                        {}
                      )
                    ).map(([mealTime, meals]) => (
                      <div key={mealTime}>
                        {/* Header for each mealTime */}
                        <h5 className="text-sm font-bold text-teal-300 mb-1">
                          Meal time: {mealTime}
                        </h5>

                        {/* Meals under this category */}
                        <div className="space-y-1">
                          {meals.map((meal) => (
                            <div
                              key={meal.id}
                              className="flex justify-between items-center text-sm"
                            >
                              <span>Meal name: {meal.name || "Untitled"}</span>
                              <Badge type="dot">
                                {meal.meal_type || "Unknown"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs">No meals listed.</p>
                )}
              </div>

              <span className=" absolute -mt-6 mr-8 right-2 text-teal-300 rounded-sm px-2 py-1  underline">
                View detail
              </span>
            </div>
          ))
        ) : (
          !error && (
            <div className="text-center text-gray-500">
              {t("No meal plans found. You can create one below!")}
            </div>
          )
        )}

        <div className="text-center">
          <Button
            className="mt-4 w-full bg-emerald-600 text-white"
            onClick={() => navigate(`/meal/${childId}`)}
          >
            ➕ {t("Create a Meal Plan")}
          </Button>
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

export default ChildMealPlanSummery;
