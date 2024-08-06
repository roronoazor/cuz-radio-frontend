import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  MenuItem,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { GET_SECONDARY_STORE } from "../../config/apiUrl";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Item {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
}

interface EditItemModalProps {
  open: boolean;
  onClose: () => void;
  item: Item | null;
  page: number;
  getAccessToken: () => string | null;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  open,
  onClose,
  item,
  page,
  getAccessToken,
}) => {
  const [itemData, setItemData] = useState<Item>({
    id: 0,
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    category: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (item) {
      setItemData(item);
    }
  }, [item]);

  const editItem = async (updatedItem: Item) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("No access token found");
    }
    const response = await axios.put(
      `${GET_SECONDARY_STORE}/${updatedItem.id}`,
      updatedItem,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  };

  const editMutation = useMutation({
    mutationFn: editItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["secondaryItems", page] });
      setSnackbarMessage("Item updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    },
    onError: (error: unknown) => {
      let errorMessage = "An error occurred while updating the item";

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string | string[] }>;
        if (axiosError.response) {
          const responseMessage = axiosError.response.data?.message;
          if (Array.isArray(responseMessage)) {
            errorMessage = responseMessage.join(". ");
          } else if (typeof responseMessage === "string") {
            errorMessage = responseMessage;
          }
        } else if (axiosError.request) {
          errorMessage = "No response received from the server";
        } else {
          errorMessage = axiosError.message || errorMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editMutation.mutate(itemData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (name === "quantity" || name === "price") {
      parsedValue = Math.max(0, parseInt(value) || 0);
    }

    setItemData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Item Name"
              type="text"
              fullWidth
              value={itemData.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              value={itemData.description}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="quantity"
              label="Quantity"
              type="number"
              fullWidth
              value={itemData.quantity}
              onChange={handleInputChange}
              inputProps={{ min: 0 }}
              required
            />
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              value={itemData.price}
              onChange={handleInputChange}
              inputProps={{ min: 0 }}
              required
            />
            <TextField
              margin="dense"
              name="category"
              label="Category"
              select
              fullWidth
              value={itemData.category}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="Books">Books</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
              {/* Add more categories as needed */}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              disabled={
                editMutation.isPending ||
                !itemData.name.trim() ||
                !itemData.description.trim() ||
                itemData.quantity <= 0 ||
                itemData.price <= 0
              }
            >
              {editMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditItemModal;
