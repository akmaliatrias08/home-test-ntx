const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../server");
const config = require("../../app/config/auth");
const db = require("../../app/models/database");

describe("GET /api/data/attacks", () => {
  let validToken;
  let routeAttacks = "/api/data/attacks";

  beforeAll(() => {
    validToken = jwt.sign({ id: 1 }, config.secret, { expiresIn: "1d" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get(routeAttacks);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      statusCode: 401,
      success: false,
      message: "access denied",
    });
  });

  it("should return 400 if token is invalid", async () => {
    const invalidToken = "invalidtoken";

    const response = await request(app)
      .get(routeAttacks)
      .set("x-auth-token", invalidToken);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      success: false,
      message: "invalid token",
    });
  });

  it("should allow access when token is valid", async () => {
    const mockQueryResults = [
      { sourcecountry: "USA", total: "150" },
      { sourcecountry: "China", total: "120" },
    ];

    jest.spyOn(db.sequelize, "query").mockResolvedValue(mockQueryResults);

    const response = await request(app)
      .get(routeAttacks)
      .set("x-auth-token", validToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      statusCode: 200,
      message: "success",
      data: {
        label: ["USA", "China"],
        total: [150, 120],
      },
    });
  });
});
