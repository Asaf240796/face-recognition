import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const SignIn = ({ onRouteChange, loadUser }) => {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onEmailChange = (event) => {
    setSignInEmail(event.target.value);
  };

  const onPasswordChange = (event) => {
    setSignInPassword(event.target.value);
  };

  const onSubmitSignIn = useCallback(async () => {
    if (signInEmail.length === 0 || signInPassword.length === 0) {
      setErrorMsg("Email or Password can not be empty");
      return;
    }
    const url = "https://face-recognition-backend-ie1g.onrender.com/signin";
    const body = {
      email: signInEmail,
      password: signInPassword,
    };
    try {
      const { data: user } = await axios.post(url, body);
      if (user && user.id) {
        onRouteChange("home");
        loadUser(user);
      } else {
        alert("email or password is incorrect");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  }, [signInEmail, signInPassword, onRouteChange, loadUser]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 13) {
        onSubmitSignIn();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSubmitSignIn]);

  return (
    <div>
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure ">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  onChange={onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  onChange={onPasswordChange}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                />
              </div>
            </fieldset>
            <div className="">
              <input
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
                onClick={onSubmitSignIn}
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("register")}
                className="f6 link dim black db pointer"
              >
                Register
              </p>
              <p className="f3 red db">{errorMsg}</p>
            </div>
          </div>
        </main>
      </article>
    </div>
  );
};

export default SignIn;
