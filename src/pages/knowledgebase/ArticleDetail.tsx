import { useParams, useNavigate } from "react-router-dom";


const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const dummyArticles = [
    {
      id: 1,
      title: "Top 5 Nutrient-Rich Foods for Toddlers",
      author: "Dr. Hana Teshome",
      rating: 4.8,
      tags: ["Nutrition", "Toddler"],
      image: "https://ix-marketing.imgix.net/footer-image.png",
      content: "Discover the best foods to boost immunity and growth in toddlers including avocados, eggs, and legumes."
    },
    {
      id: 2,
      title: "Understanding Growth Milestones in Infants",
      author: "Nurse Lemlem Kebede",
      rating: 4.5,
      tags: ["Child Care", "Growth"],
      image: "https://ix-marketing.imgix.net/footer-image.png",
      content: "Learn the key indicators of physical and cognitive growth in children aged 0–12 months."
    },
    {
      id: 3,
      title: "When and How to Introduce Solid Foods",
      author: "Dr. Abenezer Yilma",
      rating: 4.9,
      tags: ["Feeding", "Weaning"],
      image: "https://ix-marketing.imgix.net/footer-image.png",
      content: "A step-by-step guide to starting solid foods at 6 months — what to feed, how much, and what to avoid."
    },
    {
      id: 4,
      title: "Dealing with Common Infant Illnesses",
      author: "Dr. Selam Assefa",
      rating: 4.7,
      tags: ["Health", "Toddler"],
      image: "https://ix-marketing.imgix.net/footer-image.png",
      content: "Tips on recognizing and treating common illnesses like colds, fevers, and tummy bugs."
    },
    {
      id: 5,
      title: "Importance of Play in Early Development",
      author: "Dr. Binyam Getachew",
      rating: 4.6,
      tags: ["Development", "Child Care"],
      image: "https://ix-marketing.imgix.net/footer-image.png",
      content: "Explore how play influences brain development and social skills in young children."
    },
    {
      id: 6,
      title: "Vaccination Schedule You Should Know",
      author: "Nurse Muluwork Zewdu",
      rating: 4.8,
      tags: ["Health", "Parenting"],
      image: "https://ix-marketing.imgix.net/footer-image.png",
      content: "A parent-friendly guide to essential vaccines, timing, and safety tips."
    }
  ];
  const article = dummyArticles.find(item => item.id === parseInt(id || ""));


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
