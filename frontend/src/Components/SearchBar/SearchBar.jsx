import React from "react";
import "./SearchBar.css";
import {BiSearch} from 'react-icons/bi';


function App() {
  return (
      <div className="app-bar-search-field">
          <input className="app-bar-search" type="text" placeholder="Trova ristorante..." />
          <BiSearch className="app-bar-search-icon" size={30} />
      </div>
  );
}

export default App;