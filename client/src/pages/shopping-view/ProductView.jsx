import ProductDetails from "@/components/shopping-view/ProductDetails";
import { fetchAllCategories } from "@/store/shop/category-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ProductView = () => {
  const { id: productId } = useParams(); // Extract `id` from the route params
  const { categoryList = [] } = useSelector((state) => state.shopCategories);
  const [canRenderNoProdFound, setCanRenderNoProdFound] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [productId, dispatch]);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);


  // Fetch categories on component mount
  useEffect(() => {
    setCanRenderNoProdFound(false)
    const timer = setTimeout(() => {
      setCanRenderNoProdFound(true)
    }, 600);

    return () => clearTimeout(timer)
  }, [productDetails]);

  function handleNavigateToListingPage(getCurrentItem, section) {

    dispatch(fetchProductDetails(null));

    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id || getCurrentItem._id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    setTimeout(() => {
      navigate(`/shop/listing`);
      setCanRenderNoProdFound(true)
    }, 400);
  }

  if (isLoading) return <div>Loading...</div>;

  if (!productDetails && canRenderNoProdFound) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          No Product Found
        </h2>
        <p className="text-gray-500 mb-6">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition duration-300"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!productDetails) return null;

  return (
    <div className="flex flex-wrap p-3">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-12 w-full md:w-4/5 mb-4">
        <ProductDetails product={productDetails} />
      </div>
      <div className="w-full md:w-1/5">
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold md:text-center mb-8">
              Shop by category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categoryList?.map((option, i) => (
                <div key={i} onClick={() => handleNavigateToListingPage(option, 'category')}>
                  <span className="flex font-medium items-center cursor-pointer">
                    {option.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductView;
