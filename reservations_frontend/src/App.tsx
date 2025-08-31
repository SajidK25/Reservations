import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import RequiredAuth, { RequireAdmin } from "./components/RequiredAuth";
import AdminPage from "./pages/Reservations";
import AdminUsers from "./pages/AdminUsers";

export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<RequiredAuth />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}
