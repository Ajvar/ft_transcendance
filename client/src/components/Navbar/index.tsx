import "../../styles/navbar.css";
import React from "react";
import { NavLink } from 'react-router-dom';
import profile from "../../assets/user.png";
import Login, { VerifLogged } from "../../pages/login/Login";

export default function Navbar()
{
  const [isLogged] = React.useState(VerifLogged);
  if(isLogged){
      return (
          <>
          <nav className="navigation">
              <div
              className="navigation-menu">
              <ul>
                  <li>
                    <NavLink to="/Home">Home</NavLink>
                  </li>
                  <li>
                    <NavLink to="/play">Play</NavLink>
                  </li>
                  <li>
                    <NavLink to="/games">Games</NavLink>
                  </li>
                  <li>
                    <NavLink to="/chat">Chat</NavLink>
                  </li>
                  <li>
                    <NavLink to="/profil"><img className="profile" src={profile} alt="Profil"/></NavLink>
                  </li>
              </ul>
              </div>
          </nav>
        </>
      );}
      else{
          return (
            <Login />
          );
  }
}