import React, { useEffect, useState } from 'react'
import { getFeatureImages } from "@/store/common-slice";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts } from '@/store/shop/products-slice';
import { Button } from './ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const HomeSlider = () => {

    const [currentSlide, setCurrentSlide] = useState(0);

    const { featureImageList } = useSelector((state) => state.commonFeature);

    console.log('featureImageList:', featureImageList)

    const dispatch = useDispatch();


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [featureImageList]);

    useEffect(() => {
        dispatch(
            fetchAllFilteredProducts({
                filterParams: {},
                sortParams: "price-lowtohigh",
            })
        );
    }, [dispatch]);

    useEffect(() => {
        dispatch(getFeatureImages());
    }, [dispatch]);

    return (
        <div>
            {featureImageList && featureImageList.length > 0
                ? featureImageList.map((slide, index) => (
                    <img
                        src={slide?.image}
                        key={index}
                        className={`${index === currentSlide ? "opacity-100" : "opacity-0"
                            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                    />
                ))
                : null}
            <Button
                variant="outline"
                size="icon"
                onClick={() =>
                    setCurrentSlide(
                        (prevSlide) =>
                            (prevSlide - 1 + featureImageList.length) %
                            featureImageList.length
                    )
                }
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
            >
                <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() =>
                    setCurrentSlide(
                        (prevSlide) => (prevSlide + 1) % featureImageList.length
                    )
                }
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
            >
                <ChevronRightIcon className="w-4 h-4" />
            </Button>
        </div>
    )
}

export default HomeSlider