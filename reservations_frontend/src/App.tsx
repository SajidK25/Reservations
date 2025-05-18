import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import RequiredAuth from "./components/RequiredAuth";

export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<RequiredAuth />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}
