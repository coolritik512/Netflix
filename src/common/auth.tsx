// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBY6_-xOqqp8E2VEhSgwTAbRAjuEU533-U",
  authDomain: "netflix-b9526.firebaseapp.com",
  projectId: "netflix-b9526",
  storageBucket: "netflix-b9526.appspot.com",
  messagingSenderId: "1063439248135",
  appId: "1:1063439248135:web:979ebab6f9e789178673a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

type AuthContextType = ReturnType<typeof useProviderAuth>;

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext) ?? ({} as AuthContextType);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const auth: AuthContextType = useProviderAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

function useProviderAuth() {

  // current user => null
  // 1. firebase is still fetching the info . async operation
  // when user is logged out
   
  const [user, setUser] = useState<any | null>(null);
  const [loading,setloading] = useState(true);

  const signUp = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password).then((user) => {
      setUser(user)
      return user;
    });

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password).then((user) => {
      setUser(user)
      return user;
    });

  const signOutUser = () => signOut(auth);

  useEffect(() => {
    const unsubsribe = onAuthStateChanged(auth, (user) => {
      setloading(false);
      user ? setUser(user) : setUser(null);
    }); 

    return () => {
      unsubsribe();
    };
  });

  return {
    signIn,
    signOutUser,
    signUp,
    user, //,h:console.log('userprovide auth e')
    loading,
  };
}
