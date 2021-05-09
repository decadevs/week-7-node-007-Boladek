const exported = require('../dist/app');
const request = require('supertest');
const database = require('../dist/database/database.json')

afterEach(() => {
    exported.close();
})

describe('GET /api/info', () => {
    it('respond with JSON containing a list of all information', done => {
        request(exported)
            .get('/api/info')
            .set('Accept', 'Application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET /api/info/:id', () => {
    it('responds with text information of ID not found', done => {
        request(exported)
            .get("/api/info/idnonexisting")
            .set("Accept", "Application/json")
            .expect('Content-Type', /text/)
            .expect(400)
            .expect('Data with that id does not exist')
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});

describe('POST /api/info', () => {
    const data = {
        organization: "node ninja",
        createdAt: "2020-08-12T19:04:55.455Z",
        updatedAt: "2020-08-12T19:04:55.455Z",
        products: ["developers", "pizza"],
        marketValue: "90%",
        address: "sangotedo",
        ceo: "cn",
        country: "Taiwan",
        id: 1,
        noOfEmployees: 2,
        employees: ["james bond", "jackie chan"],
    };
    it('responds with 201 created', done => {
        request(exported)
            .post('/api/info')
            .send(data)
            .set('Accept', 'Application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});

describe('PUT /api/info/:id', () => {
    const data = {
      organization: "blah blah blah",
      address: "blah bleh",
    };
    it('responds with the information of the specified ID', done => {
        request(exported)
          .put(`/api/info/${parseInt(database[database.length - 1].id)}`)
          .send(data)
          .set("Accept", "Application/json")
          .expect("Content-Type", /json/)
          .expect(200, done);
    });
});

describe('DELETE /api/info/:id', () => {
    it('deletes the information of the specified ID', done => {
        request(exported)
            .delete(`/api/info/${parseInt(database[database.length - 1].id)}`)
            .set('Accept', 'Application/json')
            .expect('Content-Type', /text/)
            .expect(200, done);
    })
})
