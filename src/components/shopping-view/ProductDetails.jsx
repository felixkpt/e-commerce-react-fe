import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import ProductReviews from "./ProductReviews";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addReview } from "@/store/shop/review-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

const ProductDetails = ({ product }) => {

    const [reviewMsg, setReviewMsg] = useState("");
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();
    const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const [showFullDescription, setShowFullDescription] = useState(false); // Manage full description visibility

    const { toast } = useToast();
    const navigate = useNavigate()

    useEffect(() => {
        setShowFullDescription(false)
        setRating(0);
        setReviewMsg("");
    }, [product])


    function handleRatingChange(getRating) {
        console.log(getRating, "getRating");

        setRating(getRating);
    }

    function handleAddReview() {
        dispatch(
            addReview({
                productId: product?._id,
                userId: user?.id,
                userName: user?.userName,
                reviewMessage: reviewMsg,
                reviewValue: rating,
            })
        ).then((data) => {
            if (data.payload.success) {
                setRating(0);
                setReviewMsg("");
                toast({
                    title: "Review added successfully!",
                });
            }
        });
    }


    function handleAddToCart(getCurrentProductId, getTotalStock) {

        if (!isAuthenticated && !isLoading) {
            return navigate("/auth/login")
        }

        let getCartItems = cartItems.items || [];

        if (getCartItems.length) {
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
        <>
            <div className="relative overflow-auto rounded-lg">
                <img
                    src={product?.image}
                    alt={product?.title}
                    width={600}
                    height={600}
                    className="aspect-square w-full object-cover"
                />
            </div>
            <div className="">
                <div className="cursor-default">
                    <h1 className="text-3xl font-extrabold">{product?.title}</h1>
                    {/* Description with max height and overflow */}
                    <p
                        className={`text-muted-foreground text-lg mb-5 mt-4 ${!showFullDescription ? 'max-h-[300px] overflow-hidden' : ''}`}
                    >
                        {product?.description}
                    </p>
                    {/* Toggle button to view more */}
                    {!showFullDescription && (
                        <div className="text-center">
                            <Button
                                variant="link"
                                onClick={() => setShowFullDescription(true)}
                                className="text-blue-500 p-0 outline-none ring-offset-0"
                            >
                                View More
                            </Button>
                        </div>
                    )}

                </div>
                <div className="flex items-center justify-between text-2xl">
                    <span>
                        {
                            product?.basePrice &&
                            <span
                                className={`line-through text-lg font-semibold text-gray-400`}
                            >
                                ${product?.basePrice}
                            </span>
                        }
                    </span>
                    {product?.salePrice > 0 ? (
                        <span className="font-bold text-muted-foreground">
                            ${product?.salePrice}
                        </span>
                    ) : null}
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={product?.rating} />
                    </div>
                    <span className="text-muted-foreground">
                        ({product?.rating})
                    </span>
                </div>
                <div className="mt-5 mb-5">
                    {product?.totalStock === 0 ? (
                        <Button className="w-full opacity-60 cursor-not-allowed">
                            Out of Stock
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            onClick={() =>
                                handleAddToCart(
                                    product?._id,
                                    product?.totalStock
                                )
                            }
                        >
                            Add to Cart
                        </Button>
                    )}
                </div>
                <Separator />
                <div className="max-h-[300px] overflow-auto">
                    <div className="grid gap-6">
                        {
                            product?.reviewCounts ?
                                <>
                                    <ProductReviews product={product} />
                                </>
                                :
                                <h1>No Reviews</h1>

                        }
                    </div>
                    <div className="mt-10 flex-col flex gap-2">
                        <Label>Write a review</Label>
                        <div className="flex gap-1">
                            <StarRatingComponent
                                setting={true}
                                rating={rating}
                                handleRatingChange={handleRatingChange}
                            />
                        </div>
                        <Input
                            name="reviewMsg"
                            value={reviewMsg}
                            onChange={(event) => setReviewMsg(event.target.value)}
                            placeholder="Write a review..."
                        />
                        <Button
                            onClick={handleAddReview}
                            disabled={reviewMsg.trim() === ""}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetails