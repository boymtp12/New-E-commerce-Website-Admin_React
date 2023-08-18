import { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";

const Order = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [products, setProducts] = useState([]);

  // Gọi API để lấy danh sách product khi component được render
  useEffect(() => {
    fetchProductInfo();
  }, []);

  // Hàm gọi API
  const fetchProductInfo = async () => {
    try {
      // Lấy mã JWT token từ session storage
      const token = sessionStorage.getItem("token");
      if (!token) {
        // Nếu không có token, chuyển hướng đến trang login
        window.location.href = "/login";
        return;
      }

      // Gửi yêu cầu GET với mã JWT token gửi kèm trong header Authorization
      const response = await axios.get("http://localhost:8080/admin/order-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data); // Lưu danh sách product vào state
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, headerAlign: "center" },
    { field: "name", headerName: "Tên sản phẩm", flex: 1, headerAlign: "center" },
    { field: "description", headerName: "Mô tả", flex: 1, headerAlign: "center" },
    { field: "category", headerName: "Loại sản phẩm", flex: 1, headerAlign: "center" },
    { field: "price", headerName: "Giá sản phẩm", type: "number", flex: 0.5, headerAlign: "center" },
    { field: "sold_quantity", headerName: "Số lượng bán được", type: "number", flex: 1, headerAlign: "center" },
    { field: "total", headerName: "Tổng tiền", type: "number", flex: 1, headerAlign: "center" }
  ];

   // Hàm xử lý khi click vào user
   const handleUserClick = (params) => {
    // Lấy thông tin người dùng được chọn từ DataGrid và lưu vào state selectedUser
  
    // Mở dialog xác nhận xóa
    //setConfirmationDialogOpen(true);
  };

  // Hàm xử lý khi xác nhận xóa product
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
    </Box>
  );
};

export default Order;