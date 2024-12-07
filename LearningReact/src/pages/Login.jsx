import "../stylesheet/Style.scss";
import "../stylesheet/LogIn.scss";

function Login() {
  return (
    <div className="Login-Form">
      <form className="Login">
        <h1>Log In</h1>
        
        <div className="Login__Field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
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
