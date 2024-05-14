import { Request, Response } from 'express';

export function handleStatus(_: Request, res: Response) {
    return res.json({ ok: true });
  }