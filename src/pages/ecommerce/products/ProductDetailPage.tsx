import Egg from "@/assets/e-commerce/close-up-delicious-egg-toast.jpg";

import { Page } from "@/components/Page";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const products = [
    // Food category
    {
      id: 1,
      img: Egg,
      name: t("Eeg"),
      description: t(
        "Fresh farm eggs packed with protein.the egg from habesha chiken is also very good use it that is make use not fertile"
      ),
      price: 120,
      category: "food",
    },
  ];

  const ProductCard = ({ product }: { product: any }) => {
    return (
      <div className="p-2 rounded-lg shadow-md w-full">
        <a href="/#/product-detail/2">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-34 object-cover"
          />
          <div className="flex items-center justify-between mx-6">
            <p className=" text-xl font-semibold mt-2">{product.name}</p>
            <p className="text-base font-base"> Price: ETB {product.price}</p>
          </div>
          <p className=" text-sm font-base my-4 ml-4">{product.description}</p>
        </a>
        <button className="bg-blue-500 text-white text-xs py-3 px-2 rounded w-full mt-2">
          {t("Add to Cart")}
        </button>
      </div>
    );
  };

  return (
    <Page back={true}>
      <div className="">
        <Header />
        <div className="flex justify-center align-center w-full">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </Page>
  );
};

export default ProductDetailPage;
