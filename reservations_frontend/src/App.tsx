import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Reservations from "./pages/Reservations";

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/reservations">Make a Reservation</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservations" element={<Reservations />} />
      </Routes>
    </div>
  );
}
