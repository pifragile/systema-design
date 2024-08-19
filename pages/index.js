import Head from "next/head";
import { useEffect, useState } from "react";
import SeriesBox from "../components/SeriesBox";

export default function Home() {
    const [artworks, setArtworks] = useState({});

    const [counter, setCounter] = useState(1);
    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prevCount) => (prevCount % 7) + 1);
        }, 500);
        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        async function action() {
            console.log("action");
            const response = await fetch(`/api/artworks/`);

            const data = await response.json();
            setArtworks(data);
        }
        action();
    }, []);

    if (Object.keys(artworks).length > 0) {
        return (
            <div>
                <Head>
                    <title>Systema Design</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <img
                        src="/4.png"
                        style={{
                            width: "min(350px, 61vw)",
                            marginBottom: "12vh",
                        }}
                    />
                </div>

                <div style={{ fontSize: "min(2.8vw, 15px)" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "top",
                            flexDirection: "column",
                            height: "8lh",
                        }}
                    >
                        <div>
                            {Array(counter)
                                .fill(0)
                                .map((_) => (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        design made by algorithms
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            flexDirection: "column",
                            marginBottom: "6vh",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <a href="mailto:piero@systema-design.com">
                                <b>{">"}piero@systema-design.com</b>
                            </a>
                        </div>
                    </div>
                </div>
                {Object.keys(artworks)
                    .sort()
                    .map((k) => (
                        <div className="seriesContainer" key={k}>
                            {artworks[k].map((p) => (
                                <SeriesBox data={p} key={p.identifier} />
                            ))}
                        </div>
                    ))}
            </div>
        );
    }
}
