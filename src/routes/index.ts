import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import fs from 'fs';
const data = require('../../database/database.json');
const absolute: string = '/Users/a/Desktop/Assignments/week-7-node-007-Boladek/database/database.json'
var router = express.Router();

interface Cirle {
  shape: string,
  dimension: number
}

interface Square {
  shape: string,
  dimension: number
}

interface Rectangle {
  shape: string,
  dimension: {
    length: number,
    breadth: number,
  }
}

interface Triangle {
  shape: string,
  dimension: {
    a: number,
    b: number,
    c: number
  }
}

interface Shape {
  shape: string,
  dimension: number,
  area: number,
  createdAt: Date,
}

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Express' });
});

const array: string[] = ["circle", "square", "rectangle", "triangle"];

function validateCircle(circle: Cirle) {
  const Schema = Joi.object({
    shape: Joi.string().min(5).required(),
    dimension: Joi.number().min(1).required(),
  })
  return Schema.validate(circle);
}

function validateRectangle(rectangle: Rectangle) {
  const Schema = Joi.object({
    shape: Joi.string().min(9).required(),
      dimension: Joi.object().keys({
          length: Joi.number(),
          breadth: Joi.number()
    }).required()
  })
  return Schema.validate(rectangle)
}

function validateTriangle(triangle: Triangle) {
  const Schema = Joi.object({
    shape: Joi.string().min(8).required(),
    dimension: Joi.object().keys({
      a: Joi.number(),
      b: Joi.number(),
      c: Joi.number()
    }).required()
  })
  return Schema.validate(triangle);
}

function validateSquare(square: Square) {
  const Schema = Joi.object({
    shape: Joi.string().min(5).required(),
    dimension: Joi.number().min(1).required(),
  })
  return Schema.validate(square);
}

router.get('/fetchData', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send(data);
});

router.post('/calculate', (req: Request, res: Response, next: NextFunction) => {
  const shape = array.find((item: string) => item === req.body.shape.toLowerCase());
  if (!shape) {
    return res.status(400).send("enter a valid shape")
  }
  else if (shape === "circle") {
    const {error} = validateCircle(req.body);
      if (error){
          res.status(400).send(error.details[0].message);
          return;
      }
    req.body.area = Number(((parseInt(req.body.dimension) ** 2) * Math.PI).toFixed(2));
  }
    
  else if (shape === "square") {
    const {error} = validateSquare(req.body);
      if (error){
          res.status(400).send(error.details[0].message);
          return;
      }
    req.body.area = parseInt(req.body.dimension) * parseInt(req.body.dimension);
  }

  else if (shape === "rectangle") {
    const {error} = validateRectangle(req.body);
      if (error){
          res.status(400).send(error.details[0].message);
          return;
      }
    req.body.area = parseInt(req.body.dimension.length) * parseInt(req.body.dimension.breadth);
  }

  else if (shape === "triangle") {
    const {error} = validateTriangle(req.body);
      if (error){
          res.status(400).send(error.details[0].message);
          return;
      }
    req.body.area = (parseInt(req.body.dimension.a) + parseInt(req.body.dimension.b) + parseInt(req.body.dimension.c)) / 2
  }
  
  const info: Shape = {
    shape: req.body.shape,
    dimension: req.body.dimension,
    area: req.body.area,
    createdAt: new Date()
  }

  data.push(info);
  
  fs.writeFileSync(absolute, JSON.stringify(data, null, 3), "utf8");

  res.status(201).send(info);
})

export default router;
