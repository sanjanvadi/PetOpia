import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {AuthContext} from './firebase/Auth';
import SignOutButton from './SignOut';
import '../App.css';

const Navigation = () => {
  const {currentUser} = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <nav className="navigation">
        <NavLink className='mainLogo' to="/">
          <h1 className="App-title">PetOpia</h1>
        </NavLink>
        <div className="navLinks">
            <NavLink className='postLink' to="/">
              Home
            </NavLink>
            <NavLink className='postLink' to="/adoptpet">
              Adopt
            </NavLink>
            <NavLink className='postLink' to='/account'>
              Account
            </NavLink>
            <SignOutButton />
        </div>
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav className="navigation">
        <NavLink className='mainLogo' to="/">
          <h1 className="App-title">PetOpia</h1>
        </NavLink>
        <div className="navLinks">
            <NavLink className='postLink' to="/">
              Home
            </NavLink>
            <NavLink className='postLink' to="/adoptpet">
              Adopt
            </NavLink>
            <NavLink className='postLink' to='/signin'>
              Sign In
            </NavLink>
        </div>
    </nav>
  );
};

export default Navigation;
