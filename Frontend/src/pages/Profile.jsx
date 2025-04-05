import React from "react";
import "../stylesheet/Style.scss";

function Profile() {
  function HandelLogout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.href = "/login";
    setisloggedin(false);
  }
  return (
    <div className="Profile">
      <h1>Profile</h1>
      <button onClick={HandelLogout}>LogOut</button>
    </div>
  );
}

export default Profile;
