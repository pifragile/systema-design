export default function NewsItem({ title, link, imageSrcs }) {
    return (
        <div className="newsItem">
            <a className="newsTitle" href={link}>
                {title}
            </a>
            {imageSrcs.map((src) => (
                <a href={link}>
                    <img className="newsImage" src={`/news/${src}`} />
                </a>
            ))}
            <div className="newsSeparator"></div>
        </div>
    );
}
