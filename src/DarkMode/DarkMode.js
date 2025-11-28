import React, { useState, useEffect } from "react";
import { ReactComponent as Sun } from "../assets/Sun.svg";
import { ReactComponent as Moon } from "../assets/Moon.svg";
import "./DarkMode.css";

const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

const DarkMode = () => {
  const [theme, setTheme] = useState(savedTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        onChange={toggleTheme}
        checked={theme === "dark"}
        id="darkmode-toggle"
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        <Sun />
        <Moon />
      </label>
    </div>
  );
};

export default DarkMode;
