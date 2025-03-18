import { Headline } from "@telegram-apps/telegram-ui";

const ParentProfile = () => {
    return (
      <div className="flex justify-center items-center bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <Headline style={{textAlign: 'center'}}>Parent Profile</Headline>
          <div className="grid grid-cols-2 gap-y-3 text-gray-700">
            <span className="font-medium">Parent Name:</span>
            <span>Daniel Abera</span>
  
            <span className="font-medium">Mobile No:</span>
            <span>0965482399</span>
  
            <span className="font-medium">Email:</span>
            <span>danielabera@gmail.com</span>
  
            <span className="font-medium">Address:</span>
            <span>Addis Ababa</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default ParentProfile;
  