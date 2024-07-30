import Head from "next/head";
import { useEffect, useState } from "react";
import SeriesBox from "../components/SeriesBox";

export default function Home() {
    const [artworks, setArtworks] = useState({});

    useEffect(() => {
        async function action() {
            const response = await fetch(`/api/artworks/`);

            const data = await response.json();
            console.log(data);
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
                <img src="/3.png" style={{ height: "min(250px, 20vw)" }} />

                {Object.keys(artworks).sort().map((k) => (
                    <div className="seriesContainer" key={k}>
                        {artworks[k].map((p) => (
                            <SeriesBox data={p} key={p.identifier} />
                        ))}
                    </div>
                ))}
                <div style={{margin: "2px"}}>
                <div className="header">Systema Generative Graphic Design</div>
                <div className="header">
                    For inquiries:&nbsp; <b>piero [at] systema-design.com</b>
                </div>
                </div>
            </div>
        );
    }
}
