import "../stylesheet/Style.scss";
import "../stylesheet/Signup.scss";

function Profile() {
  return (
    <div className="SignUp-Form">
      <form className="Signup">
        <h1>Create Your Account</h1>
        
        <div className="Signup__Field">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="Enter your full name" required />
        </div>
        
        <div className="Signup__Field">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required />
        </div>
        
        <div className="Signup__Field">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Create a password" required />
        </div>
        
        <div className="Signup__Field">
          <label htmlFor="cpassword">Confirm Password:</label>
          <input type="password" id="cpassword" name="cpassword" placeholder="Confirm your password" required />
        </div>
        
        <div className="Signup__Button">
          <button type="submit">Submit</button>
        </div>

        <p className="small-text">Already have an account? <a href="/login">Log in</a></p>
      </form>
    </div>
  );
}

export default Profile;
