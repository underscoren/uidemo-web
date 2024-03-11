import { LoaderFunction, useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import Cookie from "js-cookie"

export const loader: LoaderFunction = async () => {
    const sessionCookie = Cookie.get("session");
    if(!sessionCookie)
        return null;

    try {
        const profileResp = await fetch("http://localhost:3000/api/user", {
            headers: {
                "Cookie": "session="+sessionCookie
            }
        });

        const profileData = await profileResp.json();
        console.log("profileData",profileData);
        return profileData;
    } catch (error) {
        console.error("Error loading profile");
        console.error(error);
        return null;
    }
}


export default function Profile() {
    const navigate = useNavigate();
    
    type ProfileData = {
        username: string;
        name: string;
        email: string;
        university: string;
        subject: string;
    }
    
    const profileData = useLoaderData() as ProfileData | null;

    const sessionData = useOutletContext();
    useEffect(() => {
        if(!sessionData)
            navigate("/login");
    });

    return (
        <>
            <section className="section">
                <div className="content">
                    <h1 className="title">Profile</h1>

                    <div className="box max-width-450">
                    {profileData ? 
                    <>
                        <label className="label">Username</label>
                        <p>{profileData.username}</p>
                        <label className="label">Password</label>
                        <p>***</p>
                        <label className="label">Name</label>
                        <p>{profileData.name}</p>
                        <label className="label">Email</label>
                        <p>{profileData.email}</p>
                        <label className="label">University</label>
                        <p>{profileData.university}</p>
                        <label className="label">Subject</label>
                        <p>{profileData.subject}</p>
                    </>
                    :
                    <div className="notification is-text-danger">
                        <p>Error loading profile data.</p>
                    </div>
                    }
                    </div>
                </div>
            </section>
        </>
    )
}
