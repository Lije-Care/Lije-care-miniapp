import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";


const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles } = useSelector((state: RootState) => state.articles);
   const article = articles.find(item => item.id === id || "");


  if (!article) {
    return <div className="p-4 text-red-500">Article not found.</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <button className=" underline" onClick={() => navigate(-1)}>← Back</button>
      <img src={article.image} alt={article.title} className="w-full h-60 object-cover rounded-xl" />
      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p >By {article.author}</p>
      <p className="text-sm text-yellow-500">Rating: {article.rating} ⭐</p>
      <div className="flex flex-wrap gap-2">
        {article.tags.map(tag => (
          <span key={tag} className="px-2 py-1 text-xs rounded-full">
            #{tag}
          </span>
        ))}
      </div>
      <div className="text-base  pt-4">
        {article.content} {/* Expand with more paragraphs if needed */}
      </div>
    </div>
  );
};

export default ArticleDetail;
