import { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "./ConfirmationDialog";

const Product = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  // Gọi API để lấy danh sách product khi component được render
  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm gọi API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/promotion");
      setProducts(response.data); // Lưu danh sách product vào state
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, headerAlign: "center" },
    { field: "name", headerName: "Name", flex: 1, headerAlign: "center" },
    { field: "description", headerName: "Description", flex: 1, headerAlign: "center" },
    { field: "categoryName", headerName: "Category Name", flex: 1, headerAlign: "center" },
    { field: "discount", headerName: "Discount", type: "number", flex: 0.5, headerAlign: "center" },
    { field: "startDate", headerName: "Start Date", type: "date", flex: 1, headerAlign: "center" },
    { field: "endDate", headerName: "End Date", type: "date", flex: 1, headerAlign: "center" },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
          <DeleteIcon
            sx={{ cursor: "pointer", color: colors.redAccent[700] }}
            onClick={() => handleDeleteButtonClick(row)}
          />
        </Box>
      ),
    },
  ];

  // Hàm xử lý khi click vào nút Delete
  const handleDeleteButtonClick = (product) => {
    setSelectedProduct(product);
    setConfirmationDialogOpen(true);
  };

   // Hàm xử lý khi click vào user
   const handleUserClick = (params) => {
    // Lấy thông tin người dùng được chọn từ DataGrid và lưu vào state selectedUser
    setSelectedProduct(params.row);
  
    // Mở dialog xác nhận xóa
    //setConfirmationDialogOpen(true);
  };

  // Hàm xử lý khi xác nhận xóa product
  const handleConfirmDelete = async () => {
    try {
      // Gọi API để xóa product
      await axios.delete(`http://localhost:8080/promotion/${selectedProduct.id}`);
      console.log("Xóa product thành công:", selectedProduct);

      // Cập nhật lại danh sách product sau khi xóa thành công
      const updatedProducts = products.filter(
        (product) => product.id !== selectedProduct.id
      );
      setProducts(updatedProducts);

      // Đóng dialog xác nhận xóa
      setConfirmationDialogOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="PRODUCTS" subtitle="List of Products for Sale" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={products}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onCellClick={handleUserClick}
        />
      </Box>
      {/* Hiển thị form xác nhận xóa product khi selectedProduct có giá trị */}
      {selectedProduct && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={() => setConfirmationDialogOpen(true)} // Xử lý sự kiện click vào nút Delete
          >
            Delete
          </Button>
          {/* Hiển thị ConfirmationDialog */}
          <ConfirmationDialog
            open={isConfirmationDialogOpen}
            onClose={() => setConfirmationDialogOpen(false)}
            onConfirm={handleConfirmDelete} // Xử lý xác nhận xóa product
          />
        </>
      )}
    </Box>
  );
};

export default Product;
