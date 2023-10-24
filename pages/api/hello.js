import db from "../../lib/db";

export default async function handler(req, res) {
    let abc = await db.getAll();
    res.status(200).json({ text: "Hello" + process.env.VAR0 + abc[0].eis });
}
