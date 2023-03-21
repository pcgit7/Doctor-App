import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import { useSelector } from "react-redux";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import ApplyDoctor from "./pages/ApplyDoctor";
import Notification from "./pages/Notification";
import UsersLists from "./pages/Admin/UsersLists";
import DoctorsLists from "./pages/Admin/DoctorsLists";
import Profile from "./pages/Doctor/Profile";
import BookAppointment from "./pages/BookAppointment";
import Appointment from "./pages/Appointment";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent">
          <div class="spinner-border" role="status"></div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoutes>
              {" "}
              <Login />{" "}
            </PublicRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoutes>
              {" "}
              <Register />{" "}
            </PublicRoutes>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/apply-doctor"
          element={
            <ProtectedRoutes>
              <ApplyDoctor />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoutes>
              <Notification />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoutes>
              <UsersLists />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoutes>
              <DoctorsLists />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/doctor/profile/:userId"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/book-appointment/:doctorId"
          element={
            <ProtectedRoutes>
              <BookAppointment />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoutes>
              <Appointment />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoutes>
              <DoctorAppointment />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
