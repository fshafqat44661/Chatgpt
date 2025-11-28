import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../views/pages/MainPages/Landing/LandingPage";
import Layout from "./Layout";

const MainRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Using YOUR original Layout with your beautiful design */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default MainRoutes;
