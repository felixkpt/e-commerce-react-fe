import {
  Airplay,
  Heater,
  Images,
  Shirt,
  ShoppingBasket,
  WashingMachine,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import HomeSlider from "@/components/HomeSlider";
import { useEffect, useState } from "react";
import { fetchAllCategories } from "@/store/shop/category-slice";
import ProductDetailsDialog from "@/components/shopping-view/ProductDetailsDialog";

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

const categoryColors = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300",
  "#DAF7A6", "#C70039", "#581845", "#28B463", "#A569BD"
];

function ShoppingHome() {

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const { categoryList = [] } = useSelector((state) => state.shopCategories);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { toast } = useToast();
  const navigate = useNavigate();


  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);


  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id || getCurrentItem._id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    if (!isAuthenticated && !isLoading) {
      return navigate("/auth/login")
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }


  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <div className="absolute w-full h-[500px] -z-0">
          <HomeSlider />
        </div>
        <div className="px-8 h-full mt-[500px] z-[500]">
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                Shop by category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categoryList.slice(0, 10).map((categoryItem, i) => (
                  <Card
                    key={i}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() =>
                      handleNavigateToListingPage(categoryItem, "category")
                    }
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="w-20 h-20 mb-4 text-primary shadow flex justify-center items-center font-bold text-3xl rounded"
                        style={{ backgroundColor: categoryColors[i % categoryColors.length] }}>{categoryItem.name.charAt(0)}</div>
                      <span className="font-bold">{categoryItem.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {brandsWithIcon.map((brandItem, i) => (
                  <Card
                    key={i}
                    onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                      <span className="font-bold">{brandItem.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                Feature Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productList && productList.length > 0
                  ? productList.map((productItem, i) => (
                    <ShoppingProductTile
                      key={i}
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  ))
                  : null}
              </div>
            </div>
          </section>
          <ProductDetailsDialog
            open={openDetailsDialog}
            setOpen={setOpenDetailsDialog}
            product={productDetails}
          />
        </div>
      </div>
    </div>
  );
}

export default ShoppingHome;
