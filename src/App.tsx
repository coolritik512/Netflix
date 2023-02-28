import React, { lazy, Suspense } from "react";
import {
  createRoutesFromElements,
  Navigate,
  Outlet,
  redirect,
  RouterProvider,
  useNavigate,
} from "react-router";
import { createBrowserRouter, Link, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./common/auth";
const Layout = lazy(()=> import ("./components/Layout"));
const Loader = lazy(()=> import ("./components/loader"));
const ProfileProvider = lazy(()=> import ("./components/profileContext"));


const Browse = lazy(()=>import ("./pages/Browse"));


const Login = lazy(()=> import ("./pages/Login"));
const Profile = lazy(()=> import ("./pages/Profile"));
const Registration =  lazy(()=> import ("./pages/Registration"))

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  return children;
}

function AppRoute() {
  const { user, loading } = useAuth();
  
  const route = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
          errorElement = {<RouteError/>}
        >
          <Route index element={<Profile />}></Route>
          <Route
            path="/ManageProfiles"
            element={<Profile edit={true} />}
          ></Route>
          <Route path="/browse" element={<Layout />}>
            <Route index element={<Browse />} />
          </Route>
          {/* <Route path="/latest" element={<Layout />}>
            <Route index element={<h1>Latest</h1>} />
          </Route> */}
        </Route>

        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Registration/>}></Route>
      </>
    )
  );

  return loading? (
    <Loader/>
  ) : (
    <Suspense fallback={<Loader/>}>
          <RouterProvider router={route}></RouterProvider>
    </Suspense>
  );
}

function RouteError(){
  return <article className="grid place-content-center gap-2 p-4">
    <h1>THe page you are lookin does not exist</h1>
    <p>Browse more content <Link to='/browse' className="underline text-red-600" >here</Link> </p>
  </article>
}

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppRoute />
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
