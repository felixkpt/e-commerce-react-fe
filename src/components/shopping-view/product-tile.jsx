import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";

function ShoppingProductTile({
  product,
  handleProductQuickView,
  handleAddtoCart,
}) {
  return (
    <Card className="product-section w-full max-w-sm flex flex-col mx-auto">
      <Link to={`/shop/view/${product._id}`} className="flex-1 p-1">
        <div className="relative">
          <span className="product-quick-view absolute right-0 top-[50%] rounded p-0.5 text-gray-200" onClick={(e) => {
            e.preventDefault()
            handleProductQuickView(product?._id)
          }}>
            Quick view
          </span>
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
        </CardContent>
      </Link>
      <CardFooter>
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center mb-2 text-lg">
            <span>
              {
                product?.basePrice &&
                <span
                  className={`line-through font-semibold text-gray-400`}
                >
                  ${product?.basePrice}
                </span>
              }
            </span>
            {product?.salePrice > 0 ? (
              <span className="font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
          {product?.totalStock === 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed">
              Out Of Stock
            </Button>
          ) : (
            <Button
              onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
              className="w-full"
            >
              Add to cart
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
