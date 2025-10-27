import {
  Headline,
  Section,
  Subheadline,
  Text,
  Card,
  Spinner,
} from "@telegram-apps/telegram-ui";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Page } from "@/components/Page";
import { useTranslation } from "react-i18next";

interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export const PromotionsList = () => {
  const { t } = useTranslation();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/promotion/find-all?page=1&limit=50", {
        headers: { "Content-Type": "application/json" },
      });
      setPromotions(res.data?.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || t("Failed to load promotions."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <Page back={true}>
      <div style={{ padding: "20px" }} className=" bg-gray-800">
        <Headline style={{ marginBottom: "20px" }}>
          📢 {t("Promotions")}
        </Headline>

        {loading && (
          <div className="text-center">
            <Spinner size="s" />
            <Text>{t("Loading promotions...")}</Text>
          </div>
        )}

        {error && (
          <Text style={{ color: "red", marginBottom: "10px" }}>{error}</Text>
        )}

        {!loading && !error && promotions.length === 0 && (
          <Text>{t("No promotions found.")}</Text>
        )}

        {!loading && !error && promotions.length > 0 && (
          <div className="flex overflow-x-auto space-x-4 pb-2 snap-x snap-mandatory bg-gray-800">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="snap-start flex-shrink-0 w-72 sm:w-80 bg-gray-800"
              >
                <div
                  className=" bg-gray-600 rounded-lg"
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    height: "100%",
                  }}
                >
                  {promo.imageUrl && (
                    <img
                      src={promo.imageUrl}
                      alt={promo.title}
                      style={{
                        width: "100%",
                        maxHeight: "160px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ marginBottom: "4px" }}>{promo.title}</span>
                    <p
                      style={{
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                        fontSize: "14px",
                      }}
                    >
                      {promo.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
};

export default PromotionsList;
