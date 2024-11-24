import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase authentication
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import Login from './Pages/Login/Components/Login';
import Navbar from './Pages/Navbar/Components/Navbar';
import Dashboard from './Pages/Dashboard/Components/Dashboard';
// import DashboardLayoutBasic from './Pages/Dashboard/Components/Dashboard';
// import Profile from './Pages/Profile/Components/Profile'; // Example new route
// import Settings from './Pages/Settings/Components/Settings'; // Example new route
import Profile from './Pages/Dashboard/Components/Profile';
import ProtectedRoute from './ProtectedRoute';
// import Navbar from './Pages/Navbar/Components/Navbar'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount

  }, []);

  // if (loading) {
  //   return <div>Loading...</div>; // You can customize a loading screen here
  // }

  return (
    <div className="App">
      {/* <Navbar/> */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/settings"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Settings />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
    </div>
  );
}

export default App;
