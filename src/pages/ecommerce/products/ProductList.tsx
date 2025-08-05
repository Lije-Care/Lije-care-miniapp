import { useState } from "react";
import Burger from "@/assets/e-commerce/big-sandwich-hamburger-burger-with-beef-red-onion-tomato-fried-bacon.jpg";
import Egg from "@/assets/e-commerce/close-up-delicious-egg-toast.jpg";
import Bread from "@/assets/e-commerce/slices-dark-white-bread-box-tablecloth.jpg";
import Utensils from "@/assets/e-commerce/close-up-sustainable-cutlery-alternatives.jpg";
import Book from "@/assets/e-commerce/book.jpg";

import { Page } from "@/components/Page";
import { useTranslation } from "react-i18next";
import Header from "../header/Header";

const ProductList = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    {
      id: 1,
      img: Egg,
      name: t("Eeg"),
      description: t("Fresh farm eggs packed with protein."),
      price: 120,
      category: "food",
    },
    {
      id: 2,
      img: Bread,
      name: t("Bread"),
      description: t("Soft and fresh bread baked daily."),
      price: 100,
      category: "food",
    },
    {
      id: 3,
      img: Burger,
      name: t("fish"),
      description: t("Freshly caught fish, perfect for any meal."),
      price: 120,
      category: "food",
    },
    {
      id: 4,
      img: Bread,
      name: t("Bread"),
      description: t("Soft and fresh bread baked daily."),
      price: 100,
      category: "food",
    },
    {
      id: 5,
      img: Burger,
      name: t("Meat"),
      description: t("High-quality meat, tender and juicy."),
      price: 120,
      category: "food",
    },
    {
      id: 7,
      img: Burger,
      name: t("Burger"),
      description: t("Delicious burger made with fresh ingredients."),
      price: 120,
      category: "food",
    },
    {
      id: 9,
      img: Book,
      name: t("Mathematics Book"),
      description: t("A comprehensive guide to high school mathematics."),
      price: 90,
      category: "educational_materials",
    },
    {
      id: 10,
      img: Book,
      name: t("Science Workbook"),
      description: t("Interactive workbook for learning basic science."),
      price: 75,
      category: "educational_materials",
    },
    {
      id: 11,
      img: Utensils,
      name: t("Spoon Set"),
      description: t("Durable stainless steel spoon set."),
      price: 45,
      category: "utensils",
    },
    {
      id: 12,
      img: Utensils,
      name: t("Cooking Pan"),
      description: t("Non-stick cooking pan perfect for everyday meals."),
      price: 85,
      category: "utensils",
    },
  ];

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const ProductCard = ({ product }: { product: any }) => {
    return (
      <div className="p-2 rounded-lg shadow-md w-40">
        <a href="/#/product-detail/2">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-34 object-cover"
          />
          <div className="flex item-center  justify-between text-sm font-semibold mt-2 mx-2">
            <p>{product.name}</p>
            <p> ETB {product.price}</p>
          </div>
        </a>
        <button className="bg-blue-500 text-white text-xs py-1 px-2 rounded w-full mt-2">
          {t("Add to Cart")}
        </button>
      </div>
    );
  };

  return (
    <Page back={true}>
      <div className="">
        <Header />

        <div className="mt-2 p-2">
          <form className="flex w-full">
            <label
              htmlFor="category"
              className="mt-2 w-[180px] block mb-2 text-sm font-medium text-gray-300 dark:text-gray-400"
            >
              Select Category
            </label>
            <select
              id="category"
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="food">Baby Food & Supplement</option>
              <option value="utensils">Utensils</option>
              <option value="educational_materials">
                Educational Materials
              </option>
            </select>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </Page>
  );
};

export default ProductList;
