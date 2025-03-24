import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar";
import FirstPage from "./Components/FirstPage";

function App() {
  return (
    <BrowserRouter>
      {" "}
      {/* Wrap your components inside BrowserRouter */}
      <FirstPage />
      {/* <Navbar/> */}
      {/* other components */}
    </BrowserRouter>
  );
}

export default App;
