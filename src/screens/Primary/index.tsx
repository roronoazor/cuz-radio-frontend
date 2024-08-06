import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import CreateItemModal from "./CreateItemModal";
import EditItemModal from "./EditItemModal";
import { GET_PRIMARY_STORE } from "../../config/apiUrl";

interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: number;
  category: string;
  createdBy: {
    username: string;
    role: string;
  };
}

const ItemList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const queryClient = useQueryClient();

  const getAccessToken = () => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const { access_token } = JSON.parse(userData);
      return access_token;
    }
    return null;
  };

  const fetchItems = async (page: number) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("No access token found");
    }
    const response = await axios.get(`${GET_PRIMARY_STORE}?page=${page}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  };

  const { data, isPending, error } = useQuery({
    queryKey: ["items", page],
    queryFn: () => fetchItems(page),
  });

  const deleteItem = async (id: number) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("No access token found");
    }
    await axios.delete(`${GET_PRIMARY_STORE}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", page] });
      setDeleteDialogOpen(false);
    },
  });

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const handleEditClick = (item: Item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (item: Item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.id);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  if (isPending) return <Typography>Loading...</Typography>;
  if (error)
    return (
      <Typography>An error occurred: {(error as Error).message}</Typography>
    );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">
          Primary Items (Only Admins, Primary Users will be able to use this
          page fully)
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Create Item
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S/N</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((item: Item, index: number) => (
              <TableRow key={item.id}>
                <TableCell>
                  {(page - 1) * data.pagination.itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.createdBy.username}</TableCell>
                <TableCell>{item.createdBy.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(item)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={data.pagination.totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <CreateItemModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        page={page}
        getAccessToken={getAccessToken}
      />

      <EditItemModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedItem}
        page={page}
        getAccessToken={getAccessToken}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItemList;
