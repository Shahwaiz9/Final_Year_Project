import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Select from "react-select";

const FALLBACK_CITIES = [
  { value: "karachi", label: "Karachi", region: "Sindh" },
  { value: "lahore", label: "Lahore", region: "Punjab" },
  { value: "islamabad", label: "Islamabad", region: "Islamabad" },
  { value: "rawalpindi", label: "Rawalpindi", region: "Punjab" },
  { value: "faisalabad", label: "Faisalabad", region: "Punjab" },
  { value: "multan", label: "Multan", region: "Punjab" },
  { value: "hyderabad", label: "Hyderabad", region: "Sindh" },
  { value: "peshawar", label: "Peshawar", region: "KPK" },
  { value: "quetta", label: "Quetta", region: "Balochistan" },
];

const ConfirmOrder = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const authToken = localStorage.getItem("authToken");

  const [product, setProduct] = useState(null);
  const [cities, setCities] = useState([]);
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

  // Address change handler
  const handleAddressChange = (field) => (e) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Success redirection
  useEffect(() => {
    if (orderSuccess) {
      const timer = setTimeout(() => navigate("/marketplace"), 3000);
      return () => clearTimeout(timer);
    }
  }, [orderSuccess, navigate]);

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `http://api.geonames.org/searchJSON?country=PK&featureClass=P&maxRows=200&username=planthaven`
        );
        const data = await response.json();

        setCities(
          data.geonames?.map((city) => ({
            value: city.geonameId,
            label: city.name,
            region: city.adminName1,
          })) || FALLBACK_CITIES
        );
      } catch (error) {
        console.error("GeoNames API failed, using fallback cities", error);
        setCities(FALLBACK_CITIES);
      }
    };

    fetchCities();
  }, []);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/product/${id}`, {
          headers: { Authorization: authToken },
        });
        const data = await response.json();

        if (!data.Product?.vendor && !data.product?.vendor) {
          throw new Error("Product vendor information missing");
        }

        setProduct(data.Product || data.product);
      } catch (err) {
        setError(err.message || "Failed to load product details");
      }
    };

    fetchProduct();
  }, [id, authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      const requiredFields = ["street", "city", "postalCode", "phone"];
      if (requiredFields.some((field) => !address[field])) {
        throw new Error("Please fill all address fields");
      }

      if (!/^\d{5}$/.test(address.postalCode)) {
        throw new Error("Postal code must be 5 digits");
      }

      if (!/^03\d{9}$/.test(address.phone)) {
        throw new Error("Phone must start with 03 and be 11 digits");
      }

      // Prepare order data
      const orderData = {
        vendor: product.vendor?._id || product.vendor,
        product: product._id,
        quantity,
        totalAmount: product.price * quantity,
        paymentMethod,
        address: address.street,
        city: address.city,
        contactInfo: address.phone,
        postalCode: address.postalCode,
      };

      // Process Stripe payment
      if (paymentMethod === "card") {
        if (!stripe || !elements) throw new Error("Payment system not ready");

        const { error: stripeError, paymentMethod: stripePaymentMethod } =
          await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
          });

        if (stripeError) throw new Error(stripeError.message);
        orderData.paymentId = stripePaymentMethod.id;
      }

      // Submit order
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
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!product)
    return <div className="text-center py-8">Loading product details...</div>;

  if (orderSuccess)
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
              @keyframes progress { from { width: 0% } to { width: 100% } }
            `}</style>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mt-24 max-w-3xl mx-auto">
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
              loading="lazy"
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
                  Rs. {product.price} × {quantity}
                </span>
                <span className="text-xl font-bold text-slate-900">
                  Total: Rs. {product.price * quantity}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  value={address.street}
                  onChange={handleAddressChange("street")}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  City
                </label>
                <Select
                  options={cities}
                  onChange={(selected) =>
                    setAddress((prev) => ({ ...prev, city: selected.label }))
                  }
                  placeholder="Search for a city..."
                  noOptionsMessage={() => "No cities found"}
                  formatOptionLabel={(city) => (
                    <div>
                      {city.label}
                      <span className="text-xs text-slate-500 ml-2">
                        ({city.region})
                      </span>
                    </div>
                  )}
                  styles={{
                    control: (base) => ({
                      ...base,
                      padding: "2px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      minHeight: "42px",
                    }),
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  pattern="\d{5}"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  value={address.postalCode}
                  onChange={handleAddressChange("postalCode")}
                  placeholder="XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  pattern="03\d{9}"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  value={address.phone}
                  onChange={handleAddressChange("phone")}
                  placeholder="03XXXXXXXXX"
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
                    <div className="mt-4 space-y-4">
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <CardElement
                          className="mb-4"
                          options={{
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#424770",
                                "::placeholder": { color: "#aab7c4" },
                                ":-webkit-autofill": { color: "#fce883" },
                              },
                              invalid: { color: "#9e2146" },
                            },
                            hidePostalCode: true,
                          }}
                        />

                        <div className="flex justify-center gap-4 mb-4">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                            alt="Visa"
                            className="h-8 w-12 object-contain"
                            onError={(e) =>
                              (e.target.src =
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg")
                            }
                          />
                          <img
                            src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"
                            alt="Mastercard"
                            className="h-8 w-12 object-contain"
                            onError={(e) =>
                              (e.target.src =
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg")
                            }
                          />
                        </div>

                        <div className="text-xs text-slate-500 space-y-1">
                          <p className="font-medium">Test card numbers:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              <span className="font-semibold">Visa:</span> 4242
                              4242 4242 4242
                            </li>
                            <li>
                              <span className="font-semibold">Mastercard:</span>{" "}
                              5555 5555 5555 4444
                            </li>
                          </ul>
                          <p className="mt-2">
                            Use any future expiration date and random 3-digit
                            CVC
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-600 bg-red-100 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg 
                     transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {loading ? "Placing Order..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmOrder;
