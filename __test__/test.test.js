const app = require('../dist/app').default;
const request = require('supertest');

// afterEach(() => {
//   app.close();
// });
describe("GET /fetchData", () => {
  test("respond with json containing a list of all data", function (done) {
    request(app)
      .get("/fetchData")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
describe("POST /calculate", () => {
  let data = {
    shape: "triangle",
    dimension: {
      a: 5,
      b: 5,
      c: 6,
    },
  };
  let data2 = {
    shape: "triang",
    dimension: {
      a: 5,
      b: 5,
      c: 6,
    },
  };
  test("respond with 200 OK", (done) => {
    request(app)
      .post("/calculate")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201, done);
  });

  test("respond with 400 bad response", function (done) {
    request(app)
      .post("/calculate")
      .send(data2)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(
        `That shape is not allowed. Enter a valid shape ( circle, square, rectangle, triangle)`
      )
      .expect(400, done);
  });
});