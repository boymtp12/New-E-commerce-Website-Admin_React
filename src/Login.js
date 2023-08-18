import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();

  async function handleLogin(ev) {
    ev.preventDefault();

    const authDetail = {
      email: email.current.value,
      password: password.current.value,
    };

    console.log(authDetail)

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authDetail),
    };

    try {
      const response = await fetch("http://localhost:8080/admin/login", requestOptions);

      console.log(response)
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
    <main>
      <section>
        <p className="text-center text-2xl font-semibold dark:text-slate-100 my-10  underline underline-offset-8">
          Đăng nhập
        </p>
      </section>
      <form onSubmit={handleLogin}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm dont-medium text-gray-900 dark:text-slate-100"
          >
            Email
          </label>
          <input
            ref={email}
            id="email"
            placeholder="Enter Your Email"
            type="email"
            required
            autoComplete="off"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm dont-medium text-gray-900 dark:text-slate-100"
          >
            Mật khẩu
          </label>
          <input
            ref={password}
            id="password"
            placeholder="Enter Your Password"
            type="password"
            required
            autoComplete="off"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button className="border px-5 py-2.5 bg-blue-700 text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ">
          {" "}
          Đăng nhập
        </button>
      </form>
    </main>
  );
};

export default Login;
