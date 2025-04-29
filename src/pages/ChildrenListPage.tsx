import React, { useEffect, useState } from "react";
import { Button, Headline, Spinner } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaExclamationTriangle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchChildrenByParentId } from "@/redux/slices/childSlice";
import AddChildForm from "./Profile/AddChildForm";
import type { RootState, AppDispatch } from "@/redux/store";
import { Child } from "@/types";
import useTelegramUser from "@/hooks/useTelegramUser";

const ChildrenListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [childrenData, setChildrenData] = useState<Child[] | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const { data,loading, error } = useSelector((state: RootState) => state.children);
 
  const telegramUser = useTelegramUser();

  useEffect(() => {
    if (!telegramUser?.id) return; // Don't dispatch until user is ready
  
    console.log(telegramUser.id);
  
    dispatch(fetchChildrenByParentId(telegramUser.id)).then((res) => {
      // setChildrenData(res.payload.data as Child[]);
      
    });
  }, [dispatch, telegramUser]);
  
 useEffect(()=>{
  console.log();
  setChildrenData(data);

 },[data])
  const handleViewChild = (childId: string) => {
    navigate(`/child/${childId}`);
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <Headline>My Children</Headline>
        <Button className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <FaPlus className="inline-block" /> <span className="inline-block">Add Child</span>
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
        {childrenData?.map((child) => {
          // const age = new Date().getFullYear() - new Date(child.date_of_birth).getFullYear();

          // const bmi = (child.weight / ((child.height / 100) ** 2)).toFixed(1);
          // const zScore = 10.0;

          return (
            <div
              key={child.id}
              className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-all shadow-md border border-gray-700"
              onClick={() => handleViewChild(child.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-200">{child.name}</h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-blue-600 text-white text-sm">
                  {child.gender === "Male" ? "👦 Boy" : "👧 Girl"}
                </div>
              </div>
             
              {/* <InterpretZScore z={zScore} type="BMI" /> */}
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Child</h2>
            <AddChildForm onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildrenListPage;