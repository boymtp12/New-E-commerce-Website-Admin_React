import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import ProductList from "./orderProductList";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";



const Order = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderForDialog, setSelectedOrderForDialog] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Gọi API để lấy danh sách product khi component được render
  useEffect(() => {
    fetchOrderInfo();
  }, []);

  // Hàm gọi API
  const fetchOrderInfo = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get("http://localhost:8080/admin/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  const handleViewProducts = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrderForDialog(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrderForDialog(null);
    setDialogOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, headerAlign: "center" },
    { field: "userEmail", headerName: "Tên khách hàng", flex: 1, headerAlign: "center" },
    { field: "shippingMethod", headerName: "Phương thức vận chuyển", flex: 1, headerAlign: "center" },
    { field: "shippingAddress", headerName: "Địa chỉ giao hàng", flex: 1, headerAlign: "center" },
    { field: "total", headerName: "Tổng đơn hàng", type: "number", flex: 0.5, headerAlign: "center" },
    { field: "orderDate", headerName: "Ngày đặt hàng", type: "date", flex: 1, headerAlign: "center" },
    { field: "orderStatus", headerName: "Tình trạng đơn hàng", flex: 1, headerAlign: "center" },
    {
      field: "viewMore",
      headerName: "",
      flex: 0.5,
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
          <Button
            sx={{
              cursor: "pointer",
              color: colors.redAccent[100],
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={() => handleOpenDialog(row)} // Sử dụng onClick để mở dialog
          >
            Xem thêm
          </Button>
        </Box>
      ),
    },
  ];

  const handleViewMoreClick = (row) => {
    setSelectedOrder(row); // Lưu thông tin đơn hàng được chọn vào state
    
  };

  return (
    <Box m="20px">
      <Header title="ĐƠN HÀNG" subtitle="Danh sách đơn hàng" />
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
          rows={orders}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          isRowExpandable={(params) => params.row.productList.length >= 0}
          detailPanel={[
            {
              // render: renderExpandedDetails,
              // openIcon: <ExpandMoreIcon />,
              // closeIcon: <ExpandLessIcon />,
            },
          ]}
        />

      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết đơn hàng #{selectedOrderForDialog?.id}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedOrderForDialog && (
            <ProductList productList={selectedOrderForDialog.productList} />
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default Order;
