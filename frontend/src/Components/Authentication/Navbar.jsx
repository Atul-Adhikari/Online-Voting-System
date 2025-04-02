import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

import styles from "../Styles/Navbar.module.css";

function NavBar() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <NavLink exact to="/" className={styles.webName}>
          E-MATADAN
        </NavLink>

        <ul
          className={
            click ? `${styles.navMenu} ${styles.active}` : styles.navMenu
          }
        >
          <li className={styles.navItem}>
            <NavLink
              exact
              to="/"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLinks} ${styles.active}`
                  : styles.navLinks
              }
              onClick={handleClick}
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

        <div className={styles.iconContainer}>
          <div className={styles.profileIcon}>
            <FaUserCircle />
          </div>

          <div className={styles.navIcon} onClick={handleClick}>
            {click ? <IoClose /> : <RxHamburgerMenu />}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
