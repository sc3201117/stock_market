// import React from 'react';
// import { Routes, Route } from 'react-router-dom';

// import AppRoutes from './routes/AppRoutes';
// function App(){
//   return (
//     <>
//     <AppRoutes />
//     </>
//   )
// }
// export default App





import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import AppRoutes from "./routes/AppRoutes";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    // <Router>
    //   <Routes>
    //     {/* Public routes */}
    //     <Route path="/login" element={<Login />} />

    //     {/* Protected routes */}
    //     <Route
    //       path="/home"
    //       element={
    //         <ProtectedRoute>
    //           <Home />
    //         </ProtectedRoute>
            
    //       }
    //     />
    //   </Routes>
    // </Router>

<React.StrictMode>
    <AppRoutes />
  </React.StrictMode>

  );
}

export default App;
