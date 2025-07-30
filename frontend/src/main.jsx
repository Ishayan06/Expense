import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";

import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Credit from "./pages/Credit.jsx";
import Debit from "./pages/Debit.jsx";
import ExpenseContextProvider from "./context/ExpenseContext.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "app",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "credit", element: <Credit /> },
      { path: "debit", element: <Debit /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ExpenseContextProvider>
      <RouterProvider router={router} />
    </ExpenseContextProvider>
  </StrictMode>
);
