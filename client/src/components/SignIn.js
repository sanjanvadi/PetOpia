import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from './firebase/Auth';
import {
  doSocialSignIn
} from './firebase/FirebaseFunctions';

function SignIn() {
  const {currentUser} = useContext(AuthContext);
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to='/home' />;
  }
  return (
    <div>
      <h1>Log in</h1>
      <img
        onClick={() => socialSignOn('google')}
        alt='google signin'
        src='/imgs/btn_google_signin.png'
      />
      <img
        onClick={() => socialSignOn('facebook')}
        alt='facebook signin'
        src='/imgs/facebook_signin.png'
      />
    </div>
  );
}

export default SignIn;
