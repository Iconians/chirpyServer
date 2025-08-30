import { Request, Response } from "express";

export const handlerReadiness = (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain");
  res.status(200).send("OK");
};
