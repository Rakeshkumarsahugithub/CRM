import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './LoginPage';
import SignupPage from './SignUpPage';
import TelecallerPage from './TelecallerPage';
import DashboardPage from './DashboardPage';
import PrivateRoute from './PrivateRoute';
import AuthSuccessPage from './AuthSuccessPage';
import LogoutButton from './LogoutButton';


// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/auth-success" element={<AuthSuccessPage />} />
//         <Route
//           path="/telecaller"
//           element={
//             <PrivateRoute allowedRoles={['telecaller']}>
//               <TelecallerPage />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute allowedRoles={['admin']}>
//               <DashboardPage />
//             </PrivateRoute>
//           }
//         />
//         <Route path="/" element={<Navigate to="/login" />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="App">
      {isAuthenticated && <LogoutButton />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth-success" element={<AuthSuccessPage />} />
        <Route
          path="/telecaller"
          element={
            <PrivateRoute allowedRoles={['telecaller']}>
              <TelecallerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;