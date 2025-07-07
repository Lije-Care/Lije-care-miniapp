import { useNavigate } from "react-router-dom";

const ArticleCard = ({ article, showButton = true }: any) => {
  const navigate = useNavigate();
 
  return (
    // <div className="rounded-xl shadow-md p-4 space-y-3 flex-shrink-0 w-80">
    //   <img src={article.image} alt={article.title} className="w-full h-40 object-cover rounded-lg" />
    //   <h3 className="text-lg font-semibold">{article.title}</h3>
    //   <p className="text-sm ">by {article.author}</p>
    //   <p className="text-sm  line-clamp-3">{article.content}</p>
    //   {showButton && (
    //     <button
    //       className="mt-2 w-full font-semibold hover:underline"
    //       onClick={() => navigate(`/articles/${article.id}`)}
    //     >
    //       Read More →
    //     </button>
    //   )}
    // </div>
    <div className="rounded-xl overflow-hidden shadow-md  hover:shadow-lg transition duration-300 h-full flex flex-col">
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <h3 className="text-lg font-semibold line-clamp-2">{article.title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{article.description}</p>
      </div>
    </div>
  );
};

export default ArticleCard;
