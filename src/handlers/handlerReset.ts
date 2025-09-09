import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (config.platform !== "dev") {
      return res.status(403).json({ error: "Forbidden" });
    }

    await deleteUsers();
    return res.status(200).json({ message: "All users deleted" });
  } catch (err) {
    next(err);
  }
}

// export function handlerReset(req: Request, res: Response) {
//   config.fileserverHits = 0;
//   res.set("Content-Type", "text/plain; charset=utf-8");
//   res.status(200).send("Hits reset to 0");
// }

// export const handlerReset = (req: Request, res: Response) => {
//   config.fileserverHits = 0;
//   res.set("Content-Type", "text/plain; charset =utf-8");
//   res.status(200).send("Hits reset to 0");
// };
