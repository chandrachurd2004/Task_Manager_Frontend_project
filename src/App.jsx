import { useState } from "react";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";

function App() {
  const token = localStorage.getItem("token");
  const [showSignup, setShowSignup] = useState(false);

  if (token) {
    return <Dashboard />;
  }

  return showSignup ? (
    <Signup setShowSignup={setShowSignup} />
  ) : (
    <Login setShowSignup={setShowSignup} />
  );
}

export default App;