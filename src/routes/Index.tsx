import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom"
import Cookies from "js-cookie";

export default function Index() {
    const sessionData = useOutletContext() as {userID: number, count: number} | null;
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        if(sessionData)
            setCounter(sessionData.count);
    }, [sessionData]);

    async function addOne() {
        try {
            const sessionCookie = Cookies.get("session");
            if(!sessionCookie)
                throw new Error("Session cookie does not exist");

            const countResponse = await fetch("http://localhost:3000/api/count", {
                method: "POST",
                headers: {
                    "Cookie": "session="+sessionCookie
                }
            });
            const countData = await countResponse.json();
            if(!countData || !countData.count)
                throw new Error("Count data does not have count");

            setCounter(countData.count);
        } catch (error) {
            console.error("Error adding count");
            console.error(error);
        }
    }

    return (
        <>
            <section className="hero">
                <div className="hero-body">
                    <p className="title">Home</p>
                </div>
            </section>
            <section className="section">
                <div className="container content">
                    <p>Welcome to the home page</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis quod, officia quis nobis ad animi doloribus vel similique aperiam aliquam. At adipisci praesentium fugit, qui dolor veritatis rerum suscipit ullam!</p>
                    <p>some more text</p>
                    {sessionData ? 
                    <>
                    <h2>Counter:</h2>
                    <p>{counter}</p>
                    <button onClick={addOne} className="button">Add One</button>
                    </>
                    :
                    null
                    }
                </div>
            </section>
        </>
    )
}