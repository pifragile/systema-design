import parser from "xml2json";

export default async function handler(req, res) {
    const baseUrl = "https://systema.fra1.digitaloceanspaces.com/";

    const response = await fetch(baseUrl);
    const listing = parser.toJson(await response.text(), { object: true });

    let keys = listing.ListBucketResult.Contents;
    keys = keys
        .filter((e) => e.Key.includes("."))
        .reduce((acc, cur) => {
            let projectName = cur.Key.split("/")[0];
            acc[projectName] = acc[projectName] || [];
            cur.url = baseUrl + cur.Key
            acc[projectName].push(cur);
            return acc;
        }, {});

    
    res.status(200).json(keys);
}
