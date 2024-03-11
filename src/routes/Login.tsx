import { ActionFunction, Form, redirect, useActionData, useNavigate, useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const { username, password } = Object.fromEntries(formData);

    try {
        const loginResp = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            body: JSON.stringify({username, password}),
            headers: {
                "Content-Type": "application/json"
            }
        });
       
        const loginData = await loginResp.json();
        console.log("loginData",loginData);
        
        if(loginData.error)
            return {error: loginData.error};
        
        const expireDate = new Date(Date.now() + 24*60*60*1000);
        Cookies.set("session", loginData.session, { path: "/", expires: expireDate });
        
        return redirect("/");
        
    } catch (error) {
        console.error("Error while logging in");
        console.error(error);
    }
}

export default function Login() {
    const actionData = useActionData() as {error?: string} | undefined;
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const sessionData = useOutletContext();
    useEffect(() => {
        if(sessionData)
            navigate("/");

        if(actionData?.error)
            setErrorMessage(actionData.error);
    }, [sessionData, actionData, navigate]);

    return (
        <>
            <section className="section">
                <div className="content">
                    <h1 className="title">Login</h1>

                    <div className="box max-width-450">
                        <Form method="post" id="login-form">
                            <div className="field">
                                <label className="label">Username</label>
                                <input type="text" className="input" name="username" />
                            </div>
                            
                            <div className="field">
                                <label className="label">Password</label>
                                <input type="password" className="input" name="password" />
                            </div>

                            {<p className="has-text-danger">{errorMessage || "\xa0" /* non-breaking space */}</p>}

                            <div className="field">
                                <div className="control">
                                    <button className="button is-primary">Login</button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </section>
        </>
    )
}