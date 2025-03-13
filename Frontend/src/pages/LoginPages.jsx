import LoginNavbar from "../Componets/loginNavbar";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import facebook from "../assets/Image/facebook.png";
import google from "../assets/Image/google.png";
import apple from "../assets/Image/apple.png";
import { Link, useNavigate } from "react-router-dom";
import login from "../assets/Image/Login.png";
import axios from "axios";

const LoginPages = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://academy-gpt-backend.onrender.com/api/auth/login",
        {
          email: email,
          password: password,
        }
      );
      console.log(response.data.data);

      // Check if login is successful and response contains a token and user info
      if (response?.data?.statusCode === 200 && response?.data?.data) {
        // const { key, is_student, is_teacher } = response.data;
        const { is_student, is_teacher } = response.data.data.user;
        console.log("cehck====>", response.data);
        // Save token in localStorage or any secure place

        localStorage.setItem("token", response?.data?.data?.access);
  

        // Navigate based on user role
        if (is_student) {
          navigate("/leanernavbar");
        } else if (is_teacher) {
          navigate("/tutornavbar");
        } else {
          setError("Unknown role. Please contact support.");
        }
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <LoginNavbar />
      <div className="lg:flex mt-8 px-8 h-screen lg:h-full relative font-urbanist">
        <div className="lg:w-1/2 md:px-16 lg:px-20 md:my-auto">
          <h2 className="text-center text-4xl font-bold">LOGIN</h2>
          <p className="text-center text-black/70 text-lg">
            Login to access your account
          </p>

          <div className="py-5 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 pl-5 border-[1px] border-black rounded-lg"
            />
            <div className="relative mt-1">
              {passwordVisible ? (
                <AiOutlineEye
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                  size={20}
                />
              ) : (
                <AiOutlineEyeInvisible
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                  size={20}
                />
              )}
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 pl-5 border-[1px] border-black rounded-lg"
                placeholder="Password"
              />
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">
                  <input type="checkbox" className="mr-2" /> Remember me
                </p>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div>
                <Link>
                  <p className="text-sm text-primary font-medium">
                    Forgot Password
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <button
            className="p-2 w-full text-2xl font-bold rounded-md text-white bg-primary"
            onClick={handleLogin}
          >
            Login
          </button>
          <p className="hidden lg:block text-center text-sm py-2 font-medium">
            Don’t have an account?{" "}
            <span className="text-primary">
              <Link to="/signuppages">Sign up</Link>
            </span>
          </p>

          <div className="flex py-5">
            <hr className="w-1/2 border-t-[0.5px] h-1 border-[#313131] my-auto" />
            <p className="whitespace-nowrap text-sm px-2">Or login with</p>
            <hr className="w-1/2 border-t-[0.5px] h-1 border-[#313131] my-auto" />
          </div>

          <div className="flex space-x-3">
            <button className="p-3 w-full justify-center flex border-[1px] rounded-md border-black">
              <img
                className="w-6 my-auto"
                src={facebook}
                alt="Facebook login"
              />
            </button>
            <button className="p-3 w-full justify-center flex border-[1px] rounded-md border-black">
              <img className="w-6 my-auto" src={google} alt="Google login" />
            </button>
            <button className="p-2 w-full justify-center flex border-[1px] rounded-md border-black">
              <img className="w-6 my-auto" src={apple} alt="Apple login" />
            </button>
          </div>
        </div>
        <div className="hidden lg:flex lg:w-1/2 mx-auto lg:my-auto">
          <div className="mx-auto flex justify-center">
            <img
              className="lg:max-h-[540px] xl:min-h-full justify-center"
              src={login}
              alt="Login"
            />
          </div>
        </div>
        <div className="lg:hidden absolute place-content-center left-24 md:left-1/2 md:-translate-x-28 bottom-0">
          <p className="text-center text-sm font-medium">
            Don’t have an account?{" "}
            <span className="text-primary">
              <Link to="/signuppages">Sign up</Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPages;
