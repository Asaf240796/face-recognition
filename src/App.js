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

  const updateUserEntriesNumber = async () => {
    try {
      const req = {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
        }),
      };
      const response = await fetch("http://localhost:1234/image", req);
      if (response.ok) {
        const newEntries = await response.json();
        setUser({ ...user, entries: newEntries[0].entries });
      }
    } catch (err) {
      console.log(err);
    }
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
      console.log("No face detected");
      return {};
    }
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

  const onPictureSubmit = () => {
    setErrorMsg("");
    if (input.length === 0) {
      setErrorMsg("Input can not be empty");
      return;
    }
    setImg(input);
    fetch(
      "https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs",
      returnClarifiRequestOptions(input)
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("The result", result);
        if (result) {
          fetch(`http://localhost:1234/image?id=${user.id}`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: user.id,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                console.log("The error is", response);
                throw new Error("Network response was not ok");
              }
              return response.json();
            })

            .then(() => {
              setErrorMsg("");
              updateUserEntriesNumber();
            })
            .catch((error) => {
              console.error("Error updating user entries:", error);
            });
        }
        setBoxBorder(calculateFacePosition(result));
      })
      .catch((error) => {
        console.error("Error detecting faces:", error);
      });
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
