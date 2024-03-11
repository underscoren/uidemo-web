import { Outlet, useLoaderData } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../app.sass"

export default function Root() {
    const sessionData = useLoaderData();

    return (
        <>
            <section className="section">
                <Navbar isLoggedIn={!!sessionData}/>
                <Outlet context={sessionData} />
            </section>
        </>
    )
}