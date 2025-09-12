import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function handlerReset(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("Reset endpoint called, platform:", config.platform);
    if (config.platform !== "dev") {
      return res.status(403).json({ error: "Forbidden" });
    }

    console.log("Starting user deletion using direct psql command...");
    // Use direct psql command to bypass any connection pool issues
    const { stdout, stderr } = await execAsync(
      `psql "${config.db.url}" -c "DELETE FROM users;"`
    );

    if (stderr) {
      console.error("psql stderr:", stderr);
    }
    console.log("psql output:", stdout);
    console.log("User deletion completed");

    return res.status(200).json({ message: "All users deleted" });
  } catch (err) {
    console.error("Error in reset handler:", err);
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
