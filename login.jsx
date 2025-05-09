import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt from "jsonwebtoken";

function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/auth/login",
        loginData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Storing user data in localStorage
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("role", response.data.role);

      const tokenData = {
        userId: user._id,
      };
      const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });

      setIsLoggedIn(true);

      // Redirecting based on the user role
      switch (response.data.role) {
        case "admin":
          await navigate("/admin");
          break;
        case "patient":
          await navigate("/Home");
          break;
        case "ambulance":
          await navigate("/ambulance-dashboard");
          break;
        case "hospital":
          await navigate("/hospital-dashboard");
          break;
        case "bloodbank":
          await navigate("/bloodbank-dashboard");
          break;
        default:
          await navigate("/home");
          break;
      }
      return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
        message: `Welcome back ${user.fullname}`,
        user,
        token, // Send the token in the response body
        success: true
    });
    } catch (error) {
      alert("Invalid Username or password");
      console.log(error);
      return res.status(500).json({
          message: "Internal server error.",
          success: false
      });
    }
  }

  return (
    <div className="Login-Form">
      <form className="Login" onSubmit={handleSubmit}>
        <h1>Log In</h1>

        <div className="Login__Field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your Username"
            required
            onChange={handleChange}
          />
        </div>

        <div className="Login__Field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            onChange={handleChange}
          />
        </div>

        <div className="Login__Button">
          <button type="submit">Log In</button>
        </div>

        <div className="Login__Footer">
          <p>
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
