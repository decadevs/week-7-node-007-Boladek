"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var express_1 = __importDefault(require("express"));
var data = require('./database/database.json');
var app = express_1.default();
app.use(express_1.default.json());
//Gets all files from database
app.get('/api/info', function (req, res) {
    res.send(data);
});
//Gets single files from database
app.get('/api/info/:id', function (req, res) {
    var info = data.find(function (item) { return item.id === parseInt(req.params.id); });
    if (!info) {
        return res.status(400).send("Data with that id does not exist");
    }
    res.send(info);
});
//Creates new file in the database
app.post('/api/info', function (req, res) {
    var num = 1;
    var infoId = data[data.length - 1].id;
    num += infoId;
    var info = {
        id: num,
        organization: req.body.organization,
        createdAt: new Date(),
        products: req.body.products,
        marketValue: req.body.marketValue,
        address: req.body.address,
        ceo: req.body.ceo,
        country: req.body.country,
        noOfEmployees: req.body.noOfEmployees,
        employees: req.body.employees
    };
    if (!info) {
        return res.status(400).send('Data is not correctly compiled');
    }
    data.push(info);
    // fs.writeFileSync('${}/database/database.json', JSON.stringify(data));
    writeDataToFile(__dirname + "/database/database.json", data);
    res.send(info);
});
//Updates an existing file in the database
app.put('/api/info/:id', function (req, res) {
    var info = data.find(function (item) { return item.id === parseInt(req.params.id); });
    if (!info) {
        return res.status(404).send('No information with such ID exist');
    }
    info.organization = req.body.organisation || info.organization;
    info.createdAt = req.body.createdAt;
    info.updatedAt = new Date();
    info.products = req.body.products || info.products;
    info.marketValue = req.body.marketValue || info.marketValue;
    info.address = req.body.address || info.address;
    info.ceo = req.body.ceo || info.ceo;
    info.country = req.body.country || info.country;
    info.noOfEmployees = req.body.noOfEmployees || info.noOfEmployees;
    info.employees = req.body.employees || info.employees;
    var index = data.findIndex(function (item) { return item.id === parseInt(req.params.id); });
    data[index] = __assign({ id: parseInt(req.params.id) }, info);
    writeDataToFile(__dirname + "/database/database.json", data);
    res.send(data[index]);
});
//Deletes an existing file in the database
app.delete('/api/info/:id', function (req, res) {
    var info = data.find(function (item) { return item.id === parseInt(req.params.id); });
    if (!info) {
        return res.status(404).send('No information with such ID exist');
    }
    var index = data.indexOf(info);
    data.splice(index, 1);
    writeDataToFile(__dirname + "/database/database.json", data);
    res.send("Successfully deleted that informtion");
});
var PORT = process.env.PORT || 9000;
var exported = app.listen(PORT, function () {
    console.log("Server dey listen at " + PORT);
});
function writeDataToFile(filename, content) {
    fs_1.default.writeFileSync(filename, JSON.stringify(content, null, 3), "utf8");
}
module.exports = exported;
