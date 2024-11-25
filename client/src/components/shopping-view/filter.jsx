import { filterOptions } from "@/config";
import { useEffect } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import CategoriesFilters from "./CategoriesFilters";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "@/store/shop/category-slice";

function ProductFilter({ filters, handleFilter }) {

  const dispatch = useDispatch();

  const { categoryList = [], isLoading: isLoadingCategories } = useSelector((state) => state.shopCategories);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">

        <CategoriesFilters filters={filters} handleFilter={handleFilter} categoryList={categoryList} isLoadingCategories={isLoadingCategories} />

        {Object.keys(filterOptions).map((keyItem, index) => (
          <div key={index} >
            <h3 className="text-base font-bold capitalize">{keyItem}</h3>
            <div className="grid gap-2 mt-2 mb-3">
              {filterOptions[keyItem].map((option, i) => (
                <div key={i}>
                  <Label className="flex font-medium items-center gap-2 ">
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
