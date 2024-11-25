import { useDispatch, useSelector } from "react-redux";
import StarRatingComponent from "../common/star-rating";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useEffect } from "react";
import { getReviews } from "@/store/shop/review-slice";

const ProductReviews = ({ product }) => {
    const dispatch = useDispatch();

    const { reviews } = useSelector((state) => state.shopReview);

    useEffect(() => {
        if (product !== null) dispatch(getReviews(product?._id));
    }, [product]);


    return (
        <>
            {reviews && reviews.length > 0 ?
                <>
                    <h2 className="text-xl font-bold mb-4">Reviews</h2>
                    {
                        reviews.map((reviewItem, i) => (
                            <div key={i} className="flex gap-4">
                                <Avatar className="w-10 h-10 border">
                                    <AvatarFallback>
                                        {reviewItem?.userName[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                                    </div>
                                    <p className="text-muted-foreground">
                                        {reviewItem.reviewMessage}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </> : null}
        </>
    )
}

export default ProductReviews