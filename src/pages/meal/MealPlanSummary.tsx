import { useState, useEffect } from "react";
import api from "@/api/axios";
import { Badge, Card, Placeholder } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Page } from "@/components/Page";
import { useTranslation } from "react-i18next";

type Meal = {
  id: string;
  title: string;
  meal_type: string;
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

const MealPlanSummary = () => {
  const { t } = useTranslation();
  const [mealPlans, setMealPlans] = useState<MealPlan[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data } = useSelector((state: RootState) => state.children);
  const navigate = useNavigate();

  useEffect(() => {
    if (!data || data.length === 0) {
      setMealPlans([]);
      setError(t("No child profile found. Please add a child first."));
      return;
    }

    const childIds = data.map((child) => child.id);

    // Fetch meal plans for all children
    Promise.all(childIds.map((id) => api.get(`/meal-Plans/by-child/${id}`)))
      .then((responses) => {
        const allMealPlans = responses.flatMap((res) => res.data?.data ?? []);
        setMealPlans(allMealPlans);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching meal plans:", err);
        setMealPlans([]);
        setError(
          err?.response?.data?.message ||
            t("Failed to fetch meal plans. Please try again later.")
        );
      });
  }, [data, t]);

  return (
    <Page back={true}>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-center text-emerald-500">
          {t("📋 Your Meal Plans")}
        </h2>

        {error && (
          <div className="text-red-500 text-center text-sm">{error}</div>
        )}

        {mealPlans === null ? (
          <Placeholder />
        ) : mealPlans.length > 0 ? (
          mealPlans.map((mealPlan) => (
            <Card
              key={mealPlan.id}
              className="p-4 shadow-sm bg-white rounded-xl w-full border border-gray-200 hover:shadow-md cursor-pointer transition-all"
              onClick={() => navigate(`/mealplansummary/${mealPlan.id}`)}
            >
              {/* Description + Metadata */}
              <div className="space-y-1">
                <p className="text-sm line-clamp-2 font-medium">
                  {mealPlan.meal_description || "No description available."}
                </p>
                <p className="text-xs ">
                  🔥 {mealPlan.calories} kcal · 🕒{" "}
                  {new Date(mealPlan.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Divider */}
              <div className="my-2 border-t border-gray-200" />

              {/* Child Info */}
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-gray-800">
                  {t("👶 Child")}:
                </span>{" "}
                {mealPlan.child?.name || t("Unnamed")} <br />
                <span className="font-semibold text-gray-800">
                  {t("Allergies")}:
                </span>{" "}
                {mealPlan.child?.allergies || t("None")} <br />
                <span className="font-semibold text-gray-800">
                  {t("Restrictions")}:
                </span>{" "}
                {mealPlan.child?.dietary_restrictions || t("None")}
              </div>

              {/* Divider */}
              <div className="my-2 border-t border-gray-200" />

              {/* Meals Preview */}
              <div>
                <h4 className="text-sm font-semibold mb-1">🍽️ Meals</h4>
                {Array.isArray(mealPlan.meals) && mealPlan.meals.length > 0 ? (
                  <div className="space-y-1">
                    {mealPlan.meals.slice(0, 3).map((meal) => (
                      <div
                        key={meal.id}
                        className="flex justify-between items-center text-sm "
                      >
                        <span>{meal.title || "Untitled"}</span>
                        <Badge type="dot">{meal.meal_type || "Unknown"}</Badge>
                      </div>
                    ))}
                    {mealPlan.meals.length > 3 && (
                      <p className="text-xs italic mt-1">
                        + {mealPlan.meals.length - 3} more
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs">No meals listed.</p>
                )}
              </div>
            </Card>
          ))
        ) : (
          !error && (
            <div className="text-center text-gray-500">
              {t("No meal plans found. You can create one below!")}
            </div>
          )
        )}
      </div>
    </Page>
  );
};

export default MealPlanSummary;
