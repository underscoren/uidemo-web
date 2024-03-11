import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError() as any;
    console.error(error);

    return (
        <>
            <section className="section">
                <div className="container">
                    <h1 className="title">Error:</h1>
                    <p>{error.statusText ?? error.message ?? "An unexpected error occurred, please try again."}</p>
                </div>
            </section>
        </>
    )
}