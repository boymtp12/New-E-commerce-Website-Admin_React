import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { toast } from "react-toastify";

const defaultTheme = createTheme();

export default function Login2() {
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();

  async function handleSubmit(ev) {
    ev.preventDefault();

    const data = new FormData(ev.currentTarget);

    const authDetail = {
      email: data.get("email"),
      password: data.get("password"),
    };
    console.log(authDetail);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authDetail),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/admin/login",
        requestOptions
      );
      if (response.status === 200) {
        const data = await response.json();
        const accessToken = data.accessToken;
        //console.log(accessToken)

        // Lưu trữ JWT token vào session storage
        sessionStorage.setItem("token", JSON.stringify(accessToken));

        // Chuyển hướng đến trang chủ
        navigate("/");
      } else if (response.status === 400) {
        // Xử lý trường hợp đăng nhập thất bại
        const data = await response.json();
        toast.error(data.message);
      } else {
        // Xử lý trường hợp lỗi không xác định
        toast.error("An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again later.");
    }
  }

  return (
    // <ThemeProvider theme={defaultTheme}>
    <Container component="main" maxWidth="xs">
      {/* <CssBaseline /> */}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            ref={email}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            color="secondary"
          />
          <TextField
            ref={password}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            color="secondary"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, background: "#3e4396" }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    // </ThemeProvider>
  );
}
