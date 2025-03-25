import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar";
import FirstPage from "./Components/FirstPage";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <Navbar />
      <FirstPage />
    </BrowserRouter>
  );
}

export default App;
