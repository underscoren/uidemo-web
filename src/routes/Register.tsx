import { ActionFunction, Form, redirect, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import FormField from "../components/FormField";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const { username, password, name, email, university, subject } = Object.fromEntries(formData);

    try {
        const registerResp = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            body: JSON.stringify({username, password, name, email, university, subject}),
            headers: {
                "Content-Type": "application/json"
            }
        });
       
        const registerData = await registerResp.json();
        console.log(registerData);

        if(!registerData.userId)
            throw new Error("Register does not contain userId");
        
    } catch (error) {
        console.error("Error while logging in");
        console.error(error);
    }

    return redirect("/");
}

export default function Register() {
    const navigate = useNavigate();

    const sessionData = useOutletContext();
    useEffect(() => {
        if(sessionData)
            navigate("/");
    });

    return (
        <>
            <section className="section">
                <div className="content">
                    <h1 className="title">Register</h1>

                    <div className="box max-width-450">
                        <Form method="post" id="login-form">
                            <FormField name="username" label="Username" />
                            <FormField name="password" type="password" label="Password" />
                            <FormField name="name" label="Name" />
                            <FormField name="email" label="Email" />
                            <FormField name="university" label="University" />
                            <FormField name="subject" label="Subject" />

                            <div className="field">
                                <div className="control">
                                    <button className="button is-primary">Sign up</button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </section>
        </>
    )
}