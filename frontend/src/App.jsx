// import "./App.css";
// import { BrowserRouter } from "react-router-dom";
// import Navbar from "./Components/Navbar";
// import FirstPage from "./Components/SplashPage";

// function App() {
//   return (
//     <BrowserRouter>
//       {" "}
//       {/* <Navbar /> */}
//       <FirstPage />
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashPage from "./Components/SplashPage";
import Login from "./Components/Login"; // Ensure this page exists

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage/>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
