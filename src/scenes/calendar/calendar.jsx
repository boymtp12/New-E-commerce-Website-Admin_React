import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import MenuCategory from "../product/MenuCategory";
import { toast } from "react-toastify";

const allowedImageFormats = ["image/jpeg", "image/png"];

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    description: "",
    categoryName: "",
    price: "",
    quantityStock: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const options = {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit2
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(formData), // body data type must match "Content-Type" header
    };
    fetch(`http://localhost:8080/product`, options)
      .then((response) => response.json())
      .then((rs) => {
        toast.success("Add product successfull");
      })
      .catch((err) => {
        toast.error("Add product false");
      });

  };

  const [categoryOptions, setCategoryOptions] = React.useState([]);

  React.useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/category");
      setCategoryOptions(response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  return (
    <Box m="20px">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Header title="SẢN PHẨM" subtitle="Thêm mới sản phẩm" />

        <MenuCategory />
      </Box>
      {successMessage && (
        <Typography variant="body1" color="success">
          {successMessage}
        </Typography>
      )}
      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}

      <br></br>

      <form onSubmit={(e) => handleSubmit(e)}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            fullWidth
            variant="filled"
            select
            label="Loại sản phẩm"
            onChange={(e) =>
              setFormData({ ...formData, categoryName: e.target.value })
            }
            value={formData.categoryName}
            name="categoryName"
            sx={{ gridColumn: "span 2" }}
            SelectProps={{
              native: true,
            }}
          >
            <option value={null}>Chọn loại sản phẩm</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            variant="filled"
            type="number"
            label="Giá cả"
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            value={formData.price}
            name="price"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Tên sản phẩm"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
            name="name"
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Mô tả sản phẩm"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            value={formData.description}
            name="description"
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="number"
            label="Số lượng tồn kho"
            onChange={(e) =>
              setFormData({ ...formData, quantityStock: e.target.value })
            }
            value={formData.quantityStock}
            name="quantityStock"
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="file"
            accept=".jpeg, .jpg, .png"
            label=""
            onChange={(event) => {
              const selectedFile = event.currentTarget.files[0];
              if (
                selectedFile &&
                allowedImageFormats.includes(selectedFile.type)
              ) {
                setFormData({ ...formData, image: selectedFile });
                // setFieldValue("image", selectedFile);
                setErrorMessage(""); // Reset thông báo lỗi nếu tải lên đúng định dạng
              } else {
                setFormData({ ...formData, image: null });
                // setFieldValue("image", null);
                event.currentTarget.value = "";
                setErrorMessage(
                  "Không đúng định dạng file yêu cầu. Vui lòng tải lên định dạng JPEG hoặc PNG"
                );
              }
            }}
            name="image"
            sx={{ gridColumn: "span 4" }}
          />
          <Typography color="error">{errorMessage}</Typography>{" "}
          {/* Hiển thị thông báo lỗi */}
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Tạo mới sản phẩm
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Form;
