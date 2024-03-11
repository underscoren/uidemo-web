import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export type NavbarProps = {
    isLoggedIn?: boolean
}

export default function Navbar(props: NavbarProps) {
    const navigate = useNavigate();

    async function handleLogout() {
        const sessionCookie = Cookies.get("session");
        if(!sessionCookie)
          return null;
      
        try {
          const logoutResponse = await fetch("/api/logout", {
            headers: {
              "Cookie": "session="+sessionCookie
            }
          });
      
          const logoutData = await logoutResponse.json();
          if(!logoutData)
            throw new Error("logout response did not contain expected data");
      
        } catch (error) {
          console.error("Error logging out");
          console.error(error);
        }

        Cookies.remove("session");
        navigate("/");
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-menu">
                    <div className="navbar-start">
                        <Link to="/" className="navbar-item">Home</Link>
                        <Link to="/about" className="navbar-item">About</Link>
                    </div>
                </div>
                <div className="navbar-end">
                    {props.isLoggedIn ? 
                    <>
                        <div className="navbar-item">
                            <Link to="/profile" className="button is-primary">Profile</Link>
                        </div>
                        <div className="navbar-item">
                            <button onClick={handleLogout} className="button is-secondary">Logout</button>
                        </div>
                    </>
                    :
                    <>
                        <div className="navbar-item">
                            <Link to="/login" className="button is-primary">Login</Link>
                        </div>
                        <div className="navbar-item">
                            <Link to="/register" className="button is-secondary">Register</Link>
                        </div>
                    </>
                    }
                </div>
            </nav>
        </>
    )
}
