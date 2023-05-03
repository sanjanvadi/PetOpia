import firebaseApp from './Firebase';
import {
  getAuth, 
  signInWithRedirect,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth'

const auth = getAuth(firebaseApp);

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === 'google') {
    socialProvider = new GoogleAuthProvider();
  } else if (provider === 'facebook') {
    socialProvider = new FacebookAuthProvider();
  }
  await signInWithRedirect(auth, socialProvider);
}

async function doSignOut() {
  await signOut(auth);
}

export {
  doSocialSignIn,
  doSignOut
};
