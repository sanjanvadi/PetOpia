import React from "react";
import "./App.css";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import AdoptPet from "./components/AdoptPet";
function App() {
  return (
    <Router>
      <div>
      <header className='App-header'>
            <h1 className='App-title'>
              PetOpia
            </h1>
            <br/>
            <nav>
              <NavLink className='showlink' to='/adoptpet'>
                Adopt a Pet
              </NavLink>
            </nav>
          </header>
          <Routes>
              <Route path='/adoptpet' element={<AdoptPet/>} />
              {/* <Route path='*' element={<G/>}/> */}
          </Routes>
      </div>
    </Router>
  );
}

export default App;
