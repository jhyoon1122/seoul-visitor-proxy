import axios from "axios";
import { parseStringPromise } from "xml2js";

export default async function handler(req, res) {
  const { apiKey = "7146505663676f6f3833484d725366", startIndex = 1, endIndex = 5 } = req.query;

  const url = `http://openapi.seoul.go.kr:8088/${apiKey}/xml/IotVdata018/${startIndex}/${endIndex}`;

  try {
    const xmlResponse = await axios.get(url);
    const json = await parseStringPromise(xmlResponse.data, { explicitArray: false });
    const result = json.IotVdata018;

    const rows = result.row
      ? Array.isArray(result.row)
        ? result.row
        : [result.row]
      : [];

    res.status(200).json({
      list_total_count: parseInt(result.list_total_count, 10),
      RESULT: result.RESULT,
      rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch or convert data." });
  }
}
