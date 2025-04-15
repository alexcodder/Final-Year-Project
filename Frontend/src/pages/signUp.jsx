import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      setPasswordValid(passwordPattern.test(value));
    }

    if (name === "confirmPassword") {
      setPasswordMatch(value === registerData.password);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/v1/auth/signup", registerData);
      console.log("Signup Success:", response.data);

      switch (registerData.role) {
        case "ambulance":
          navigate("/dashboard/ambulance");
          break;
        case "hospital":
          navigate("/dashboard/hospital");
          break;
        case "bloodbank":
          navigate("/dashboard/bloodbank");
          break;
        case "patient":
        default:
          navigate("/PatientForm");
          break;
      }
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join our healthcare network today</p>
        </div>

        <form className="signup-form" onSubmit={handleSignUp}>
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

          {error && <div className="error-message">{error}</div>}

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
