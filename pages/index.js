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

            let twitterScript = document.createElement("script");
            twitterScript.setAttribute(
                "src",
                "https://platform.twitter.com/widgets.js"
            );
            document.head.appendChild(twitterScript);
        }
        action();
    }, []);

    if (projects.length > 0) {
        return (
            <div>
                <Head>
                    <title>piero g.</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <br></br>
                <div className="header">
                  piero g.
                </div>
                <div className="header">
                    <a
                        className="twitter-follow-button"
                        href="https://twitter.com/pifragile?ref_src=twsrc%5Etfw"
                        data-show-count="false"
                    ></a>
                </div>

                <br></br>
                <div className="seriesContainer">
                    {projects.map((p) => (
                        <SeriesBox data={p} key={p.identifier} />
                    ))}
                </div>

                <News />
            </div>
        );
    }
}
