import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import LoginNavbar from "../Componets/loginNavbar";
import facebook from "../assets/Image/facebook.png";
import google from "../assets/Image/google.png";
import apple from "../assets/Image/apple.png";
import signupImage from "../assets/Image/Signup.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

// Languages list
const initialLanguages = [
  { value: "en", label: "English", flag: "https://flagcdn.com/us.svg" },
  { value: "es", label: "Spanish", flag: "https://flagcdn.com/es.svg" },
  { value: "fr", label: "French", flag: "https://flagcdn.com/fr.svg" },
  { value: "tr", label: "Turkish", flag: "https://flagcdn.com/tr.svg" },
  { value: "ar", label: "Arabic", flag: "https://flagcdn.com/sa.svg" },
  { value: "hi", label: "Hindi", flag: "https://flagcdn.com/in.svg" },
  { value: "zh", label: "Chinese", flag: "https://flagcdn.com/cn.svg" },
];

const SignupPages = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([
    initialLanguages[0],
  ]);
  const [languages, setLanguages] = useState(initialLanguages);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleRegister = async (event) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    
    const formattedLanguages = selectedLanguages
      .map((lang) => lang.value)
      .join(",");

    try {
      const response = await axios.post(
        "https://academy-gpt-backend.onrender.com/api/auth/registration",
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password1: password,
          password2: confirmPassword,
          phone: phone,
          is_student: true,
          is_teacher: false,
          languages: formattedLanguages,
        }
      );

      if (response.status === 201) {
        navigate("/loginpage");
      }
    } catch (error) {
      setError(
        error.response?.data?.detail || "Registration failed. Please try again."
      );
      console.error("Registration error:", error);
    }
  };

  const customOption = (props) => (
    <div {...props.innerProps} className="flex items-center p-2 cursor-pointer">
      <img src={props.data.flag} alt="" className="w-5 h-5 mr-2 rounded-md" />
      <span>{props.data.label}</span>
    </div>
  );

  const handleLanguageChange = (newValue) => setSelectedLanguages(newValue);
  const handleLanguageCreate = (inputValue) => {
    const newLanguage = { value: inputValue.toLowerCase(), label: inputValue };
    setLanguages([...languages, newLanguage]);
    setSelectedLanguages([...selectedLanguages, newLanguage]);
  };

  return (
    <>
      <LoginNavbar />
      <div className="lg:flex mt-8 px-8 xl:py-5 relative font-urbanist">
        <div className="lg:w-1/2 md:px-16 lg:px-6 md:my-auto">
          <h2 className="text-center text-4xl font-bold">SIGN UP</h2>
          <p className="text-center text-black/70 text-lg">
            Create your student account.
          </p>

          <form className="py-5 space-y-4">
            <div className="lg:flex lg:space-x-3 space-y-3 lg:space-y-0">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 pl-5 border border-black rounded-lg focus:outline-primary"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 pl-5 border border-black rounded-lg focus:outline-primary"
              />
            </div>

            <div className="lg:flex lg:space-x-3 space-y-3 lg:space-y-0">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 pl-5 border border-black rounded-lg focus:outline-primary"
              />
              <PhoneInput
                country={"us"}
                value={phone}
                onChange={setPhone}
                inputStyle={{ width: "100%", border: "none" }}
                containerStyle={{
                  width: "100%",
                  height: "45px",
                  border: "1px solid #000",
                  borderRadius: ".3rem",
                }}
              />
            </div>

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
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 pl-5 border border-black rounded-lg focus:outline-primary"
                placeholder="Password"
              />
            </div>

            <div className="relative mt-1">
              {confirmPasswordVisible ? (
                <AiOutlineEye
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                  size={20}
                />
              ) : (
                <AiOutlineEyeInvisible
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                  size={20}
                />
              )}
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 pl-5 border border-black rounded-lg focus:outline-primary"
                placeholder="Confirm Password"
              />
            </div>

            <CreatableSelect
              isMulti
              className="border-[1px] w-full lg:w-72 border-black rounded-md"
              options={languages}
              value={selectedLanguages}
              onChange={handleLanguageChange}
              onCreateOption={handleLanguageCreate}
              components={{ Option: customOption }}
            />

            <p className="text-sm font-medium py-1">
              Select your preferred language(s) for lessons.
            </p>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="button"
              onClick={handleRegister}
              className="p-2 w-full text-2xl font-bold rounded-md text-white bg-primary">
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm font-medium">
            Already have an account?{" "}
            <span className="text-primary">
              <Link to="/loginpage">Login</Link>
            </span>
          </p>

          <div className="flex space-x-3 mt-1">
            <button className="p-3 w-full flex justify-center border border-black rounded-md">
              <img className="w-6" src={facebook} alt="Facebook" />
            </button>
            <button className="p-3 w-full flex justify-center border border-black rounded-md">
              <img className="w-6" src={google} alt="Google" />
            </button>
            <button className="p-3 w-full flex justify-center border border-black rounded-md">
              <img className="w-6" src={apple} alt="Apple" />
            </button>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 mx-auto lg:my-auto">
          <img
            className="lg:max-h-[540px] xl:min-h-full  mx-auto"
            src={signupImage}
            alt="Sign Up"
          />
        </div>
      </div>
    </>
  );
};

export default SignupPages;
