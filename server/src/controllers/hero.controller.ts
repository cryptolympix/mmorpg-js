import { Request, Response } from "express";
import { database, HeroSchema } from "../database";

export function getHero(req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("Missing id");
    return;
  }
  const { id } = req.params;
  database
    .getData(`/heroes/${id}`)
    .then((hero) => {
      res.status(200).json(hero);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
}

export function getHeroes(req: Request, res: Response) {
  database
    .getData("/heroes")
    .then((heroes) => {
      res.status(200).json(heroes);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
}

export function createHero(req: Request, res: Response) {
  const hero: HeroSchema = req.body;
  const id = Date.now();
  database
    .push(`/heroes/${id}`, hero)
    .then(() => {
      res.status(201).json({ id });
    })
    .catch((error) => {
      res.status(400).send(error);
    });
}

export function updateHero(req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("Missing id");
    return;
  }
  const { id } = req.params;
  const hero: HeroSchema = req.body;
  database
    .push(`/heroes/${id}`, hero, false)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(400).send(error);
    });
}

export function deleteHero(req: Request, res: Response) {
  if (!req.params.id) {
    res.status(400).send("Missing id");
    return;
  }
  const { id } = req.params;
  database
    .delete(`/heroes/${id}`)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(404).send(error);
    });
}

export function deleteHeroes(req: Request, res: Response) {
  database
    .delete("/heroes")
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(404).send(error);
    });
}
