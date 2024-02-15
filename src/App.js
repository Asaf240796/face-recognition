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

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onUserChange = (user) => {
    setUser(user);
  };

  const updateUserEntriesNumber = async () => {
    const req = {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
      }),
    }
      .then((response) => response.json())
      .then((count) => {
        setUser({
          users: {
            entries: count,
          },
        });
      });
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

  const onPictureSubmit = () => {
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
          const facePosition = calculateFacePosition(result);
          setBoxBorder(facePosition);
        } else {
          console.log("No face detected");
          setBoxBorder({});
        }
      })
      // .then(() => {
      //   updateUserEntriesNumber();
      // })
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
          <Rank user={user} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            buttonSubmit={onPictureSubmit}
          />
          <FaceRecognition imageUrl={img} box={boxBorder} />
        </div>
      ) : route === "signin" ? (
        <SignIn getUserData={onUserChange} onRouteChange={onRouteChange} />
      ) : (
        <Register getUserData={onUserChange} onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
