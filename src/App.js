import "./App.css";
import Navigation from "./components/Navigation/Navigation.js";
import Logo from "./components/Logo/Logo.js";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js";
import Rank from "./components/Rank/Rank.js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.js";
import SignIn from "./components/SignIn/SignIn.js";
import Register from "./components/Register/Register.js";
import React, { useState, useEffect } from "react";
import ParticlesBg from "particles-bg";

function App() {
  const [input, setInput] = useState("");
  const [boxBorder, setBoxBorder] = useState({});
  const [img, setImg] = useState("");
  const [route, setRoute] = useState("signInPage");
  const [isSignIn, setIsSignIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:1234/")
      .then((response) => response.json())
      .then((data) => console.log(data));
  });

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const calculateFacePosition = (data) => {
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
  };

  const returnClarifiRequestOptions = (imageUrl) => {
    const PAT = "2af950e61d6c4acb80551760947a079a";
    const USER_ID = "35h1h6xbhrmp";
    const APP_ID = "test";
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    return requestOptions;
  };

  const onBtnSubmit = () => {
    setImg(input);
    fetch(
      "https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs",
      returnClarifiRequestOptions(input)
    )
      .then((response) => response.json())
      .then((result) => {
        const boundingBox =
          result.outputs[0]?.data?.regions[0]?.region_info?.bounding_box;

        if (boundingBox) {
          console.log(boundingBox);
          const facePosition = calculateFacePosition(result);
          console.log(facePosition);
          setBoxBorder(facePosition);
        } else {
          console.log("No face detected");
          setBoxBorder({});
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      setIsSignIn(false);
    } else if (route === "home") {
      setIsSignIn(true);
    }
    setRoute(route);
  };

  const renderRoute = () => {
    if (route === "signInPage") {
      return <SignIn onRouteChange={onRouteChange} />;
    } else {
      return <Register onRouteChange={onRouteChange} />;
    }
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
      <Navigation isSignIn={isSignIn} onRouteChange={onRouteChange} />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={onInputChange}
            buttonSubmit={onBtnSubmit}
          />
          <FaceRecognition imageUrl={img} box={boxBorder} />
        </div>
      ) : (
        renderRoute()
      )}
    </div>
  );
}

export default App;
