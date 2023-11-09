import Head from "next/head";
import { useEffect, useState } from "react";
import SeriesBox from "../components/SeriesBox";
import News from "../components/News";

export default function Home() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function action() {
            const response = await fetch(
                "https://space.pifragile.com/pifragile/get-nfts/"
            );
            let series = await response.json();
            //series = series.slice(0,1)
            series.forEach((s) => {
                let sSet = s["nft_set"];
                s.imageUrl =
                    sSet[Math.floor(Math.random() * sSet.length)].media;
            });
            setProjects(series);
        }
        action();
    }, []);

    if (projects.length > 0) {
        return (
            <div>
                <Head>
                    <title>pifragile</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className="header">
                  pifragile
                </div>
                <div className="seriesContainer">
                    {projects.map((p) => (
                        <SeriesBox data={p} key={p.identifier}/>
                    ))}
                </div>

                <News/>
            </div>
            
        );
    }
}
