import React from 'react';
import {doSignOut} from './firebase/FirebaseFunctions';

const SignOutButton = (props) => {
  return (
    <button type='button' className='postLink' onClick={() => {doSignOut(); props.handleChange()}}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
