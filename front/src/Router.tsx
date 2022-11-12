import { Route, Routes } from "react-router";
import React from "react";
import Layout from "./components/layout";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Profil from "./pages/profil/Profil";
import History from './pages/profil/History';
import Stats from "./pages/stats/Stats"
import Play from "./pages/play/Play";
import Games from "./pages/games/Games";
import NavBar from "./pages/profil/Navbar";
import Login from "./pages/login/Login";
import { hasLogged } from "./pages/login/Login";
import Auth from "./context/Auth";
import { AuthRoute } from "./pages/login/AuthRoute";

export default function Router() {

    const [isLogged, setIsLogged] = React.useState(hasLogged);
    return (
        <Auth.Provider value={{ isLogged }}>
            <>
                <Navbar /> 
                <Routes>
                    <Route element={<AuthRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/play" element={<Play />} />
                            <Route path="/games" element={<Games />} />
                        </Route>
                        <Route element={<NavBar />}>
                            <Route path="/profil" element={<Profil id={1} />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/stats" element={<Stats />} />
                        </Route>
                    </Route>
                </Routes>
            </>
        </Auth.Provider>
    );

}