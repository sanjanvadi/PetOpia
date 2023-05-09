import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./firebase/Auth";
import { doSocialSignIn } from "./firebase/FirebaseFunctions";

function SignIn(props) {
  const { currentUser } = useContext(AuthContext);
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
    } catch (error) {
      alert(
        "An account with the given email address already exists under a different provider! Please use that!"
      );
    }
  };

  let [userId, setUserId] = useState(undefined);

  function addUser(email) {
    let user = {
      email,
    };

    fetch("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.id);
        window.sessionStorage.setItem("userEmail", email);
        window.sessionStorage.setItem("userid", data.id);
        props.handleChange();
      });
  }

  if (currentUser) {
    addUser(currentUser.email);
    if (userId) return <Navigate to={"/account/my-pets"}></Navigate>;
  }
  return (
    <div>
      <br />
      <h1
        style={{
          height: "0.7em",
          fontFamily: "LeckerliOne-Regular",
          color: "#a16c00",
        }}
      >
        Welcome to PetOpia!
      </h1>
      <p style={{ height: "16em" }} className="headline">
        PetOpia is a Pet Health Management Platform which is based on the
        realization that animals on our planet also deserve the same level of
        concern that we show to our loved ones. This is the very place where
        people can manage the well-being of their pets. After all actions speak
        louder than words. Let's show some love and care to these animals
        together with PetOpia!
        <br />
        <br />
        <br />
        We also provide a public option on our website that lists different
        kinds of pets around you. If you are looking to adopt a pet, you can
        check out our Adopt page right from the navigation bar!
      </p>
      <p style={{ height: "1.3em", textAlign: "center" }} className="headline">
        Sign in to get started:
      </p>
      <br />
      <br />
      <img
        className="login-icons"
        onClick={() => socialSignOn("google")}
        alt="google signin"
        src="/imgs/google-icon.png"
      />
      <img
        className="login-icons"
        onClick={() => socialSignOn("github")}
        alt="github signin"
        src="/imgs/github-icon.png"
      />
    </div>
  );
}

export default SignIn;
