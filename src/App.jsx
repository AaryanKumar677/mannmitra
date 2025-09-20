import { Routes, Route } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AIInterface from "./ai-interface/AIApp";

import ContextProvider from "./ai-interface/context/Context";

const App = () => {
  console.log("App.jsx loaded (Routes will be inside Providers)");
  return (
    <ContextProvider>
      <Routes>
        <Route
          path="/"
          element={
            <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
              <Header />
              <Hero />
              <Benefits />
              <Collaboration />
              <Services />
              <Roadmap />
              <Footer />
              <ButtonGradient />
            </div>
          }
        />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Profile Page */}
        <Route path="/profile" element={<Profile />} />

        {/* AI Interface */}
        <Route path="/app" element={<AIInterface />} />
      </Routes>
    </ContextProvider>
  );
};

export default App;
