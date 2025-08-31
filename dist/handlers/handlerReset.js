import { config } from "../config.js";
export function handlerReset(req, res) {
    config.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("Hits reset to 0");
}
// export const handlerReset = (req: Request, res: Response) => {
//   config.fileserverHits = 0;
//   res.set("Content-Type", "text/plain; charset =utf-8");
//   res.status(200).send("Hits reset to 0");
// };
