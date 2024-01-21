import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ReactTagPicker } from './TagPicker';
import MenuBar from './Components/MenuBar';
import Container from './Container';


function App() {
  return (
    <div className="App">
      {/* <MenuBar key={"MenuBar"}></MenuBar> */}
      <Container Component="Pokemon"></Container>
    </div>
  );
}

export default App;
