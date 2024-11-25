import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductCard({
  product,
  setFormData,
  setOpenCreateProductDialog,
  setCurrentEditedId,
  handleDelete,
}) {

  const [showFullDescription, setShowFullDescription] = useState(false); // Manage full description visibility

  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col">
      <div className="flex-1 p-1">
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>

          {/* Description with max height and overflow */}
          <p
            className={`text-sm text-gray-500 mb-2 ${!showFullDescription ? 'max-h-[200px] overflow-hidden' : ''}`}
          >
            {product?.description}
          </p>

          {/* Toggle button to view more */}
          {!showFullDescription && (
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setShowFullDescription(true)}
                className="text-blue-500 p-0"
              >
                View More
              </Button>
            </div>
          )}

          {/* Display category, subcategory, etc. */}
          <p className="text-sm text-gray-500 mb-2">Category: {product?.category?.name || "N/A"}</p>
          <p className="text-sm text-gray-500 mb-2">Subcategory: {product?.subcategory?.name || "N/A"}</p>
          <p className="text-sm text-gray-500 mb-2">Brand: {product?.brand || "N/A"}</p>
          <p className="text-sm text-gray-500 mb-2">SKU: {product?.sku || "N/A"}</p>
          <p className="text-sm text-gray-500 mb-2">
            Stock Status: {product?.stockStatus || "N/A"}
          </p>

          <div className="flex justify-between items-center mb-2">
            <span
              className={`${product?.basePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-primary`}
            >
              ${product?.basePrice}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex justify-between items-center">
        <Button
          onClick={() => {
            setOpenCreateProductDialog(true);
            setCurrentEditedId(product?._id);
            setFormData({
              image: product?.image,
              title: product?.title,
              description: product?.description,
              category: product?.category || "",
              subcategory: product?.subcategory || "",
              brand: product?.brand || "",
              price: product?.price,
              salePrice: product?.salePrice || "",
              totalStock: product?.totalStock,
              reviewCounts: product?.reviewCounts || 0,
              rating: product?.rating || 0,
              sku: product?.sku || "",
              stockStatus: product?.stockStatus || "",
            });
          }}
        >
          Edit
        </Button>
        <Button className="bg-red-500 hover:bg-red-700" onClick={() => handleDelete(product?._id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductCard;
