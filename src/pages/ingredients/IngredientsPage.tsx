import { useEffect, useState } from "react";
import api from "@/api/axios";

import fallback from "@/assets/meal.png";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";

const IngredientsPage = () => {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [expandedIngredientId, setExpandedIngredientId] = useState<
    string | null
  >(null);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await api.get(`ingredient/find-all?skip=1&limit=1000`);
        const responseData = Array.isArray(res.data)
          ? res.data
          : res.data?.data;
        setIngredients(responseData || []);
        const totalCount = res?.data?.meta?.total || 0;
        setTotalCount(totalCount);
      } catch (err) {
        console.error("Error fetching ingredients:", err);
        setError(t("Could not load ingredients. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, [t]);

  const toggleIngredientExpand = (ingredientId: string) => {
    setExpandedIngredientId((prev) =>
      prev === ingredientId ? null : ingredientId
    );
  };

  // Helper to parse age range
  const parseAgeRange = (ageRangeStr: string) => {
    try {
      const parsed = JSON.parse(ageRangeStr);
      if (parsed.maxMonths === 0) {
        return `${parsed.minMonths}+ months`;
      }
      return `${parsed.minMonths} - ${parsed.maxMonths} months`;
    } catch {
      return "N/A";
    }
  };

  // Helper to calculate total nutrients by name (summing duplicates)
  const calculateIngredientNutrients = (ingredient: any) => {
    const nutrientsMap = new Map();
    ingredient.nutrientAmounts?.forEach((na: any) => {
      const nutrientName = na.nutrient.name;
      if (nutrientsMap.has(nutrientName)) {
        nutrientsMap.set(
          nutrientName,
          nutrientsMap.get(nutrientName) + na.amount
        );
      } else {
        nutrientsMap.set(nutrientName, na.amount);
      }
    });
    return Object.fromEntries(nutrientsMap);
  };

  return (
    <div>
      <div className="min-h-screen w-full bg-gray-800">
        {/* Header */}
        <div className="bg-[#013222]">
          <div className="flex justify-between items-center px-4 py-3 bg-[#013222] border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              {t("All Ingredients")}
            </h2>
            <span className="text-gray-300 text-sm">
              {t("Total ingredient")}:{" "}
              <span className="font-semibold text-emerald-400">
                {totalCount}
              </span>
            </span>
          </div>
        </div>
        <div className="px-4 mt-4 text-white space-y-6">
          {loading ? (
            <p className="text-center text-gray-300">Loading ingredients...</p>
          ) : error ? (
            <p className="text-center text-red-400">{error}</p>
          ) : ingredients.length === 0 ? (
            <p className="text-center text-gray-300">
              No ingredients available.
            </p>
          ) : (
            ingredients.map((ingredient) => {
              const expanded = expandedIngredientId === ingredient.id;
              const ageRange = parseAgeRange(ingredient.suitableAgeRange);
              const portionDisplay = `${ingredient.portionSize} ${
                ingredient.portionUnit?.abbreviation || ""
              }`;
              const nutrients = calculateIngredientNutrients(ingredient);

              return (
                <div
                  key={ingredient.id}
                  className="p-4 rounded-xl border transition-all duration-200 cursor-pointer border-gray-700 shadow-sm bg-[#0B8FAC]"
                  onClick={() => toggleIngredientExpand(ingredient.id)}
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={
                        typeof ingredient.imageUrl === "string" &&
                        ingredient.imageUrl.startsWith("http")
                          ? ingredient.imageUrl
                          : `${fallback}`
                      }
                      alt={ingredient.name}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-700"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = `${fallback}`;
                      }}
                    />
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-emerald-300">
                        {ingredient.name}
                      </h2>
                      <p className="text-xs text-white italic">
                        Age: {ageRange} · Food Group: {ingredient.foodGroup} ·
                        Portion: {portionDisplay}
                      </p>
                      <div className="flex mt-2 items-center">
                        <Eye className="h-4 w-4 text-gray-300 ml-2" />
                        <span className="text-gray-300 ml-1 text-sm underline font-serif">
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                  {expanded && (
                    <div className="mt-4 space-y-2 text-sm bg-[#D9D9D94D] p-4 rounded-lg">
                      <p className="text-gray-100">
                        <strong>Food Group:</strong> {ingredient.foodGroup}
                      </p>
                      <p className="text-gray-100">
                        <strong>Suitable Age Range:</strong> {ageRange}
                      </p>
                      <p className="text-gray-100">
                        <strong>Portion Size:</strong> {portionDisplay} (
                        {ingredient.portionUnit?.name})
                      </p>
                      <p className="text-gray-100">
                        <strong>Density:</strong> {ingredient.density}
                      </p>
                      <p className="text-gray-100">
                        <strong>Allergen:</strong>{" "}
                        {ingredient.allergen ? "Yes" : "No"}
                      </p>
                      {ingredient.allergenDescription && (
                        <p className="text-gray-100">
                          <strong>Allergen Description:</strong>{" "}
                          {ingredient.allergenDescription}
                        </p>
                      )}
                      <p className="text-gray-100">
                        <strong>Intolerance:</strong>{" "}
                        {ingredient.intolerance ? "Yes" : "No"}
                      </p>
                      {ingredient.intoleranceDescription && (
                        <p className="text-gray-100">
                          <strong>Intolerance Description:</strong>{" "}
                          {ingredient.intoleranceDescription}
                        </p>
                      )}
                      <p className="text-gray-100">
                        <strong>Choking Hazard:</strong>{" "}
                        {ingredient.choking ? "Yes" : "No"}
                      </p>
                      {ingredient.drugInteraction && (
                        <p className="text-gray-100">
                          <strong>Drug Interaction:</strong>{" "}
                          {ingredient.drugInteraction}
                        </p>
                      )}
                      <p className="text-gray-100">
                        <strong>Nutrients:</strong>
                      </p>
                      <ul className="list-disc list-inside ml-4">
                        {Object.entries(nutrients).length ? (
                          Object.entries(nutrients).map(([name, amount]) => (
                            <li key={name}>
                              {name} –{" "}
                              <span className="text-emerald-300">
                                {Number(amount).toFixed(2)}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 italic">
                            No nutrients available
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientsPage;
