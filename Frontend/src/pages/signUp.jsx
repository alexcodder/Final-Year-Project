import "../stylesheet/Style.scss";
import "../stylesheet/Signup.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match!");
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
      console.error("Signup Error:", error);
      alert("Signup failed. Please try again.");
    }
  }
  
  return (
    <div className="SignUp-Form">
      <form className="Signup" onSubmit={handleSignUp}>
        <h1>Create Your Account</h1>

        <div className="Signup__Field">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="Enter your full name" required onChange={handleChange} />
        </div>

        <div className="Signup__Field">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required onChange={handleChange} />
        </div>

        <div className="Signup__Field">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" placeholder="Enter Username" required onChange={handleChange} />
        </div>

        <div className="Signup__Field">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Create a password" required onChange={handleChange} />

          {!passwordValid && (
            <ul className="password-requirements">
              <li style={{ color: /[a-z]/.test(registerData.password) ? 'green' : 'red' }}>
                At least one lowercase letter (a-z)
              </li>
              <li style={{ color: /[A-Z]/.test(registerData.password) ? 'green' : 'red' }}>
                At least one uppercase letter (A-Z)
              </li>
              <li style={{ color: /\d/.test(registerData.password) ? 'green' : 'red' }}>
                At least one digit (0-9)
              </li>
              <li style={{ color: /[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]/.test(registerData.password) ? 'green' : 'red' }}>
                At least one special character (!@#$%^&*)
              </li>
              <li style={{ color: registerData.password.length >= 8 ? 'green' : 'red' }}>
                At least 8 characters long
              </li>
            </ul>
        )}
        </div>

        <div className="Signup__Field">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            onChange={handleChange}
          />

          {!passwordMatch && (
            <p className="password-warning">Passwords do not match!</p>
          )}
        </div>

        <div className="Signup__Field">
          <label htmlFor="role">Sign up as:</label>
          <select id="role" name="role" onChange={handleChange}>
            <option value="patient">🧑‍⚕️ Patient</option>
            <option value="ambulance">🚑 Ambulance</option>
            <option value="hospital">🏥 Hospital</option>
            <option value="bloodbank">🩸 Blood Bank</option>
          </select>
        </div>

        <div className="Signup__Button">
          <button type="submit">
            Sign Up
          </button>
        </div>

        <p className="small-text">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
