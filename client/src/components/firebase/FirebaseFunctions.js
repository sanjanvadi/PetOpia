import firebaseApp from "./Firebase";
import {
  getAuth,
  signInWithRedirect,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";

const auth = getAuth(firebaseApp);

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === "google") {
    socialProvider = new GoogleAuthProvider();
  } else if (provider === "facebook") {
    socialProvider = new FacebookAuthProvider();
  } else if (provider === "twitter") {
    socialProvider = new TwitterAuthProvider();
  }
  await signInWithRedirect(auth, socialProvider);
}

async function doSignOut() {
  window.sessionStorage.removeItem("userEmail");
  window.sessionStorage.removeItem("userid");
  await signOut(auth);
}

export { doSocialSignIn, doSignOut };
