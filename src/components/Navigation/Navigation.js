import React from "react";

const Navigation = ({ onRouteChange, isSignIn }) => {
  if (isSignIn) {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          onClick={() => onRouteChange("signout")}
          className="f3 link dim black underline pa3 pointer"
        >
          Sign Out
        </p>
      </nav>
    );
  } else {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          onClick={() => onRouteChange("signin")}
          className="pa3 pointer underline link dim f3"
        >
          Sign In
        </p>
        <p
          onClick={() => onRouteChange("register")}
          className="pa3 pointer underline link dim f3"
        >
          Register
        </p>
      </nav>
    );
  }
};

export default Navigation;
