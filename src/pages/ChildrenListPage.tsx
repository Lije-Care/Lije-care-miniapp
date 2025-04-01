import React, { useEffect, useState } from "react";
import { Button, Headline, Spinner, Text, Input, Select } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaExclamationTriangle } from "react-icons/fa";
import InterpretZScore from "@/components/InterpretZScore";
import { calculateZScore } from "@/utils/calculateZScore";
import { useDispatch, useSelector } from "react-redux";
import { fetchChildrenByParentId } from "@/redux/slices/childSlice";
import { useForm } from "react-hook-form";
import { addChild } from "@/redux/slices/childSlice";

const ChildrenListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [childrenData, setChildrenData] = useState();
  const { children, loading, error } = useSelector((state) => state.children);
  const [showAddModal, setShowAddModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    dispatch(fetchChildrenByParentId()).then((res)=>{
      console.log(res);
      setChildrenData(res.payload)
    });
    console.log(children?.data);
  }, [dispatch]);

 

  const handleViewChild = (childId) => {
    navigate(`/child/${childId}`);
  };

  const handleAddChild = (data) => {
    console.log(data);
    // dispatch(addChild(data));
    
    // setShowAddModal(false);
    reset();
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
        {childrenData?.map((child) => (
          <div
            key={child.id}
            className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-all shadow-md border border-gray-700"
            onClick={() => handleViewChild(child.id)}
          >
            <div className="mb-4">
              <InterpretZScore zScore={calculateZScore(child.height, 100, 10)} />
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-200">{child.name}</h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-blue-600 text-white text-sm">
                {child.gender === "Male" ? "👦 Boy" : "👧 Girl"}
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Age: {new Date().getFullYear() - new Date(child.date_of_birth).getFullYear()} years
            </p>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Child</h2>
            <form onSubmit={handleSubmit(handleAddChild)} className="space-y-4">
              <Input label="Name" {...register("name", { required: true })} />
              <Input label="Date of Birth" type="date" {...register("date_of_birth", { required: true })} />
              <Select label="Gender" {...register("gender", { required: true })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
              <div className="grid grid-cols-3 gap-4">
                <Input label="Weight (kg)" type="number" step="0.1" {...register("weight", { required: true })} />
                <Input label="Height (cm)" type="number" step="0.1" {...register("height", { required: true })} />
                <Input label="MUAC (cm)" type="number" step="0.1" {...register("muac", { required: true })} />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button stretched onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button stretched type="submit">Add Child</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildrenListPage;
