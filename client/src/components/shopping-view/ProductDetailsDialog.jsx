import { Dialog, DialogContent } from "../ui/dialog";
import { useDispatch } from "react-redux";
import { setProductDetails } from "@/store/shop/products-slice";
import ProductDetails from "./ProductDetails";

function ProductDetailsDialog({ open, setOpen, product }) {
  const dispatch = useDispatch();


  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
  }


  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent
        tabIndex={-1} // Make it focusable
        className="mx-auto overflow-auto min-h-[50vh] max-h-[95vh] grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <ProductDetails product={product} />
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
