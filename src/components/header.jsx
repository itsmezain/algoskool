import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./header.css";

const Header = () => {
  const location = useLocation(); 

  const isProblemsPage = location.pathname === "/problems";
  const isRoomsPage = location.pathname === "/rooms";
  
  return (
    <div>
      <header className={`header ${isProblemsPage ? 'header-problems' : isRoomsPage ? 'header-rooms' : ''}`}>
        <div className="header-logo">
          <h1>algoskool</h1>
        </div>
        <nav className="header-nav">
          <ul>
            <li>
            <Link className={`links ${isRoomsPage ? "active" : ""}`} to="/rooms">
                Rooms
              </Link>
            </li>
            <li>
            <Link className={`links ${isProblemsPage ? "active" : ""}`} to="/problems">
                Problems
              </Link>
            </li>
            <li>Contests</li>
            <li>Explore</li>
          </ul>
        </nav>
        <div className="header-icons">
          <i class="fi fi-rr-bell icon circle"></i>
          <i class="fi fi-rr-fire-flame-curved icon circle"></i>
          <img src="https://avatars.githubusercontent.com/u/89008579?v=4" alt="Profile" className="profile-picture" />
        </div>
      </header>
      <div className="horizontal-line"></div>
    </div>
  );
};

export default Header;