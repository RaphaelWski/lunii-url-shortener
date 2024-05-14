import { log } from '@repo/logger';
import { Request, Response } from 'express';

export function handleNameMessage(req: Request, res: Response) {
  log(`name = ${req.params.name}`);
  return res.json({ message: `hello ${req.params.name}` });
}