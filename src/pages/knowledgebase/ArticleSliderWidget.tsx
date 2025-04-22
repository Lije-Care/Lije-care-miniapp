import { useNavigate } from "react-router-dom";

import ArticleCard from "./ArticleCard";

const ArticleSliderWidget = ({articles}: any) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">👩‍⚕️ Featured Articles</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {articles?.slice(0, 3).map((article:any) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      <div className="text-right">
        <button
          onClick={() => navigate("/articles")}
          className="text-blue-600 font-semibold hover:underline"
        >
          See More Articles →
        </button>
      </div>
    </div>
  );
};

export default ArticleSliderWidget;
