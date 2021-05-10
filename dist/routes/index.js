"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var joi_1 = __importDefault(require("joi"));
var fs_1 = __importDefault(require("fs"));
var data = require('../../database/database.json');
var absolute = "database/database.json";
var router = express_1.default.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
var array = ["circle", "square", "rectangle", "triangle"];
function validateCircle(circle) {
    var Schema = joi_1.default.object({
        shape: joi_1.default.string().min(5).required(),
        dimension: joi_1.default.number().min(1).required(),
    });
    return Schema.validate(circle);
}
function validateRectangle(rectangle) {
    var Schema = joi_1.default.object({
        shape: joi_1.default.string().min(9).required(),
        dimension: joi_1.default.object().keys({
            length: joi_1.default.number().required(),
            breadth: joi_1.default.number().required()
        }).required()
    });
    return Schema.validate(rectangle);
}
function validateTriangle(triangle) {
    var Schema = joi_1.default.object({
        shape: joi_1.default.string().min(8).required(),
        dimension: joi_1.default.object().keys({
            a: joi_1.default.number().required(),
            b: joi_1.default.number().required(),
            c: joi_1.default.number().required()
        }).required()
    });
    return Schema.validate(triangle);
}
function validateSquare(square) {
    var Schema = joi_1.default.object({
        shape: joi_1.default.string().min(5).required(),
        dimension: joi_1.default.number().min(1).required(),
    });
    return Schema.validate(square);
}
router.get('/fetchData', function (req, res, next) {
    res.status(200).send(data);
});
router.post('/calculate', function (req, res, next) {
    var shape = array.find(function (item) { return item === req.body.shape.toLowerCase(); });
    if (!shape) {
        return res.status(400).send("That " + shape + " is not allowed. Enter a valid shape ( circle, square, rectangle, triangle)");
    }
    else if (shape === "circle") {
        var error = validateCircle(req.body).error;
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        req.body.area = Number(((Math.pow(parseInt(req.body.dimension), 2)) * Math.PI).toFixed(2));
    }
    else if (shape === "square") {
        var error = validateSquare(req.body).error;
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        req.body.area = parseInt(req.body.dimension) * parseInt(req.body.dimension);
    }
    else if (shape === "rectangle") {
        var error = validateRectangle(req.body).error;
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        req.body.area = parseInt(req.body.dimension.length) * parseInt(req.body.dimension.breadth);
    }
    else if (shape === "triangle") {
        var error = validateTriangle(req.body).error;
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        var periHalf = (parseInt(req.body.dimension.a) + parseInt(req.body.dimension.b) + parseInt(req.body.dimension.c)) / 2;
        req.body.area = Number((Math.sqrt(periHalf * (periHalf - req.body.dimension.a) * (periHalf - req.body.dimension.b) * (periHalf - req.body.dimension.c))).toFixed(2));
    }
    var info = {
        shape: req.body.shape.toLowerCase(),
        dimension: req.body.dimension,
        area: req.body.area,
        createdAt: new Date()
    };
    data.push(info);
    fs_1.default.writeFileSync(absolute, JSON.stringify(data, null, 3), "utf8");
    res.status(201).send(info);
});
exports.default = router;
