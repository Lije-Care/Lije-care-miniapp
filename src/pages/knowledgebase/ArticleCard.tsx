import { useNavigate } from "react-router-dom";

const ArticleCard = ({ article, showButton = true }: any) => {
  const navigate = useNavigate();
 
  return (
    <div className="rounded-xl shadow-md p-4 space-y-3 flex-shrink-0 w-80">
      <img src={article.image} alt={article.title} className="w-full h-40 object-cover rounded-lg" />
      <h3 className="text-lg font-semibold">{article.title}</h3>
      <p className="text-sm ">by {article.author}</p>
      <p className="text-sm  line-clamp-3">{article.content}</p>
      {showButton && (
        <button
          className="mt-2 w-full font-semibold hover:underline"
          onClick={() => navigate(`/articles/${article.id}`)}
        >
          Read More →
        </button>
      )}
    </div>
  );
};

export default ArticleCard;
