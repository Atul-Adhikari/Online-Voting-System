import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

import styles from "../Styles/Navbar.module.css";

function NavBar() {
  // State to track whether the mobile menu is open or closed
  const [click, setClick] = useState(false);

  // Toggle function for the mobile menu
  const handleClick = () => setClick(!click);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Website Name / Logo */}
        <NavLink exact to="/" className={styles.webName}>
          E-MATADAN
        </NavLink>

        {/* Navigation menu list */}
        <ul
          className={
            // Apply active class if the mobile menu is open
            click ? `${styles.navMenu} ${styles.active}` : styles.navMenu
          }
        >
          {/* Navigation links */}
          <li className={styles.navItem}>
            <NavLink
              exact
              to="/"
              className={({ isActive }) =>
                // Highlight active link
                isActive
                  ? `${styles.navLinks} ${styles.active}`
                  : styles.navLinks
              }
              onClick={handleClick} // Close mobile menu when link is clicked
            >
              Home
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              exact
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLinks} ${styles.active}`
                  : styles.navLinks
              }
              onClick={handleClick}
            >
              About
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              exact
              to="/blog"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLinks} ${styles.active}`
                  : styles.navLinks
              }
              onClick={handleClick}
            >
              Blog
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              exact
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLinks} ${styles.active}`
                  : styles.navLinks
              }
              onClick={handleClick}
            >
              Contact Us
            </NavLink>
          </li>
        </ul>

        {/* Icon section for profile and mobile menu toggle */}
        <div className={styles.iconContainer}>
          {/* Profile icon */}
          <div className={styles.profileIcon}>
            <FaUserCircle />
          </div>

          {/* Mobile menu toggle icon */}
          <div className={styles.navIcon} onClick={handleClick}>
            {/* Show close icon if the menu is open, otherwise show hamburger */}
            {click ? <IoClose /> : <RxHamburgerMenu />}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
