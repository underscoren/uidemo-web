import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, LoaderFunction, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import ErrorPage from './error-page';
import Login, { action as loginAction } from './routes/Login';
import Index from './routes/Index';
import Cookies from 'js-cookie';
import Register, { action as registerAction } from './routes/Register';
import Profile, { loader as profileLoader } from './routes/Profile';

const sessionDataLoader: LoaderFunction = async () => {
  const sessionCookie = Cookies.get("session");
  if(!sessionCookie)
    return null;

  try {
    const sessionResponse = await fetch("/api/session", {
      headers: {
        "Cookie": "session="+sessionCookie
      }
    });

    const sessionData = await sessionResponse.json();
    if(!sessionData)
      return null;

    return sessionData;
  } catch (error) {
    console.error("Error loading session data");
    console.error(error);
    return null;
  }

  return null;
}


const router = createBrowserRouter([{
  path: "/",
  element: <Root />,
  errorElement: <ErrorPage />,
  loader: sessionDataLoader,
  children: [
    {
      path: "/",
      element: <Index />,
      index: true
    },
    {
      path: "login",
      element: <Login />,
      action: loginAction
    },
    {
      path: "register",
      element: <Register />,
      action: registerAction
    },
    {
      path: "profile",
      element: <Profile />,
      loader: profileLoader
    }
  ]
},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
