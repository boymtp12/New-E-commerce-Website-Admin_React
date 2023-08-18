import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleFormSubmit = async (values) => {
    try {
      if (values.name !== values.confirmName) {
        alert("Tên loại sản phẩm và xác nhận tên không khớp nhau");
        return;
      }

      const token = sessionStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const data = {
        name: values.name,
        confirmName: values.confirmName,
      };

      const response = await axios.post(
        "http://localhost:8080/admin/add-new-category",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Thêm mới loại sản phẩm thành công");
        setErrorMessage(""); // Clear any previous error message
        // Perform any other actions after successful API call
      } else {
        setSuccessMessage("");
        setErrorMessage("Thêm mới loại sản phẩm thất bại");
      }

    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau!!!");
    }
  };

  return (
    <Box m="20px">
      <Header title="LOẠI SẢN PHẨM" subtitle="Thêm mới loại sản phẩm" />
      <Formik
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Tên loại sản phẩm"
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
                label="Xác nhận tên loại sản phẩm"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmName}
                name="confirmName"
                error={!!touched.confirmName && !!errors.confirmName}
                helperText={touched.confirmName && errors.confirmName}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Thêm mới loại sản phẩm
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};


const productSchema = yup.object().shape({
  confirmName: yup
    .string()
    .required("Không được bỏ trống")
    .oneOf([yup.ref("name")], "Tên loại sản phẩm không khớp"),
});

const initialValues = {
  name: "",
  confirmName: "",
};

export default Form;
