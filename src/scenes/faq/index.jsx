import { useState, useEffect } from "react";
import { Box, Button, TextField, MenuItem, Typography } from "@mui/material"; // Import components from @mui/material
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
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

  const handleFormSubmit = async (values) => {
    try {
      console.log(values);
      const response = await axios.post("http://localhost:8080/user", values);
      if (response.status === 200) {
        setSuccessMessage("Thêm mới khuyến mãi thành công");
        setErrorMessage(""); // Clear any previous error message
        // Perform any other actions after successful API call
      } else {
        setSuccessMessage("");
        setErrorMessage("Thêm mới khuyến mãi thất bại");
      }

    } catch (error) {
      console.error(error);
      // Handle errors if the API call fails
    }
  };

  return (
    <Box m="20px">
      <Header title="KHUYẾN MÃI" subtitle="Tạo mới khuyến mãi" />

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
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
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
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Giảm giá"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.discount}
                name="discount"
                error={!!touched.discount && !!errors.discount}
                helperText={touched.discount && errors.discount}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Tên chương trình khuyến mãi"
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
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </TextField>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Thêm mới khuyến mãi
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address: yup.string().required("required"),
});

const initialValues = {
  id: "1",
  name: "",
  description: "",
  categoryName: "",
  discount: "",
  startDate: null,
  endDate: null,
};

export default Form;
