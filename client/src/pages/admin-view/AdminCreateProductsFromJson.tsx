import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { uploadProductsFromJSON } from "@/store/admin/products-slice";
import { useDispatch } from "react-redux";
import { useState } from "react";

type Props = {
  setCreatedKey: React.Dispatch<React.SetStateAction<number>>;
};

function AdminCreateProducts({ setCreatedKey }: Props) {
  const [jsonInput, setJsonInput] = useState(""); // State for the JSON input
  const [loading, setLoading] = useState(false); // State for loading
  const dispatch = useDispatch();
  const { toast } = useToast();

  async function handleSaveFromJson() {
    const products = JSON.parse(jsonInput); // Parse the pasted JSON

    try {
      setLoading(true); // Start loading

      const response = await dispatch(uploadProductsFromJSON({ products }));
      console.log("response::", response);

      if (response.payload?.success) {
        toast({
          title: "Products added successfully from JSON!",
        });
        setCreatedKey((curr) => curr + 1);
      } else {
        toast({
          title: "Failed to add products",
          description: (response.payload?.message || response.error?.message) || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error while saving prods",
        description: `Error: ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="w-full h-40 p-3 border rounded-md"
        placeholder="Paste your JSON here..."
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      ></textarea>
      <Button onClick={handleSaveFromJson} disabled={loading}>
        {loading ? (
          <span className="animate-spin">🔄</span> // Tailwind spinner icon
        ) : (
          "Save Products from JSON"
        )}
      </Button>
    </div>
  );
}

export default AdminCreateProducts;
