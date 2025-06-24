/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleOrder = () => {
    navigate(`/confirm-order/${product._id}`, { state: { quantity } });
  };

  return (
    <div className="w-[1000px] bg-white rounded-xl shadow-lg p-5 border border-slate-200 flex flex-col">
      {/* Product Image */}
      <div className="h-56 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-slate-50">
        <img
          src={product.image}
          alt={product.productname}
          className="object-contain w-full h-full"
        />
      </div>

      {/* Product Title */}
      <h3 className="text-xl font-bold text-slate-800 truncate mb-2">
        {product.productname}
      </h3>

      {/* Type */}
      <div className="text-slate-500 text-sm mb-1">{product.type}</div>

      {/* Price */}
      <div className="text-slate-700 font-semibold text-lg mb-3">
        Rs. {product.price}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-9 h-9 flex items-center justify-center bg-slate-200 rounded-lg text-lg font-bold"
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) =>
            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-14 text-center border border-slate-300 rounded-lg py-2"
        />
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="w-9 h-9 flex items-center justify-center bg-slate-200 rounded-lg text-lg font-bold"
        >
          +
        </button>
      </div>

      {/* Order Button */}
      <button
        onClick={handleOrder}
        className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold mt-auto"
      >
        Order Now
      </button>
    </div>
  );
};

export default ProductCard;
