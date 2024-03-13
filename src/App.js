import "./App.css";
import Navigation from "./components/Navigation/Navigation.js";
import Logo from "./components/Logo/Logo.js";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js";
import Rank from "./components/Rank/Rank.js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.js";
import SignIn from "./components/SignIn/SignIn.js";
import Register from "./components/Register/Register.js";
import React, { useState } from "react";
import ParticlesBg from "particles-bg";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [boxBorder, setBoxBorder] = useState({});
  const [img, setImg] = useState("");
  const [route, setRoute] = useState("signin");
  const [isSignIn, setIsSignIn] = useState(false);
  const [user, setUser] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onUserChange = (user) => {
    setUser(user);
  };

  const updateUserEntriesNumber = (response) => {
    const newEntries = response;
    setUser({ ...user, entries: newEntries });
  };

  const calculateFacePosition = (data) => {
    if (data?.outputs?.[0]?.data?.regions?.[0]?.region_info) {
      const clarifiFace =
        data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById("inputImage");
      const width = Number(image.width);
      const height = Number(image.height);

      return {
        leftCol: clarifiFace.left_col * width,
        topRow: clarifiFace.top_row * height,
        rightCol: width - clarifiFace.right_col * width,
        bottomRow: height - clarifiFace.bottom_row * height,
      };
    } else {
      setErrorMsg("No face detected");
      return {};
    }
  };

  const onPictureSubmit = async () => {
    setErrorMsg("");
    if (input.length === 0) {
      setErrorMsg("Input can not be empty");
      return;
    }
    setImg(input);
    const body1 = {
      input: input,
    };
    try {
      const { data: response } = await axios.post(
        `https://face-recognition-backend-ie1g.onrender.com/imageurl`,
        body1
      );
      if (response.status.description !== "Ok") {
        if (response.status.code === 30104) {
          setErrorMsg("URL cannot be longer than 2000 characters.");
        }
        throw new Error("Network response was not ok");
      }
      if (response) {
        const body = {
          id: user.id,
        };
        try {
          const { data: userResponse } = await axios.put(
            `https://face-recognition-backend-ie1g.onrender.com/image?id=${user.id}`,
            body
          );
          if (!userResponse) {
            console.log("The error is", userResponse);
            throw new Error("Network response was not ok");
          }
          setErrorMsg("");
          updateUserEntriesNumber(userResponse);
        } catch (error) {
          console.error("Error updating user entries:", error);
        }
      }
      setBoxBorder(calculateFacePosition(response));
    } catch (error) {
      setErrorMsg("Error detecting faces");
      console.error("Error detecting faces:", error);
      setBoxBorder({});
    }
  };

  const onRouteChange = (route) => {
    setErrorMsg("");
    setImg("");
    setBoxBorder({});
    if (route === "signout") {
      setIsSignIn(false);
    } else if (route === "home") {
      setIsSignIn(true);
    }
    setRoute(route);
  };

  return (
    <div className="App">
      <ParticlesBg
        className="particles"
        bg={true}
        type="cobweb"
        color="#ff0000"
        num={200}
      />
      <Navigation
        user={user}
        isSignIn={isSignIn}
        onRouteChange={onRouteChange}
      />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank user={user} />
          <ImageLinkForm
            onInputChange={onInputChange}
            buttonSubmit={onPictureSubmit}
          />
          <p className="f3 red db">{errorMsg}</p>
          <FaceRecognition imageUrl={img} box={boxBorder} />
        </div>
      ) : route === "signin" ? (
        <SignIn loadUser={onUserChange} onRouteChange={onRouteChange} />
      ) : (
        <Register loadUser={onUserChange} onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
