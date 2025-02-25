import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddTask from "./Component/AddTask";
import AllTask from "./Component/AllTask";
import ErrorPage from "./Component/ErrorPage";
import Login from "./Component/Login";
import Task from "./Component/Task";
import "./index.css";
import LayOut from "./LayOut/LayOut";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import AuthProvider from "./Providers/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayOut></LayOut>,
    children: [
      {
        path: "/",
        element: <Login></Login>,
      },
      {
        path: "/tasks",
        element: <PrivateRoute><Task></Task></PrivateRoute>,
      },
      {
        path: "/all-task",
        element: <PrivateRoute><AllTask></AllTask></PrivateRoute>,
      },
      {
        path: "/add-task",
        element: <PrivateRoute><AddTask></AddTask></PrivateRoute>,
      }
    ]
  },
  {
    path: "*",
    element: <ErrorPage></ErrorPage>
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
