import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  // State to manage login data
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // State to manage login status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // useNavigate hook to programmatically navigate
  const navigate = useNavigate();

  // Function to handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { ...loginData, password: "[REDACTED]" });
      
      const response = await axios.post(
        "http://localhost:3001/api/v1/auth/login",
        loginData,
        {
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          withCredentials: true
        }
      );

      console.log("Login response:", response.data);

      if (response.data.success) {
        // Store user data from the correct format in the response
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("username", response.data.user.username);

        console.log("User data stored, redirecting...");

        // Redirect based on role
        switch (response.data.user.role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "patient":
            navigate("/home");
            break;
          case "ambulance":
          case "hospital":
          case "bloodbank":
            navigate("/admin-dashboard"); // Send non-patient users to dashboard
            break;
          default:
            navigate("/home");
            break;
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data.message || "Login failed. Please check your credentials.");
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={loginData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading || !loginData.username || !loginData.password}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
