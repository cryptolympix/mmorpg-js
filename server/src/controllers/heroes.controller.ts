import { Request, Response } from "express";
import { database } from "../database";
import { HeroSchema } from "../../../shared/database.schemas";

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

  database.exists(`/heroes/${hero.id}`).then((exists) => {
    if (!exists) {
      database
        .push(`/heroes/${hero.id}`, hero)
        .then(() => {
          res.status(201).send(hero.id);
        })
        .catch((error) => {
          throw error;
        });
    } else {
      res.status(400).send("Hero id already exists");
    }
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
    .push(`/heroes/${id}`, hero, true)
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
