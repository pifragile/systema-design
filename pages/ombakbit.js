import Head from "next/head";
import { useEffect, useState } from "react";
import SeriesBox from "../components/SeriesBox";
import News from "../components/News";

export default function Home() {
    return (
        <div>
            <Head>
                <title>ombak bit</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <br></br>
            <div className="header">ombak bit</div>

            <div className="header">
                <img
                    src="https://ombakbit.fra1.cdn.digitaloceanspaces.com/cover.png"
                    style={{ width: "min(50vw, 400px)" }}
                ></img>
            </div>

            <div className="header">
                <img
                    src="https://ombakbit.fra1.cdn.digitaloceanspaces.com/coverHB.png"
                    style={{ width: "min(50vw, 400px)" }}
                ></img>
            </div>

            <div className="header" style={{ fontSize: "20px", flexDirection: "row" }}>
                <p>for inquiries: ombakbit at gmail.com</p>{" "}
            </div>
        </div>
    );
}
