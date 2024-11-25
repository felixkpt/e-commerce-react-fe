import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserCartItemsContent from "./cart-items-content";
import { Button } from "../ui/button";

const Cart = () => {

    const { cartItems } = useSelector((state) => state.shopCart);

    const navigate = useNavigate();

    const totalCartAmount =
        cartItems && cartItems.length > 0
            ? cartItems.reduce(
                (sum, currentItem) =>
                    sum +
                    (currentItem?.salePrice > 0
                        ? currentItem?.salePrice
                        : currentItem?.price) *
                    currentItem?.quantity,
                0
            )
            : 0;

    const items = cartItems?.items || []

    return (
        <div className="">
            <div className="max-w-5xl mx-auto mt-8 space-y-4">
                {
                    items.length > 0 ?
                        items.map((item, i) => <UserCartItemsContent key={i} cartItem={item} />)
                        :
                        <div>Your cart is empty</div>
                }
                <div className="mt-8 space-y-4">
                    <div className="flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">${totalCartAmount}</span>
                    </div>
                </div>

                <Button
                    onClick={() => {
                        navigate("/shop/checkout");
                    }}
                    className="w-full mt-6"
                >
                    Checkout
                </Button>
            </div>
        </div>
    )
}

export default Cart