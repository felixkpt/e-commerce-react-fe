import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

const CategoriesFilters = ({ filters, handleFilter, categoryList, isLoadingCategories }) => {

    const keyItem = "category";

    return (
        <div className="mb-4">
            <h3 className="text-base font-bold capitalize">Category</h3>
            {isLoadingCategories ? (
                <p>Loading categories...</p> // Show loading indicator
            ) : (
                <div className="grid gap-2 mt-2 mb-4">
                    {categoryList?.map((option, i) => (
                        <div key={i}>
                            <Label className="flex font-medium items-center gap-2">
                                <Checkbox
                                    checked={
                                        filters?.[keyItem]?.includes(option._id) // Simplified check
                                    }
                                    onCheckedChange={() => handleFilter(keyItem, option._id)}
                                />
                                {option.name}
                            </Label>
                        </div>
                    ))}
                </div>
            )}
            <Separator />
        </div>
    );
};

export default CategoriesFilters;
