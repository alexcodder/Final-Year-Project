import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  // State to manage login data
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // State to manage login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // useNavigate hook to programmatically navigate
  const navigate = useNavigate();

  // Function to handle input changes
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
      // Sending login data to the server
      const response = await axios.post("http://localhost:3001/api/v1/auth/login", loginData, {
        headers: { "Content-Type": "application/json" },
      });

      // Storing user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);

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
    } catch (error) {
      console.error("Login Error:", error); // Debugging line
      alert("Invalid Username or password");
    }
  }

  return (
    <div className="Login-Form">
      <form className="Login" onSubmit={handleSubmit}>
        <h1>Log In</h1>

        <div className="Login__Field">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your Username" required onChange={handleChange}/>
        </div>

        <div className="Login__Field">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required onChange={handleChange} />
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
