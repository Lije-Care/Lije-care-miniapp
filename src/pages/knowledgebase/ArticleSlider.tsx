import { useSelector } from "react-redux";
import ArticleCard from "./ArticleCard";
import { RootState } from "@/redux/store";
import { Page } from "@/components/Page";
// import { dummyArticles } from "./dummyArticles";

const ArticlesPage = () => {
  const { articles } = useSelector((state: RootState) => state.articles);
  return (
  <Page back={true}>
   <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center">📚 All Articles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
    </Page>
  );
};

export default ArticlesPage;
