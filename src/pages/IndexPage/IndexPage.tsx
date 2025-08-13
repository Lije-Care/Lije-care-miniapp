import {
  Section,
  Headline,
  Caption,
  Button,
  Spinner,
  Subheadline,
} from "@telegram-apps/telegram-ui";
import { useEffect, useState, type FC } from "react";
import { Page } from "@/components/Page.tsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import parentImage from "@/assets/images/parent.png";
import DoctorsList from "@/components/Templates/DoctorsList";
import ArticleSliderWidget from "../knowledgebase/ArticleSliderWidget";
import { fetchArticles } from "@/redux/slices/articlesSlice";
import { AppDispatch, RootState } from "@/redux/store";
import parentAvatar from "@/assets/avatar.png";
import childAvatar from "@/assets/images/baby.png";
import GrowthTrackerHome from "../Profile/GrowthTrackerHome";
import { fetchParent } from "@/redux/slices/itemSlice";
import { fetchChildrenByParentId } from "@/redux/slices/childSlice";
import { fetchSpecialists } from "@/redux/slices/specialistSlice";
import { FiBell } from "react-icons/fi";
import PromotionsList from "../Profile/PromotionsList";
import { useTranslation } from "react-i18next";

export const IndexPage: FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { articles, loading } = useSelector(
    (state: RootState) => state.articles
  );
  const { data: children } = useSelector((state: RootState) => state.children);
  const parentState = useSelector((state: RootState) => state.parent);
  console.log({ parentState });

  const parent = {
    name: parentState.parent?.name ?? t("Unknown"),
    avatar: parentAvatar,
  };
  const favoriteChildId = localStorage.getItem("favorite_child_id");
  const child =
    children?.find((c) => c.id === favoriteChildId) ?? children?.[0];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const val = JSON.parse(storedUser || "{}");
    dispatch(fetchArticles({ page: 1, limit: 6 }));
    dispatch(fetchParent(val?.id));
    dispatch(fetchChildrenByParentId(val?.id));
    dispatch(fetchSpecialists({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="l" />
      </div>
    );
  }

  return (
    <Page back={true}>
      <div className="flex justify-end px-4 mt-3 relative">
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2"
        >
          <FiBell size={24} />
          {/* {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )} */}
        </button>
      </div>

      <Section className="overflow-y-auto pb-8">
        {/* 👨‍👩‍👧 Profile Cards */}
        <div className="flex gap-4 px-4 py-3 justify-between">
          {/* Parent Card */}
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 border rounded-xl px-3 py-2 shadow-sm cursor-pointer w-full max-w-xs"
          >
            <img
              alt={t("Parent Avatar")}
              src={parentImage}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col min-w-0">
              <p className="text-base font-semibold truncate">{parent.name}</p>
              <p className="text-sm text-gray-500 truncate">{t("Parent")}</p>
            </div>
          </div>

          {/* Child Card */}
          <div
            onClick={() => navigate("/children")}
            className="flex items-center gap-3 border rounded-xl px-3 py-2 shadow-sm cursor-pointer w-full max-w-xs"
          >
            {child ? (
              <>
                <img
                  alt={t("Child Avatar")}
                  src={childAvatar || "https://via.placeholder.com/48"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col min-w-0">
                  <p className="text-base font-semibold truncate">
                    {child.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {t("Children")}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col min-w-0">
                <p className="text-base font-semibold truncate">
                  {t("No child")}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {t("Add a profile")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 📊 Assessment Summary */}
        {child?.assessment && (
          <div className="mx-4 my-4 p-4 rounded-xl shadow-md border">
            <Headline weight="2" className="mb-2">
              {t("Health Assessment")}
            </Headline>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(child.assessment).map(([label, value]) => (
                <div
                  key={label}
                  className="text-center p-2 border rounded-lg shadow-sm"
                >
                  <Subheadline>{String(value)}</Subheadline>
                  <Caption className="text-gray-500">
                    {t(label.toUpperCase())}
                  </Caption>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button size="s" onClick={() => setExpanded(!expanded)}>
                {expanded ? t("Hide Details") : t("Show Details")}
              </Button>
            </div>
          </div>
        )}

        <div className="text-center font-bold text-gray-600">
          {t("Anthropometric")}
        </div>

        <Section className="mt-4">
          <GrowthTrackerHome childProfile={child} />
          <div className="mt-4">
            <ArticleSliderWidget articles={articles} />
          </div>
          <PromotionsList />
          <div className="mt-4">
            <DoctorsList />
          </div>
        </Section>
      </Section>
    </Page>
  );
};
