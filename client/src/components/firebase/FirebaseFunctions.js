import firebaseApp from "./Firebase";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const auth = getAuth(firebaseApp);

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === "google") {
    socialProvider = new GoogleAuthProvider();
  } else if (provider === "github") {
    socialProvider = new GithubAuthProvider();
  }
  await signInWithPopup(auth, socialProvider);
}

async function doSignOut() {
  window.sessionStorage.removeItem("userEmail");
  window.sessionStorage.removeItem("userid");
  await signOut(auth);
}

export { doSocialSignIn, doSignOut };
