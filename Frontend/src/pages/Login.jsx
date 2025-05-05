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
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!loginData.username) {
      newErrors.username = "Username is required";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    }

    return Object.keys(newErrors).length === 0;
  };

  // Function to handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when user starts typing
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
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

      if (response.data.success) {
        // If user is a patient, check for patient history
        if (response.data.user.role === "patient") {
          // Store user data first
          localStorage.setItem("userId", response.data.user.id);
          localStorage.setItem("role", response.data.user.role);
          localStorage.setItem("username", response.data.user.username);
          localStorage.setItem("token", response.data.token);

          // Set default axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          axios.defaults.withCredentials = true;

          try {
            const historyResponse = await axios.get(
              "http://localhost:3001/api/v1/patient-history/history",
              {
                headers: {
                  'Authorization': `Bearer ${response.data.token}`,
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              }
            );
            
            // If history exists and is successful, proceed to home
            if (historyResponse.data.success && historyResponse.data.data) {
              navigate("/home");
              return;
            }
          } catch (error) {
            // Check if it's a 404 error (no history found)
            if (error.response?.status === 404) {
              navigate("/patienthistoryform");
              return;
            }
            // For other errors, show error message
            console.error("History check error:", error);
            navigate("/patienthistoryform");
            setError("Error checking patient history. No Patient history found.");
            return;
          }
        } else {
          // For non-patient users, store data and redirect
          localStorage.setItem("userId", response.data.user.id);
          localStorage.setItem("role", response.data.user.role);
          localStorage.setItem("username", response.data.user.username);
          localStorage.setItem("token", response.data.token);

          // Set default axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          axios.defaults.withCredentials = true;

          // Redirect based on role
          switch (response.data.user.role) {
            case "admin":
              navigate("/admin-dashboard");
              break;
            case "ambulance":
              navigate("/ambulance-dashboard");
              break;
            case "hospital":
              navigate("/hospital-dashboard");
              break;
            case "bloodbank":
              navigate("/bloodbank-dashboard");
              break;
            default:
              navigate("/home");
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific error cases
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Invalid username or password");
            break;
          case 404:
            setError("User not found");
            break;
          case 500:
            setError("Server error. Please try again later");
            break;
          default:
            setError(error.response.data.message || "Login failed. Please try again");
        }
      } else {
        setError("Network error. Please check your connection");
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

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

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
