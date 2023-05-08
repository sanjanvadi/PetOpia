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
      alert(error);
    }
  };

  let [userId, setUserId] = useState(undefined);

  function addUser(email) {

    let user = {
      email
    }

    fetch("/user", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then((res) => res.json())
    .then((data) => {
      setUserId(data.id);
      window.sessionStorage.setItem('userEmail',email);
      window.sessionStorage.setItem('userid', data.id);
      props.handleChange();
    });
    
  }

  if (currentUser) {
    addUser(currentUser.email);
    if(userId) return <Navigate to={'/account/my-pets'}></Navigate>
  }
  return (
    <div>
      <br />
      <h1 style={{ fontFamily: "LeckerliOne-Regular", color: "#db9b43" }}>
        Welcome to PetOpia!
      </h1>
      <p className="headline">
        PetOpia is a Pet Health Management Platform which is based on the
        realization that animals on our planet also deserve concern the same
        level of concern that we show to our loved ones. After all actions speak
        louder than words. This is the very place where people can manage the
        well-being of their pets. Let's show some love and care to these animals
        together with PetOpia! <br />
        <br />
        <br />
        <br />
        We also provide a public option on our website that lists different
        kinds of pets around you. If you are looking to adopt a pet, you can
        check out our Adopt page right from the navigation bar!
      </p>
      <br />
      <br />
      <br />
      <img
        onClick={() => socialSignOn("google")}
        alt="google signin"
        src="/imgs/btn_google_signin.png"
      />
      <img
        onClick={() => socialSignOn("facebook")}
        alt="facebook signin"
        src="/imgs/facebook_signin.png"
      />
    </div>
  );
}

export default SignIn;
