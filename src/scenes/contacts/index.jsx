import { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "./ConfirmationDialog";
import { toast } from "react-toastify";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  // Gọi API để lấy danh sách user khi component được render
  useEffect(() => {
    fetchUserData();
  }, []);

  // Hàm gọi API
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user");
      setUserData(response.data); // Lưu danh sách user vào state
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Số điện thoại", flex: 1 },
    { field: "address", headerName: "Địa chỉ", flex: 1 },
    { field: "firstName", headerName: "Tên họ", flex: 1 },
    { field: "lastName", headerName: "Tên", flex: 1 },
    { field: "password", headerName: "Mật khẩu", flex: 1 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
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
  const handleDeleteButtonClick = (params) => {
    setSelectedUser(params.row);
    setConfirmationDialogOpen(true);
  };

  // Hàm xử lý khi click vào user
  const handleUserClick = (params) => {
  // Lấy thông tin người dùng được chọn từ DataGrid và lưu vào state selectedUser
  setSelectedUser(params.row);

  // Mở dialog xác nhận xóa
  //setConfirmationDialogOpen(true);
};


  // Hàm xử lý khi xác nhận xóa user
  const handleConfirmDelete = async () => {
    try {
      // Gọi API để xóa user
      console.log(selectedUser.email);
      const response = await axios.delete(
        `http://localhost:8080/user/${selectedUser.email}` 
      );
      setConfirmationDialogOpen(false);
      if (response.status === 200) toast.success("Xóa người dùng thành công!!!")
      else toast.error("Xóa người dùng thất bại!!!")
    } catch (error) {
      setConfirmationDialogOpen(false);
      toast.error("Xóa người dùng thất bại!!!")
    }
  };

  return (
    <Box m="20px">
      <Header title="CONTACTS" subtitle="List of Contacts for Future Reference" />
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
          rows={userData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onCellClick={handleUserClick}
        />
      </Box>
      {/* Hiển thị form xác nhận xóa user khi selectedUser có giá trị */}
      {selectedUser && (
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
           onConfirm={handleConfirmDelete} // Xử lý xác nhận xóa user
         />
       </>
      )}
    </Box>
  );
};

export default Contacts;
