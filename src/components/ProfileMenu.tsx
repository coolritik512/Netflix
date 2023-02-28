import React, { Dispatch, useEffect, useRef, useState } from "react";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import profileImage from "../asset/user.png";
import { useAuth } from "../common/auth";
import { useProfileContext, useProfileDispatchContext } from "./profileContext";
import { UserProfile } from "../common/typo";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const [showMenu, setshowMenu] = useState(false);
  const profileMenuContainer = useRef<HTMLElement | null>(null);

  const dispatch = useProfileDispatchContext();
  const { signOutUser } = useAuth();
   
  const timerId = useRef(0);
  function onMouseEnter() {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    setshowMenu(true);
  }
  function onMouseExit() {
    const timer=setTimeout(() => {
      setshowMenu(false);
    }, 300)
    timerId.current = parseInt(`${timer}`);
  }
  const navigate = useNavigate();
  async function signOutOFNetflix() {
    await signOutUser();
    dispatch({type:'load',payload:null});
    navigate("/login");
  }

  const profiles = useProfileContext();

  const currentProfile =
    profiles?.profiles[
      profiles?.profiles.findIndex(
        (profile) => profile.id === profiles.selectedProfileId
      )
    ];

  useEffect(() => {
    profileMenuContainer.current?.addEventListener("mouseenter", onMouseEnter);
    profileMenuContainer.current?.addEventListener("mouseleave", onMouseExit);

    return () => {
      profileMenuContainer.current?.removeEventListener(
        "mouseenter",
        onMouseEnter
      );
      profileMenuContainer.current?.removeEventListener(
        "mouseleave",
        onMouseExit
      );
    };
  }, []);

  function loadProfile(profile: UserProfile) {
    dispatch({ type: "current", payload: profile });
    window.location.reload();
  }

  return (
    <>
      <section ref={profileMenuContainer} className="relative">
        <section className="flex items-center gap-2">
          <img
            src={currentProfile ? currentProfile?.imageUrl : ""}
            alt=""
            className="h-10 w-12 rounded-md"
          />
          <ChevronDownIcon
            style={{ strokeWidth: "0.2rem" }}
            className={`h-6 w-6 transition-transform duration-100 ${
              showMenu ? " rotate-180 " : ""
            }  `}
          />
        </section>
        {showMenu ? (
          <ul className="absolute top-[60px] -left-24 flex w-[200px] flex-col justify-center gap-4 bg-dark px-4 py-2 ">
            {profiles?.profiles
              .filter((profile) => profile.id !== currentProfile?.id)
              ?.map((profile) => {
                return (
                  <li
                    onClick={() => loadProfile(profile)}
                    key={profile.id}
                    className="hover: flex cursor-pointer items-center gap-2 underline"
                  >
                    <img className="h-6 w-6" src={profile.imageUrl} alt="" />
                    {profile.name}
                  </li>
                );
              })}

            <li
              className={`${
                (profiles?.profiles.length ?? 0)> 1
                  ? "-mx-4 border-t border-t-gray-500"
                  : ""
              }`}
            ></li>

            <li>
              <Link
                className={`cursor-pointer hover:underline`}
                to="/ManageProfiles"
              >
                Manage Profiles
              </Link>
            </li>
            <li>Tranfer Profile</li>
            <li>Account</li>
            <li>Help Center</li>
            <li
              onClick={signOutOFNetflix}
              className="-mx-4 cursor-pointer border-t border-t-gray-500 px-4 pt-2 hover:underline"
            >
              Sign Out
            </li>
          </ul>
        ) : null}
      </section>
    </>
  );
}
