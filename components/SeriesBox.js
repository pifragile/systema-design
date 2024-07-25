export default function SeriesBox({ data }) {
    console.log(data)
    return <div className="seriesBox">
        
        <a href={data.url}><img className="seriesImage" src={data.url}></img></a>
        <div class="seriesText">
        <a href={data.url}>{data.name}</a>
        </div>
    </div>;
}
