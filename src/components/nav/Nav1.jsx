import React from "react";
import { NavLink } from "react-router-dom";
import "./nav.css";
import Logo from "./logowhite"
const Nav = () => {
    return(
        <>
        <nav>
        <div id="first">
            <Logo/>
        <span id="title">Digital Library</span></div>
        <div className="nav-links">
            <div><NavLink to="/">Home</NavLink></div>
            <div><NavLink to="/">Browse</NavLink></div>
            <div><NavLink to="/About">About Us</NavLink></div>
            <div><NavLink to="/Sign"><button className="but">Sign Up</button></NavLink></div>
            <div><NavLink to={"/Log"}><button class="but">Sign In</button></NavLink></div>
        </div>
        </nav>
        </>
    )
}

export default Nav;