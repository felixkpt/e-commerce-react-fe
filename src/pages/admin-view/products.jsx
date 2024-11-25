import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductCard from "@/components/admin-view/AdminProductCard";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements, initialFormData } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminCreateProductsFromJson from "./AdminCreateProductsFromJson";


function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] =
    useState(false);
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [createdKey, setCreatedKey] = useState(0);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        console.log(data, "edit");

        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductDialog(false);
          setCurrentEditedId(null);
        }
      })
      : dispatch(
        addNewProduct(formData)
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast({
            title: "Product add successfully",
          });
        }
      });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    console.log('formData', formData)
    return Object.keys(formData)
      .filter((currentKey) => initialFormData[currentKey] && initialFormData[currentKey].length > 0)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    setFormData({ ...formData, image: uploadedImageUrl });
  }, [uploadedImageUrl]);

  useEffect(() => {
    if (createdKey > 0) {
      setOpenCreateProductsDialog(false)
      dispatch(fetchAllProducts());
    }
  }, [createdKey]);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end gap-2">
        <Button onClick={() => setOpenCreateProductDialog(true)}>
          Add New Product
        </Button>
        <Button className="bg-blue-500" onClick={() => setOpenCreateProductsDialog(true)}>
          Add Products from JSON
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem, i) => (
            <AdminProductCard
              key={i}
              setFormData={setFormData}
              setOpenCreateProductDialog={setOpenCreateProductDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={handleDelete}
            />
          ))
          : null}
      </div>
      <Sheet
        open={openCreateProductDialog}
        onOpenChange={() => {
          setOpenCreateProductDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
      {/* Modal for Adding Products from JSON */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => setOpenCreateProductsDialog(false)}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add Products from JSON</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <AdminCreateProductsFromJson
              onClose={() => setOpenCreateProductsDialog(false)}
              toast={toast}
              dispatch={dispatch}
              setCreatedKey={setCreatedKey}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
