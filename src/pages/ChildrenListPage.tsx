import React, { useEffect, useState } from "react";
import { Button, Headline, Spinner } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchChildrenByParentId, deleteChildById } from "@/redux/slices/childSlice";
import AddChildForm from "./Profile/AddChildForm";
import type { RootState, AppDispatch } from "@/redux/store";
import { Child } from "@/types";
import useTelegramUser from "@/hooks/useTelegramUser";

const ChildrenListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [childrenData, setChildrenData] = useState<Child[] | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const { data, loading, error } = useSelector((state: RootState) => state.children);
  const telegramUser = useTelegramUser();

  useEffect(() => {
    if (!telegramUser?.id) return;
    dispatch(fetchChildrenByParentId(telegramUser.id));
  }, [dispatch, telegramUser]);

  useEffect(() => {
    setChildrenData(data);
  }, [data]);

  const handleViewChild = (childId: string) => {
    navigate(`/child/${childId}`);
  };

  const confirmDelete = (child: Child) => {
    setSelectedChild(child);
    setShowConfirmDelete(true);
  };

  const handleDeleteChild = async () => {
    if (!selectedChild) return;
    try {
      setDeleting(true);
      await dispatch(deleteChildById(selectedChild.id)).unwrap();

      // Remove from local state
      setChildrenData((prev) => prev?.filter((c) => c.id !== selectedChild.id) || []);
      setShowConfirmDelete(false);
      setSelectedChild(null);
    } catch (err) {
      alert("Failed to delete child. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <Headline>My Children</Headline>
        <Button className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <FaPlus /> <span>Add Child</span>
        </Button>
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
            className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div onClick={() => handleViewChild(child.id)} className="cursor-pointer">
                <h2 className="text-lg font-semibold text-gray-200">{child.name}</h2>
                <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded bg-blue-600 text-white text-sm w-fit">
                  {child.gender === "Male" ? "👦 Boy" : "👧 Girl"}
                </div>
              </div>
              <button
                className="text-red-500 hover:text-red-300 transition"
                onClick={() => confirmDelete(child)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Add New Child</h2>
            <AddChildForm onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && selectedChild && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold mb-3 text-red-500">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete <strong>{selectedChild.name}</strong>?
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
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                onClick={handleDeleteChild}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildrenListPage;
