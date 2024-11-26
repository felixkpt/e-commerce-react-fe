import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/ProductDetailsDialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    if (keyword.trim() && keyword.length >= 3) {
      setIsLoading(true);
      const delayDebounce = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword)).finally(() => setIsLoading(false));
      }, 1000);

      return () => {
        clearTimeout(delayDebounce)
        setIsLoading(false);
      };
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems.items || [];
    const indexOfCurrentItem = getCartItems.findIndex(
      (item) => item.productId === getCurrentProductId
    );

    if (indexOfCurrentItem > -1) {
      const getQuantity = getCartItems[indexOfCurrentItem].quantity;
      if (getQuantity + 1 > getTotalStock) {
        toast({
          title: `Only ${getQuantity} quantity can be added for this item`,
          variant: "destructive",
        });
        return;
      }
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

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (openDetailsDialog &&  productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);


  const handleProductQuickView = (productId) => {
    setOpenDetailsDialog(true)
    handleGetProductDetails(productId)
  }

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="loader"></div> {/* Use a CSS loader or spinner */}
        </div>
      ) : !keyword.trim() ? (
        <h2 className="text-2xl text-center mt-4">
          Please enter a keyword to start searching.
        </h2>
      ) : searchResults.length === 0 ? (
        <h2 className="text-2xl text-center mt-4">No results found!</h2>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResults.map((item, index) => (
            <ShoppingProductTile
              key={index}
              handleProductQuickView={handleProductQuickView}
              handleAddtoCart={handleAddtoCart}
              product={item}
            />
          ))}
        </div>
      )}

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        product={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
