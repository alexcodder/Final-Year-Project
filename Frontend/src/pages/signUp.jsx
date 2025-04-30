import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setAuthToken } from '../utils/auth';

function SignUp() {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });

  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });

    if (name === "password") {
      // Match backend password requirements
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]).{8,}$/;
      setPasswordValid(passwordPattern.test(value));
    }

    if (name === "confirmPassword") {
      setPasswordMatch(value === registerData.password);
    }

    // Clear error when user starts typing
    setError("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate form data before submission
      if (!registerData.name.trim()) {
        setError('Name is required');
        setIsLoading(false);
        return;
      }

      if (!registerData.email.trim()) {
        setError('Email is required');
        setIsLoading(false);
        return;
      }

      if (!registerData.username.trim()) {
        setError('Username is required');
        setIsLoading(false);
        return;
      }

      if (registerData.username.length < 3 || registerData.username.length > 30) {
        setError('Username must be between 3 and 30 characters');
        setIsLoading(false);
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(registerData.username)) {
        setError('Username can only contain letters, numbers, and underscores');
        setIsLoading(false);
        return;
      }

      if (!passwordValid) {
        setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        setIsLoading(false);
        return;
      }

      if (!passwordMatch) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:3001/api/v1/auth/signup', {
        name: registerData.name.trim(),
        username: registerData.username.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
        role: registerData.role
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      if (response.data.success) {
        // Store user data
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('name', response.data.user.name);
        localStorage.setItem('email', response.data.user.email);
        
        // Set the token using the new utility function
        setAuthToken(response.data.token);
        
        // Redirect based on role
        switch (response.data.user.role) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'patient':
            navigate('/PatientHistoryForm');
            break;
          case 'ambulance':
            navigate('/ambulance-dashboard');
            break;
          case 'hospital':
            navigate('/Add-hospital');
            break;
          case 'bloodbank':
            navigate('/Add-bloodbank');
            break;
          default:
            navigate('/home');
        }
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || 'Invalid input data');
            break;
          case 409:
            setError('Username or email already exists');
            break;
          case 500:
            setError('Server error. Please try again later');
            break;
          default:
            setError(err.response.data?.message || 'Signup failed. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join our healthcare network today</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              <i className="fas fa-user"></i>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={registerData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={registerData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-at"></i>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={registerData.username}
              onChange={handleChange}
              required
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
              placeholder="Create a password"
              value={registerData.password}
              onChange={handleChange}
              required
            />
            {!passwordValid && (
              <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li className={/[a-z]/.test(registerData.password) ? "valid" : ""}>
                    At least one lowercase letter
                  </li>
                  <li className={/[A-Z]/.test(registerData.password) ? "valid" : ""}>
                    At least one uppercase letter
                  </li>
                  <li className={/\d/.test(registerData.password) ? "valid" : ""}>
                    At least one number
                  </li>
                  <li className={/[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]/.test(registerData.password) ? "valid" : ""}>
                    At least one special character
                  </li>
                  <li className={registerData.password.length >= 8 ? "valid" : ""}>
                    At least 8 characters
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-lock"></i>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={registerData.confirmPassword}
              onChange={handleChange}
              required
            />
            {!passwordMatch && (
              <div className="error-message">Passwords do not match!</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <i className="fas fa-user-tag"></i>
              Sign up as
            </label>
            <select
              id="role"
              name="role"
              value={registerData.role}
              onChange={handleChange}
              required
            >
              <option value="patient">🧑‍⚕️ Patient</option>
              <option value="ambulance">🚑 Ambulance</option>
              <option value="hospital">🏥 Hospital</option>
              <option value="bloodbank">🩸 Blood Bank</option>
            </select>
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
