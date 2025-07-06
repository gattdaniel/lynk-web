import "./App.css";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Room from "./pages/romm";
import PrivateChat from "./pages/PrivateChat";
import InboxList from "./components/InboxList";
export default function App() {
  const Login = lazy(() => import("./pages/login"));
  const Signup = lazy(() => import("./pages/signup"));
  const DepartmentPage = lazy(() => import("./pages/Privatedepartment"));
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <div>
                  <p className="text-white text-lg">Chargement...</p>
                </div>
              }
            >
              <Signup />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense
              fallback={
                <div>
                  <p className="text-white text-lg">Chargement...</p>
                </div>
              }
            >
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/room"
          element={
            <Suspense
              fallback={
                <div>
                  <p className="text-white text-lg">Chargement...</p>
                </div>
              }
            >
              <Room />
            </Suspense>
          }
        />
        <Route
          path="/departement/:nom"
          element={
            <Suspense
              fallback={
                <div>
                  <p className="text-white text-lg">Chargement...</p>
                </div>
              }
            >
              <DepartmentPage />
            </Suspense>
          }
        />
        <Route
          path="/chat/:uid"
          element={
            <Suspense
              fallback={
                <div>
                  <p className="text-white text-lg">Chargement...</p>
                </div>
              }
            >
              <PrivateChat />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}
