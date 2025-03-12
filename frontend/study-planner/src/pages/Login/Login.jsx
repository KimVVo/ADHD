import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // Login API call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      // Handle successful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        // Redirect to home page
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <Navbar showSearchBar={false} />
      <div className="flex">
        <div className="flex justify-center items-center mt-28 w-full">
          <div className="w-96 border bg-white py-10 rounded px-7">
            <form onSubmit={handleLogin}>
              <h4 className="text-2xl mb-7">Login</h4>

              <input
                type="text"
                className="input-box"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
              <button type="submit" className="btn-primary">
                Login
              </button>

              <p className="text-sm text-center mt-4">
                Not registered yet?{" "}
                <Link
                  to="/signUp"
                  className="font-medium text-primary text-blue-600 underline"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <p className="text-center font-bold text-4xl fixed bottom-10 w-full">
        &quot;Stay organized, stay motivated, and make studying work for
        YOU.&quot;
      </p>
    </>
  );
};

export default Login;
