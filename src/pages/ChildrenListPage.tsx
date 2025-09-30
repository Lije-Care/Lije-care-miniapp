import React, { useEffect, useState } from "react";
import { Headline, Spinner } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChildrenByParentId,
  deleteChildById,
} from "@/redux/slices/childSlice";
import AddChildForm from "./Profile/AddChildForm";
import type { RootState, AppDispatch } from "@/redux/store";
// import { Child } from "@/types";
import { Page } from "@/components/Page";
import { useTranslation } from "react-i18next";
import { Child } from "@/redux/slices/itemSlice";

const FAVORITE_CHILD_KEY = "favorite_child_id";

const ChildrenListPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [childrenData, setChildrenData] = useState<Child[] | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [favoriteChildId, setFavoriteChildId] = useState<string | null>(
    localStorage.getItem(FAVORITE_CHILD_KEY)
  );
  //  const [childId, setCChildId]=useState();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.children
  );

  const telegramUser = JSON.parse(localStorage.getItem("user") || "{}");
  console.log({ telegramUser });

  useEffect(() => {
    if (!telegramUser?.id) return;
    dispatch(fetchChildrenByParentId(telegramUser.id));
  }, []);

  useEffect(() => {
    setChildrenData(data as unknown as Child[]);

    // Handle favorite child logic after data is fetched
    if (data && data.length === 1) {
      // Only one child — set as favorite
      const singleChildId = data[0].id;
      localStorage.setItem(FAVORITE_CHILD_KEY, singleChildId);
      setFavoriteChildId(singleChildId);
    } else if (data && data.length === 0) {
      // No children — remove favorite
      localStorage.removeItem(FAVORITE_CHILD_KEY);
      setFavoriteChildId(null);
    }
  }, [data]);

  const handleViewChild = (childId: string) => {
    navigate(`/child/${childId}`);
  };

  const confirmDelete = (child: Child) => {
    setSelectedChild(child);
    setShowConfirmDelete(true);
  };

  // child id comment by walleman
  // const childId = (child: Child) => {
  //   setSelectedChild(child);
  //   setShowConfirmDelete(true);
  // };
  const handleDeleteChild = async () => {
    if (!selectedChild) return;
    try {
      setDeleting(true);
      await dispatch(deleteChildById(selectedChild.id)).unwrap();
      setChildrenData(
        (prev) => prev?.filter((c) => c.id !== selectedChild.id) || []
      );
      setShowConfirmDelete(false);
      setSelectedChild(null);
      if (favoriteChildId === selectedChild.id) {
        localStorage.removeItem(FAVORITE_CHILD_KEY);
        setFavoriteChildId(null);
      }
    } catch (err) {
      alert(t("Failed to delete child. Please try again."));
    } finally {
      setDeleting(false);
    }
  };

  const toggleFavorite = (childId: string) => {
    if (favoriteChildId === childId) {
      localStorage.removeItem(FAVORITE_CHILD_KEY);
      setFavoriteChildId(null);
    } else {
      localStorage.setItem(FAVORITE_CHILD_KEY, childId);
      setFavoriteChildId(childId);
    }
  };

  return (
    <Page back={true}>
      <div className="p-4 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <Headline>{t("My Children")}</Headline>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold px-4 py-2 rounded-md transition-all duration-200"
          >
            <FaPlus className="text-base" />
            <span>{t("Add Child")}</span>
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-6">
            <Spinner size="s" />
          </div>
        )}

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-lg flex items-center mb-4">
            <FaExclamationTriangle className="mr-2" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {childrenData?.map((child) => (
            <div
              key={child.id}
              className="bg-gray-800 rounded-xl p-5 shadow-md border border-gray-700 hover:shadow-xl transition-all relative"
            >
              <div className="absolute top-2  right-2">
                <button
                  className="text-red-500 hover:text-red-300 transition"
                  onClick={() => confirmDelete(child)}
                >
                  <FaTrash />
                </button>
              </div>
              <div className=" flex gap-1">
                <div
                  onClick={() => handleViewChild(child.id)}
                  className="cursor-pointer"
                >
                  <div>
                    <h2 className="text-lg font-bold text-gray-100 mb-1">
                      Child Name: {child.name}
                    </h2>
                  </div>
                  <span className="inline-flex items-center ml-2  text-sm  text-gray-300">
                    Gender: {child.gender === "Male" ? t("Boy") : t("Girl")},
                  </span>
                  <span className=" text-green-600 ml-2 text-sm underline">
                    View detail
                  </span>
                </div>
                <button
                  className="text-xl -mt-8 "
                  onClick={() => toggleFavorite(child.id)}
                  title={
                    favoriteChildId === child.id
                      ? t("Unmark Favorite")
                      : t("Mark as Favorite")
                  }
                >
                  {favoriteChildId === child.id ? "✅" : "⬜"}
                </button>
              </div>

              <div className="mt-1 flex justify-between">
                <div className=" mt-4 flex flex-center item-center ">
                  <button
                    className="bg-purple-700 rounded-lg  text-sm text-gray-300 px-2 py-1 "
                    onClick={() => navigate(`/meal/${child.id}`)}
                  >
                    + {t("Create meal plan")}
                  </button>
                </div>
                <div className=" mt-4 ">
                  <button
                    className="bg-teal-300 text-black rounded-lg px-2 py-1 text-sm fw-700 hover:bg-teal-400 transition"
                    onClick={() => {
                      navigate(`/mealplansummary/${child?.id}`);
                    }}
                  >
                    {t("View meal plans")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Child Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
              <h2 className="text-xl font-semibold mb-4">
                {t("Add New Child")}
              </h2>
              <AddChildForm onClose={() => setShowAddModal(false)} />
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {showConfirmDelete && selectedChild && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full shadow-xl">
              <h2 className="text-lg font-bold mb-3 text-red-500">
                {t("Confirm Delete")}
              </h2>
              <p className="mb-4">
                {t("Are you sure you want to delete")}{" "}
                <strong>{selectedChild.name}</strong>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                  onClick={() => {
                    setShowConfirmDelete(false);
                    setSelectedChild(null);
                  }}
                  disabled={deleting}
                >
                  {t("Cancel")}
                </button>
                <button
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                  onClick={handleDeleteChild}
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

export default ChildrenListPage;
