import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
// import { RootState } from "@/redux/store";
// import { FaEdit, FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { Subheadline, Text } from "@telegram-apps/telegram-ui";
// import { fetchChildrenByParentId } from "@/redux/slices/childSlice";

const ChildrenDisplay = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(); // i18n hook

  useEffect(() => {
    // dispatch(fetchChildrenByParentId());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-lg mx-auto">
      <div className="shadow-lg rounded-lg p-6 w-full relative">
        {/* <button onClick={handleEdit} className="absolute top-2 right-2 text-blue-500">
          <FaEdit size={20} />
        </button> */}

        {/* {isEditing ? (
          <form onSubmit={handleSubmit} className="grid gap-2">
            <label className="font-medium">{t("Name")}:</label>
            <input ... />

            <label className="font-medium">{t("Date of Birth")}:</label>
            <input ... />

            <label className="font-medium">{t("Gender")}:</label>
            <select ...>
              <option value="male">{t("Male")}</option>
              <option value="female">{t("Female")}</option>
            </select>

            <label className="font-medium">{t("Weight (kg)")}:</label>
            <input ... />

            <label className="font-medium">{t("Height (cm)")}:</label>
            <input ... />

            <label className="font-medium">{t("MUAC")}:</label>
            <input ... />

            <label className="font-medium">{t("Dietary Restrictions")}:</label>
            <input ... />

            <label className="font-medium">{t("Allergies")}:</label>
            <input ... />

            <label className="font-medium">{t("Medications")}:</label>
            <input ... />

            <button type="submit" className="...">
              {t("Save")}
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-y-3 text-gray-700">
            <span className="font-medium">{t("Name")}:</span>
            <span>{children[currentIndex].name}</span>

            <span className="font-medium">{t("Date of Birth")}:</span>
            <span>{children[currentIndex].date_of_birth.split("T")[0]}</span>

            <span className="font-medium">{t("Gender")}:</span>
            <span>{children[currentIndex].gender}</span>

            <span className="font-medium">{t("Weight (kg)")}:</span>
            <span>{children[currentIndex].weight || t("N/A")}</span>

            <span className="font-medium">{t("Height (cm)")}:</span>
            <span>{children[currentIndex].height || t("N/A")}</span>

            <span className="font-medium">{t("MUAC")}:</span>
            <span>{children[currentIndex].muac || t("N/A")}</span>

            <span className="font-medium">{t("Dietary Restrictions")}:</span>
            <span>{children[currentIndex].dietary_restrictions || t("None")}</span>

            <span className="font-medium">{t("Allergies")}:</span>
            <span>{children[currentIndex].allergies || t("None")}</span>

            <span className="font-medium">{t("Medications")}:</span>
            <span>{children[currentIndex].medications || t("None")}</span>
          </div>
        )} */}
      </div>

      {/* <div className="flex justify-between w-full mt-4">
        <button onClick={handlePrev} ...>
          <FaArrowLeft />
        </button>
        <button onClick={handleNext} ...>
          <FaArrowRight />
        </button>
      </div> */}
    </div>
  );
};

export default ChildrenDisplay;
