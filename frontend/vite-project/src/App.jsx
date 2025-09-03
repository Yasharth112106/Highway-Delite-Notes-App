// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// import Notes from "./pages/Notes";

// function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/signup" />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route
//           path="/notes"
//           element={token ? <Notes /> : <Navigate to="/login" />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
