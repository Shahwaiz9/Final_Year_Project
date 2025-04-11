import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const ConfirmOrder = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const authToken = localStorage.getItem("authToken");

  const [product, setProduct] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const quantity = location.state?.quantity || 1;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/product/${id}`, {
          headers: { Authorization: authToken },
        });
        const data = await response.json();
        setProduct(data.Product);
      } catch (err) {
        setError("Failed to load product details");
      }
    };

    fetchProduct();
  }, [id, authToken]);

  useEffect(() => {
    if (orderSuccess) {
      const timer = setTimeout(() => {
        navigate("/marketplace");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (
        !address.street ||
        !address.city ||
        !address.postalCode ||
        !address.phone
      ) {
        throw new Error("Please fill all address fields");
      }

      if (paymentMethod === "card" && (!stripe || !elements)) {
        throw new Error("Payment system is not ready");
      }

      const orderData = {
        vendor: product.vendor,
        product: product._id,
        quantity,
        totalAmount: product.price * quantity,
        paymentMethod,
        shippingAddress: address,
      };

      if (paymentMethod === "card") {
        const { error: stripeError, paymentMethod: stripePaymentMethod } =
          await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
          });

        if (stripeError) throw new Error(stripeError.message);
        orderData.paymentId = stripePaymentMethod.id;
      }

      const response = await fetch("http://localhost:5000/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Order failed");

      setOrderSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="text-center py-8">Loading...</div>;

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mt-24">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-slate-600 mb-6">
              Thank you for your purchase. Redirecting to marketplace...
            </p>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full animate-[progress_3s_linear_forwards]" />
              <style>{`
                @keyframes progress {
                  from { width: 0% }
                  to { width: 100% }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mt-24">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Confirm Your Order
        </h1>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-6">
            <img
              src={product.image}
              alt={product.productname}
              className="w-24 h-24 object-contain border border-slate-200 rounded-lg"
            />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {product.productname}
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                {product.description}
              </p>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-lg font-bold text-green-700">
                  ${product.price.toFixed(2)} x {quantity}
                </span>
                <span className="text-xl font-bold text-slate-900">
                  Total: ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Details Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress({ ...address, postalCode: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Payment Method
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-green-400 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="h-4 w-4 text-green-600"
                />
                <div className="flex-1">
                  <span className="font-medium text-slate-900">
                    Cash on Delivery
                  </span>
                  <p className="text-sm text-slate-500 mt-1">
                    Pay when you receive the product
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-green-400 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="h-4 w-4 text-green-600"
                />
                <div className="flex-1">
                  <span className="font-medium text-slate-900">
                    Credit/Debit Card
                  </span>
                  <p className="text-sm text-slate-500 mt-1">
                    Secure card payment
                  </p>

                  {paymentMethod === "card" && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      <CardElement
                        className="p-3 border border-slate-300 rounded-lg"
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#424770",
                              "::placeholder": { color: "#a0aec0" },
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 bg-red-100 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl 
                     transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmOrder;
