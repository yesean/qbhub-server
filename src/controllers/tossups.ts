import { Request, Response } from 'express';
import { error } from '../utils/logger';
import { getTossups } from '../models/tossups';
import { parseTossupQueryString, ParsingError } from './utils';

const tossupsRouter = require('express').Router();

tossupsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { categories, subcategories, difficulties, text, answer, limit } =
      parseTossupQueryString(req.query);
    const data = await getTossups(
      categories,
      subcategories,
      difficulties,
      text,
      answer,
      limit,
    );
    const tossups = data.rows;
    res.json(tossups);
  } catch (e) {
    if (e instanceof ParsingError) res.status(400).send(e.message);
    else error(e);
  }
});

export default tossupsRouter;
