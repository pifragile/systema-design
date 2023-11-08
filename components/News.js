import NewsItem from "./NewsItem";

export default function News() {
    return (
        <div>
            <div className="header">news</div>
            <br/>
            <br/>
            <div className="newsContainer">
                <NewsItem
                    title="I am part of the Expanded Cinema Exhibition at Kurzfilmtage Winterthur. Opening Nov 9 2022."
                    link="https://www.oxydart.ch/de/ausstellungen/843/EXPANDED-CINEMA-KURZFILMTAGE-X-OXYD.html"
                    imageSrcs={["winti.png", "winti01.jpeg"]}
                />

                <NewsItem
                    title="I published an article about my first year as a generative artist."
                    link="https://medium.com/@pifragile/nfts-art-and-tears-what-my-first-year-as-a-generative-art-rookie-felt-like-and-what-you-can-learn-500ebfc4c233"
                    imageSrcs={["pifragile.png"]}
                />

                <NewsItem
                    title="My piece 0xZae was featured in the Doomscroll exhibition in Zürich in July, 2022."
                    link="https://ensoie.com/en/news/doomscroll"
                    imageSrcs={["zae.png", "doomscrollOpening.jpeg"]}
                />

                <NewsItem
                    title="My piece Cosmic Sun N001 was feaured in the NFT Art Week Shenzhen 2021"
                    imageSrcs={[
                        "shenzhen/shenzen.jpg",
                        "shenzhen/CosmicSunN001.png",
                        "shenzhen/shenzhen1.jpg",
                    ]}
                />
            </div>
        </div>
    );
}
