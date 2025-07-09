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
      <Section style={{ padding: "20px" }}>
        <Headline style={{ marginBottom: "20px" }}>📢 {t("Promotions")}</Headline>

        {loading && (
          <div className="text-center">
            <Spinner size="s"/>
            <Text>{t("Loading promotions...")}</Text>
          </div>
        )}

        {error && (
          <Text style={{ color: "red", marginBottom: "10px" }}>{error}</Text>
        )}

        {!loading && !error && promotions.length === 0 && (
          <Text>{t("No promotions found.")}</Text>
        )}

        {promotions.map((promo) => (
          <Card
            key={promo.id}
            style={{
              marginBottom: "16px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {promo.imageUrl && (
              <img
                src={promo.imageUrl}
                alt={promo.title}
                style={{
                  width: "100%",
                  maxHeight: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Subheadline style={{ marginBottom: "4px" }}>{promo.title}</Subheadline>
              <Text style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>
                {promo.description}
              </Text>
            </div>
          </Card>
        ))}
      </Section>
    </Page>
  );
};

export default PromotionsList;