import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xóa Sản phẩm này</DialogTitle>
      <DialogContent>Bạn có chắc chắn muốn xóa Sản Phẩm này?</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={onConfirm} color="secondary" variant="contained">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
