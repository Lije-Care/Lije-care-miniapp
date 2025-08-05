import React, { useState } from "react";
import Burger from "@/assets/e-commerce/big-sandwich-hamburger-burger-with-beef-red-onion-tomato-fried-bacon.jpg";
import Egg from "@/assets/e-commerce/close-up-delicious-egg-toast.jpg";
import Bread from "@/assets/e-commerce/slices-dark-white-bread-box-tablecloth.jpg";
interface CartPageProps {
  onClose: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Burger",
      price: 90.0,
      color: "Salmon",
      quantity: 1,
      image: Burger,
    },
    {
      id: 2,
      name: "Egg",
      price: 32.0,
      color: "Blue",
      quantity: 1,
      image: Egg,
    },
    {
      id: 3,
      name: "Bread",
      price: 140.0,
      color: "White and black",
      quantity: 1,
      image: Bread,
    },
  ]);

  const handleQuantityChange = (id: number, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white shadow-xl">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close cart</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
              className="size-6"
            >
              <path
                d="M6 18 18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-8">
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-300">
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-300">
                    <img src={item.image} className="size-full object-cover" />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href="#">{item.name}</a>
                        </h3>
                        <p className="ml-4">
                          ETB {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.color}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-500">Qty</p>
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="rounded-md border border-black bg-white px-2 py-1 text-gray-900 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          readOnly
                          className="w-12 rounded-md border border-black bg-white text-center text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="rounded-md border border-black bg-white px-2 py-1 text-gray-900 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>ETB {subtotal.toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="mt-6">
          <a
            href="#/checkout/page"
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
          >
            Checkout
          </a>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            or
            <a
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
