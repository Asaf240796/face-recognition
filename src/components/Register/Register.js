import React, { useState } from "react";
import axios from "axios";

const Register = ({ onRouteChange, loadUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const onSubmitSignin = async () => {
    const url = "https://face-recognition-backend-ie1g.onrender.com/register";
    const body = {
      email: email,
      password: password,
      name: name,
    };
    try {
      const { data: user } = await axios.post(url, body);
      if (user.id) {
        loadUser(user);
        onRouteChange("home");
      }
      console.log(user);
    } catch (error) {}
  };

  // const onSubmitSignin = () => {
  //   fetch("http://localhost:1234/register", {
  //     method: "post",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       email: email,
  //       password: password,
  //       name: name,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((user) => {
  //       if (user.id) {
  //         loadUser(user);
  //         onRouteChange("home");
  //       }
  //     });
  // };

  return (
    <div>
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure ">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input
                  onChange={onNameChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                />
              </div>
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
                value="Register"
                onClick={onSubmitSignin}
              />
            </div>
          </div>
        </main>
      </article>
    </div>
  );
};

export default Register;
