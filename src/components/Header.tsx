import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import NotificationIcon from "@heroicons/react/24/outline/BellIcon";
import SearchBar from "../common/SearchBar";
import Profile from "./ProfileMenu";
import netFlixLogo from '../asset/netflixlog.png'

export default function Header() {
  const [fixed, setfixed] = useState(false);

  function isActiveLink({ isActive }: { isActive: boolean }) {
    return isActive ? "font-semibold text-white" : undefined;
  }

  function onWindowScroll() {
    if (window.scrollY > 8) {
      setfixed(true);
    } else {
      setfixed(false);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", onWindowScroll);

    return () => window.removeEventListener("scroll", onWindowScroll);
  });

  return (
    <>
      <header
        className={`z-10 py-2 pr-16 ${
          fixed ? "fixed bg-black" : "relative bg-transparent"
        } w-full transition-colors duration-300 `}
      >
        <nav className="grid grid-cols-[200px_auto_auto] items-center gap-4">
          <section className="h-14">
            <Link to="/browse">
              <img
                className=" h-full w-full"
                src={netFlixLogo}
                alt=""
              />
            </Link>
          </section>

          <section className="text-sm font-normal text-gray-300">
            <ul className="flex gap-8">
              <li>
                <NavLink className={isActiveLink} to="/browse">
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink className={isActiveLink} to="/browse/genre">
                  TV Shows
                </NavLink>
              </li>

              <li>
                <NavLink className={isActiveLink} to="/browse/genre/movies">
                  Movies
                </NavLink>
              </li>

              <li>
                <NavLink className={isActiveLink} to="/latest">
                  New & Popular
                </NavLink>
              </li>
            </ul>
          </section>

          <section className="flex items-center gap-4 justify-self-end">
            <SearchBar />
            <NotificationIcon className="h-8 w-8" />
            <Profile />
          </section>
        </nav>
      </header>
    </>
  );
}
