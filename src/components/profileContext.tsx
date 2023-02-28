import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useAuth } from "../common/auth";
import { ActionType, ProfileContextType, UserProfile } from "../common/typo";
import ProfileReducer from "../reducer/ProfileReducer";

type StoredProfiles = Map<string, ProfileContextType>;

const LOCAL_STORAGE_KEY = "profiles";

const ProfileContext = createContext<ProfileContextType | null>(null);

const profileDispatchContext = createContext<React.Dispatch<ActionType> | null>(
  null
);

export default function ProfileProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const { user } = useAuth();

  const UserProfile = findProfile(user?.email as string);

  const [state, dispatch] = useReducer(ProfileReducer, UserProfile);

  useEffect(() => {
    if (user?.email) {
      if (state) {
        const StoredProfiles = getProfiles();
        StoredProfiles.set(user.email, state);
        updateProfiles(StoredProfiles);
      } else {
        dispatch({ type: "load", payload: UserProfile });
      }
    }
  }, [user?.email,state]);

  return (
    <ProfileContext.Provider value={state}>
      <profileDispatchContext.Provider value={dispatch}>
        {children}
      </profileDispatchContext.Provider>
    </ProfileContext.Provider>
  );
}

function getProfiles(): StoredProfiles {
  // get profiles for id over network or local Storage
  return new Map(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]"));
}

function findProfile(id: string) {
  const profiles = getProfiles();
  return id ? profiles.get(id) ?? null : null;
}

export function updateProfiles(profiles: StoredProfiles) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(profiles)));
}

export const useProfileContext = () => useContext(ProfileContext);
export const useProfileDispatchContext = () =>
  useContext(profileDispatchContext) as React.Dispatch<ActionType>;
