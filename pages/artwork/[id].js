import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
    const router = useRouter();
    const foldername = router.query.id;

    const [images, setImages] = useState([]);

    useEffect(() => {
        async function action() {
            const response = await fetch(`/api/artworks/${foldername}`);

            setImages(await response.json());
        }
        action();
    }, [foldername]);

    if (images.length > 0) {
        return (
            <div>
                <Head>
                    <title>{foldername}</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className="imageContainer">
                    {images.map((s) => (
                        <a href={s}>
                            <img className="artworkImage" src={s} key={s} />
                        </a>
                    ))}
                </div>
            </div>
        );
    }
}
