import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useParams } from "react-router-dom";

const allowedImageFormats = ["image/jpeg", "image/png"];

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);


  const [categoryOptions, setCategoryOptions] = React.useState([]);
  React.useEffect(() => {
    fetchCategoryData();
    fetchProductData(); // Gọi hàm fetchProductData để lấy dữ liệu sản phẩm
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/category");
      setCategoryOptions(response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const [initialValues, setInitialValues] = useState({
    id: "1",
    name: "",
    description: "",
    image: "",
    categoryName: "",
    price: "",
    quantityStock: "",
    role: "",
  });

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/product/${productId}`);
      console.log(response.data)
      setInitialValues({
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description,
        image: "", // Để trống vì bạn không muốn hiển thị hình ảnh ban đầu
        categoryName: response.data.categoryName,
        price: response.data.price.toString(),
        quantityStock: response.data.quantityStock.toString(),
        role: "", // Để trống vì không có dữ liệu về role từ response
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setIsLoading(false);
    }
  };

  // Xử lý khi người dùng nhấn nút Cập nhật
  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("categoryName", values.categoryName);
      formData.append("price", values.price);
      formData.append("quantityStock", values.quantityStock);

      console.log(values.image)

      const response = await axios.put(`http://localhost:8080/admin/product/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setSuccessMessage("Cập nhật sản phẩm thành công");
        setErrorMessage("");
      } else {
        setSuccessMessage("");
        setErrorMessage("Cập nhật sản phẩm thất bại");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box m="20px">
      <Header title="SẢN PHẨM" subtitle="Cập nhật sản phẩm" />

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

      <Formik
        enableReinitialize
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={productSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue, // Thêm hàm này để set giá trị của trường image
        }) => (
          <form onSubmit={handleSubmit}>
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
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.categoryName}
                name="categoryName"
                error={!!touched.categoryName && !!errors.categoryName}
                helperText={touched.categoryName && errors.categoryName}
                sx={{ gridColumn: "span 2" }}
                SelectProps={{
                  native: true,
                }}
              >
                <option value={null}>Chọn loại sản phẩm</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Giá cả"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Tên sản phẩm"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Mô tả sản phẩm"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Số lượng tồn kho"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.quantityStock}
                name="quantityStock"
                error={!!touched.quantityStock && !!errors.quantityStock}
                helperText={touched.quantityStock && errors.quantityStock}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="file"
                accept=".jpeg, .jpg, .png"
                label=""
                onBlur={handleBlur}
                onChange={(event) => {
                  const selectedFile = event.currentTarget.files[0];
                  if (selectedFile && allowedImageFormats.includes(selectedFile.type)) {
                    setFieldValue("image", selectedFile);
                    setErrorMessage(""); // Reset thông báo lỗi nếu tải lên đúng định dạng
                  } else {
                    setFieldValue("image", null);
                    event.currentTarget.value = "";
                    setErrorMessage("Không đúng định dạng file yêu cầu. Vui lòng tải lên định dạng JPEG hoặc PNG");
                  }
                }}
                name="image"
                error={!!touched.image && !!errors.image}
                helperText={touched.image && errors.image}
                sx={{ gridColumn: "span 4" }}
              />
              <Typography color="error">{errorMessage}</Typography> {/* Hiển thị thông báo lỗi */}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Cập nhật thông tin sản phẩm
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};


const productSchema = yup.object().shape({
  name: yup.string().required("Không được bỏ trống"),
  description: yup.string().required("Không được bỏ trống"),
  price: yup
    .number()
    .typeError("Giá sản phẩm phải luôn lớn hơn 0")
    .min(1, "Giá sản phẩm luôn dương")
    .max(9999999999, "Giá sản phẩm không quá 10 chữ số")
    .required("Không được bỏ trống"),
  quantityStock: yup
    .number()
    .typeError("Số lượng tồn kho phải là một số")
    .positive("Số lượng tồn kho phải luôn dương")
    .integer("Số lượng tồn kho phải là một số nguyên")
    .required("Không được bỏ trống"),
  categoryName: yup.string().nullable().required("Vui lòng phân loại cho sản phẩm"), // Sử dụng phương thức nullable()
});

export default Form;
