// import React, { useState } from 'react'
// import { navLinks, styles } from '../assets/dummyadmin'
// import { GiChefToque } from "react-icons/gi";
// import { FiMenu, FiX } from 'react-icons/fi';
// import { NavLink } from "react-router-dom";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   return (
//     <nav className={styles.navWrapper}>
//       <div className={styles.navContainer}>
//         <div className={styles.logoSection}>
//           <GiChefToque className={styles.logoIcon} />
//           <span className={styles.logoText}>Admin Panel</span>
//         </div>

//         <button onClick={() => setMenuOpen(!menuOpen)}
//           className={styles.menuButton}>
//           {menuOpen ? <FiX /> : <FiMenu />}
//         </button>

//         <div className={styles.desktopMenu}>
//           {navLinks.map(link => (
//             <NavLink key={link.name} to={link.href} className={({ isActive }) => `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}>
//               {link.icon}
//               <span>{link.name}</span>
//             </NavLink>
//           ))}
//         </div>
//       </div>
//       {/* FORT MOBILE VIEW */}
//       {menuOpen && (
//         <div className={styles.mobileMenu}>
//           {navLinks.map(link => (
//             <NavLink key={link.name} to={link.href} onClick={() => setMenuOpen(false)}
//               className={({ isActive }) => `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}>
//               {link.icon}
//               <span>{link.name}</span>
//             </NavLink>
//           ))}

//         </div>
//       )}
//     </nav>
//   )
// }

// export default Navbar


import React, { useState } from 'react'
import { navLinks, styles } from '../assets/dummyadmin'
import { GiChefToque } from "react-icons/gi";
import { FiMenu, FiX } from 'react-icons/fi';
import { NavLink } from "react-router-dom";
import { useAuth, useUser, SignOutButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <nav className={styles.navWrapper}>
      <div className={styles.navContainer}>
        <div className={styles.logoSection}>
          <GiChefToque className={styles.logoIcon} />
          <span className={styles.logoText}>Admin Panel</span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={styles.menuButton}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={styles.desktopMenu}>
          {/* Show nav links only when signed in */}
          {isSignedIn && navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) => `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}

          {/* Auth buttons - always visible */}
          {!isSignedIn ? (
            <>
              <NavLink
                to="/sign-in"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white transition-colors"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/sign-up"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-amber-100">
                👨‍🍳 {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]}
              </span>
              <SignOutButton>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {isSignedIn && navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}

          {/* Mobile auth buttons */}
          {!isSignedIn ? (
            <>
              <NavLink
                to="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white text-center"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/sign-up"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-center"
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <div className="px-4 py-2">
              <SignOutButton>
                <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar