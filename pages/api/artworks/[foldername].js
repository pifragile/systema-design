import parser from "xml2json";

export default async function handler(req, res) {
    const baseUrl = "https://twitter.fra1.digitaloceanspaces.com/";
    const { foldername } = req.query;

    const response = await fetch(baseUrl);
    const listing = parser.toJson(await response.text(), { object: true });

    let keys = listing.ListBucketResult.Contents;
    keys = keys
        .filter((e) => e.Key.startsWith(foldername) && e.Key.includes("."))
        .map((e) => baseUrl + e.Key);
    res.status(200).json(keys);
}
