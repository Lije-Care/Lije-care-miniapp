import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button, Headline, Input, Spinner } from "@telegram-apps/telegram-ui";
import { FaEdit } from "react-icons/fa";
import { updateParent } from "@/redux/slices/itemSlice";

const ParentProfile = () => {
  const dispatch = useDispatch();
  const parent = useSelector((state: RootState) => state.parent);
  const [loading, setLoading] = useState(false);
  console.log(parent);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: parent.parent?.firstName || "",
    lastName: parent.parent?.lastName || "",
    phone: parent.parent?.phone || "",
    address: parent.parent?.address || "",
    city: parent.parent?.city || "",
    telegram_username: parent.parent?.telegram_username || "",
    avatarUrl: parent.parent?.avatarUrl || "https://i.pravatar.cc/150"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    dispatch(updateParent(formData)).then(()=>{
      setLoading(false);
    });
    setIsEditing(false);
  };
  

  return (
    <div className="flex justify-center items-center p-4">
        <div className="shadow-lg rounded-lg p-6 w-full max-w-md relative">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            <FaEdit size={20} />
          </button>
          <Headline style={{ textAlign: "center" }}>Parent Profile</Headline>
          <div className="flex justify-center my-4">
            <img src={formData.avatarUrl} alt="Parent Avatar" className="w-24 h-24 rounded-full border" />
          </div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <Input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="Avatar URL"
                className="border p-2 rounded"
              />
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="border p-2 rounded"
              />
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="border p-2 rounded"
              />
              <Input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="border p-2 rounded"
              />
              <Input
                type="text"
                name="address"
                value={formData?.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 rounded"
              />
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="border p-2 rounded"
              />
              <Input
                type="text"
                name="telegram_username"
                value={formData.telegram_username}
                onChange={handleChange}
                placeholder="Telegram Username"
                className="border p-2 rounded"
              />
              <div className="flex justify-between">
                <Button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</Button>
                <Button type="button" onClick={() => setIsEditing(false)} className="bg-gray-400 text-white p-2 rounded">Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-y-3 text-gray-700">
              <span className="font-medium">Parent Name:</span>
              <span>{parent.parent?.firstName} {parent.user?.lastName}</span>
              <span className="font-medium">Mobile No:</span>
              <span>{parent.parent?.phone || "N/A"}</span>
              <span className="font-medium">Email:</span>
              <span>{parent.parent?.email || "N/A"}</span>
              <span className="font-medium">Address:</span>
              <span>{parent.parent.address || "N/A"}</span>
              <span className="font-medium">City:</span>
              <span>{parent.parent.city || "N/A"}</span>
              <span className="font-medium">Telegram username:</span>
              <span>{parent.parent.telegram_username || "N/A"}</span> 
            </div>
          )}
          {loading && <div className="flex justify-center items-center h-20"><Spinner size="l"/></div>}
        </div>
      </div>
  );
};

export default ParentProfile;
