import fs from 'fs';
import express, { Application, json, Request, Response } from 'express';
const data = require('./database/database.json');
const app: Application = express();
app.use(express.json());

interface Format {
    id?: number,
    organization: string,
    createdAt: Date,
    updatedAt?: Date,
    products: string[],
    marketValue: string,
    address: string,
    ceo: string,
    country: string,
    noOfEmployees: number,
    employees: string[]
}
//Gets all files from database
app.get('/api/info', (req: Request, res: Response) => {
    res.send(data);
})
//Gets single files from database
app.get('/api/info/:id', (req, res) => {
    const info = data.find((item: Format) => item.id === parseInt(req.params.id));
    if (!info) {
        return res.status(400).send("Data with that id does not exist")
    }
    res.send(info);
})
//Creates new file in the database
app.post('/api/info', (req: Request, res: Response) => {
    let num: number = 1;
    let infoId: number = data[data.length - 1].id;
    num += infoId;
    const info: Format = {
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
    }
    if (!info) {
        return res.status(400).send('Data is not correctly compiled');
    }
    data.push(info);
    // fs.writeFileSync('${}/database/database.json', JSON.stringify(data));
    writeDataToFile(`${__dirname}/database/database.json`, data);
    res.send(info);
});
//Updates an existing file in the database
app.put('/api/info/:id', (req: Request, res: Response) => {
    const info = data.find((item: Format) => item.id === parseInt(req.params.id));
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
    
    const index: number = data.findIndex((item: Format) => item.id === parseInt(req.params.id));
    data[index] = { id: parseInt(req.params.id), ...info };
    writeDataToFile(`${__dirname}/database/database.json`, data);
    res.send(data[index]);
});
//Deletes an existing file in the database
app.delete('/api/info/:id', (req: Request, res: Response) => {
    const info = data.find((item: Format) => item.id === parseInt(req.params.id));
    if (!info) {
        return res.status(404).send('No information with such ID exist');
    }
    const index = data.indexOf(info);
    data.splice(index, 1);
    writeDataToFile(`${__dirname}/database/database.json`, data);
    res.send("Successfully deleted that informtion");
});

const PORT = process.env.PORT || 19000;
const exported = app.listen(PORT, () => {
    console.log(`Server dey listen at ${PORT}`);
})

function writeDataToFile(filename: string, content: Format[]) {
  fs.writeFileSync(filename, JSON.stringify(content, null, 3), "utf8");
}

module.exports = exported;