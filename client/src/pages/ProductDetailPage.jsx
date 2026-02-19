"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  clearProductDetails,
} from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import {
  FaLeaf,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaUser,
  FaComment,
  FaArrowLeft,
} from "react-icons/fa";
import { placeholder } from "../assets";
import PageContainer from "../components/PageContainer";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { product, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems, farmerId } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getProductDetails(id));

    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  const handleQuantityChange = (e) => {
    let value = Number.parseInt(e.target.value);
    if (isNaN(value) || value < 1) value = 1;
    if (product && value > product.quantityAvailable) {
      value = product.quantityAvailable;
    }
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user.role === "farmer") {
      alert("Farmers cannot place orders. Please use a consumer account.");
      return;
    }

    if (product.quantityAvailable === 0) {
      alert("This product is currently out of stock.");
      return;
    }

    if (quantity > product.quantityAvailable) {
      alert(`Only ${product.quantityAvailable} ${product.unit} available.`);
      return;
    }

    if (farmerId && farmerId !== product.farmer._id && cartItems.length > 0) {
      if (
        !confirm(
          "Your cart contains items from a different farm. Would you like to clear your cart and add this item?"
        )
      ) {
        return;
      }
    }

    dispatch(addToCart({ product, quantity }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!message.trim()) {
      return;
    }

    dispatch(
      sendMessage({
        receiver: product.farmer._id,
        content: message,
      })
    );

    setMessage("");
    setShowMessageForm(false);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <PageContainer className="py-8 text-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
        <Link
          to="/products"
          className="mt-4 inline-block text-green-500 hover:text-green-700"
        >
          Back to Products
        </Link>
      </PageContainer>
    );
  }

  if (!product) {
    return <Loader />;
  }

  return (
    <PageContainer className="py-8">
      <Link
        to="/products"
        className="flex items-center text-green-500 dark:text-white hover:text-green-700 dark:hover:text-gray-200 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-80">
            {product.images && product.images.length > 0 ? (
              <img
                src={
                  product.images[activeImage]?.startsWith('http') || product.images[activeImage]?.startsWith('data:')
                    ? product.images[activeImage]
                    : `${import.meta.env.VITE_BACKEND_URL}${product.images[activeImage]}`
                }
                alt={product.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            ) : (
              <div>
                <img
                  src={placeholder}
                  alt="placeholder"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden h-20 ${
                    activeImage === index ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image?.startsWith('http') || image?.startsWith('data:') ? image : `${import.meta.env.VITE_BACKEND_URL}${image}`}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{product.name}</h1>

          <div className="flex items-center mb-4">
            <span className="text-gray-600 dark:text-gray-300 mr-4">
              Category: {product.category?.name || "General"}
            </span>
            {product.isOrganic && (
              <span className="badge badge-green">Organic</span>
            )}
          </div>

          <div className="text-2xl font-bold text-green-600 dark:text-white mb-4">
            Rs. {product.price.toFixed(2)} / {product.unit}
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6">{product.description}</p>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FaLeaf className="text-green-500 mr-2" />
              <span className="font-medium text-gray-800 dark:text-gray-200">Available Quantity:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                {product.quantityAvailable} {product.unit}
              </span>
            </div>

            {product.harvestDate && (
              <div className="flex items-center mb-2">
                <FaLeaf className="text-green-500 mr-2" />
                <span className="font-medium text-gray-800 dark:text-gray-200">Harvest Date:</span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {new Date(product.harvestDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl mb-6 transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Farmer Information</h3>
            <div className="flex items-center mb-2">
              <FaUser className="text-green-500 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">{product.farmer?.name}</span>
            </div>
            {product.farmer?.address && (
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-green-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  {product.farmer.address.city}, {product.farmer.address.state}
                </span>
              </div>
            )}
            <Link
              to={`/farmers/${product.farmer?._id}`}
              className="text-green-500 hover:text-green-700 font-medium"
            >
              View Farm Profile
            </Link>
          </div>

          {user?.role !== "farmer" && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/3">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.quantityAvailable}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="form-input pl-3"
                />
              </div>
              <div className="w-full sm:w-2/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  &nbsp;
                </label>
                <button
                  onClick={handleAddToCart}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2"
                  disabled={product.quantityAvailable === 0}
                >
                  <FaShoppingCart />
                  <span>
                    {product.quantityAvailable === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {isAuthenticated && user?.role !== "farmer" && (
            <div>
              {showMessageForm ? (
                <form onSubmit={handleSendMessage} className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Message to Farmer
                  </label>
                  <textarea
                    id="message"
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-input mb-2 pl-3"
                    placeholder="Ask a question about this product..."
                    required
                  ></textarea>
                  <div className="flex space-x-2">
                    <button type="submit" className="btn btn-primary">
                      Send Message
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMessageForm(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowMessageForm(true)}
                  className="flex items-center space-x-2 text-green-500 hover:text-green-700"
                >
                  <FaComment />
                  <span c>Message Farmer</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default ProductDetailPage;
