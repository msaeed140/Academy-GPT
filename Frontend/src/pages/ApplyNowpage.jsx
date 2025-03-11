import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import LoginNavbar from "../Componets/loginNavbar";
import Applynow from "../assets/Image/Applynow.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";

// Languages list
const initialLanguages = [
  { value: "en", label: "English", flag: "https://flagcdn.com/us.svg" },
  { value: "es", label: "Spanish", flag: "https://flagcdn.com/es.svg" },
  { value: "fr", label: "French", flag: "https://flagcdn.com/fr.svg" },
];

const ApplyNowPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showNumberCode, setShowNumberCode] = useState(false);
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

    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[A-Z]/.test(password)
    ) {
      setError(
        "Password must be at least 8 characters, including a number and an uppercase letter."
      );
      return;
    }

    const formattedLanguages = selectedLanguages
      .map((lang) => lang.value)
      .join(", ");

    try {
      const response = await axios.post(
        "https://academy-gpt-backend.onrender.com/api/auth/registration",
        {
          email: email,
          password1: password,
          password2: confirmPassword,
          first_name: firstName,
          last_name: lastName,
          phone: `${phone}`,
          is_student: false,
          is_teacher: true,
          languages: formattedLanguages,
        }
      );

      if (response.status === 201) {
        setShowNumberCode(true);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data); // Backend response
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
        setError(
          error.response.data.detail ||
            "Server error occurred. Please try again."
        );
      } else if (error.request) {
        console.error("Request error:", error.request);
        setError("No response from server. Please check your connection.");
      } else {
        console.error("Error", error.message);
        setError("Registration failed. Please try again.");
      }
    }
  };

  const customOption = (props) => (
    <div
      {...props.innerProps}
      className="flex items-center my-auto p-2 cursor-pointer "
    >
      <img
        src={props.data.flag}
        alt="flag"
        className="w-5 h-5 mr-2 rounded-md"
      />
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
          <h2 className="text-center text-4xl xl:text-3xl font-bold">
            Apply Now
          </h2>
          <p className="text-center text-black/70 text-lg font-medium xl:text-2xl">
            To be listed on simex
          </p>

          <form className="py-5 space-y-4" onSubmit={handleRegister}>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full p-2 pl-5 border border-black rounded-lg focus:outline-primary"
              autoComplete="given-name"
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full p-2 pl-5 border border-black rounded-lg focus:outline-primary"
              autoComplete="family-name"
            />

            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 pl-5 border border-black rounded-lg focus:outline-primary"
              autoComplete="email"
            />

            <div className="relative mt-1">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 pl-5 border border-black rounded-lg focus:outline-primary"
                placeholder="Create Password"
                autoComplete="new-password"
              />
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
            </div>

            <div className="relative mt-1">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 pl-5 border border-black rounded-lg focus:outline-primary"
                placeholder="Confirm Password"
                autoComplete="new-password"
              />
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
            </div>

            <PhoneInput
              country="us"
              value={phone}
              onChange={setPhone}
              inputProps={{
                id: "phone",
                name: "phone",
                autoComplete: "tel-national",
              }}
              inputStyle={{
                width: "100%",
                border: "none",
              }}
              containerStyle={{
                width: "100%",
                height: "45px",
                border: "1px solid #000",
                borderRadius: ".3rem",
              }}
            />

            <div className="relative">
              <CreatableSelect
                isMulti
                className="border-[1px] w-72 lg:w-60 xl:w-72 border-black rounded-md"
                options={languages}
                value={selectedLanguages}
                onChange={handleLanguageChange}
                onCreateOption={handleLanguageCreate}
                components={{
                  Option: customOption,
                }}
              />
              <p className="text-sm font-medium py-1">
                Select your preferred{" "}
                <span className="text-primary">language</span> for lessons.
              </p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-center">
              <button
                type="submit"
                onClick={handleRegister}
                className="p-2 w-full lg:w-72 flex justify-center text-2xl font-bold rounded-md text-white bg-primary"
              >
                Next <IoIosArrowForward className="my-auto ml-3" />
              </button>
            </div>
          </form>

          <p className="hidden lg:block text-center text-sm font-medium">
            Already have an account?{" "}
            <span className="text-primary">
              <Link to="/loginpage">Login</Link>
            </span>
          </p>
        </div>

        <div className="hidden lg:flex lg:w-1/2 mx-auto lg:my-auto">
          <div className="mx-auto flex justify-center">
            <img
              className="lg:max-h-[560px] xl:min-h-full"
              src={Applynow}
              alt="Sign Up"
            />
          </div>
        </div>
      </div>

      {showNumberCode && (
        <div className="fixed top-0 left-0 w-full h-full font-urbanist px-10 bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 space-y-3 shadow-xl px-7 lg:w-5/12 xl:w-2/6">
            <h2 className="font-semibold text-center whitespace-nowrap text-2xl xl:text-[26px]">
              Enter Verification
              <br />
              Code Just Sent To Phone No
              <br />
              Address
            </h2>
            <input
              className="w-full p-2 pl-5 xl:p-3 border border-black rounded-lg focus:outline-primary"
              name="code"
              id="code"
              placeholder="Enter Verification code"
            />
            <div className="space-y-2">
              <button className="p-2 w-full flex justify-center text-lg xl:text-xl font-medium">
                Resend Code
              </button>
              <button
                onClick={() => navigate("/tutornavbar")}
                className="p-2 w-full flex justify-center text-xl xl:text-2xl font-bold rounded-md text-white bg-primary"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplyNowPage;
