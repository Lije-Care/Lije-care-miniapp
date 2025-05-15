import { Headline } from "@telegram-apps/telegram-ui";
import product1 from "@/assets/logo.png"

const products = [
  { img: product1, name: "Aveeno", description: "Baby Lotion", price: 100 },
  { img: product1, name: "Shea Moisture", description: "Healing Lotion", price: 120 },
  { img: product1, name: "Aveeno", description: "Baby Lotion", price: 100 },
  { img: product1, name: "Shea Moisture", description: "Healing Lotion", price: 120 },
  { img: product1, name: "Aveeno", description: "Baby Lotion", price: 100 },
  { img: product1, name: "Shea Moisture", description: "Healing Lotion", price: 120 },
  { img: product1, name: "Aveeno", description: "Baby Lotion", price: 100 },
  { img: product1, name: "Shea Moisture", description: "Healing Lotion", price: 120 },
];


const ProductCard = ({ product }: {product: any}) => {
  return (
    <div className="p-2 rounded-lg shadow-md w-40">
      <img src={product.img} alt={product.name} className="w-full h-34 object-cover" />
      <Headline className="text-sm font-semibold mt-2">{product.name}</Headline>
      <p className="text-xs ">{product.description}</p>
      <p className="text-blue-500 font-bold">${product.price}</p>
      <button className="bg-blue-500 text-white text-xs py-1 px-2 rounded w-full mt-2">Add to Cart</button>
    </div>
  );
};

const ProductList = () => {
    return (
      <div className="p-4 ">
      <h2 className="text-white text-lg font-bold mb-3">Products</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
     
    </div>
    );
  };
  


  
  export default ProductList;
  