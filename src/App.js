import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Total from "./scenes/order/total";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Order from "./scenes/order/order";
import Login from "./Login";
import UpdateProduct from "./scenes/product/updateProduct";
import CategoryProduct from "./scenes/category/Category";
import { isTokenExpired } from "./ValidJWT";
import { toast } from "react-toastify";
import Categories from "./scenes/categories";
import Login2 from "./Login2";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    // Kiểm tra ngày hết hạn của token khi thành phần được tạo và mỗi khi token thay đổi
    if (token) {
      if (isTokenExpired(token)) {
        // Thực hiện hành động đăng xuất (ví dụ, xóa token khỏi lưu trữ, đặt lại trạng thái người dùng)
        // Ví dụ, nếu bạn lưu trữ token trong sessionStorage:
        sessionStorage.removeItem("token");
        toast.success(
          "Phiên đăng nhập của bạn đã hết hạn! Vui lòng đăng nhập lại!!!"
        );

        // Chuyển hướng người dùng đến trang đăng nhập hoặc trang thông báo họ đã bị đăng xuất
        setTimeout(() => {
          const currentPathname = window.location.pathname;
          if (currentPathname !== "/login") {
            window.location.href = "/login";
          }
        }, 2000);
      }
    } else {
      const currentPathname = window.location.pathname;
      if (currentPathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }, [token]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin/product" element={<Team />} />
              <Route path="/admin/user" element={<Contacts />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/admin/add-product" element={<Calendar />} />
              <Route
                path="/admin/add-category-product"
                element={<CategoryProduct />}
              />
              <Route
                path="/admin/update-product/:productId"
                element={<UpdateProduct />}
              />
              <Route path="/admin/order" element={<Order />} />
              <Route path="/admin/total" element={<Total />} />
              <Route path="/login" element={<Login2 />} />
              <Route path="/admin/category" element={<Categories />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
