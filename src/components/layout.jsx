import React from "react";
import { Link } from "react-router-dom";

export const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </header>

      <main></main>

      <footer>Copyright 2021</footer>
    </div>
  );
};
