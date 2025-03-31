import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashPage from "./Components/SplashPage";
import Login from "./Components/Login";
import VotingComponent from "./Components/VotingComponent";
import UserDashboard from "./Components/UserDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userDashboard/*" element={<UserDashboard />} />
        <Route path="/logout" element={<h2>Logging Out...</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
