const db = require("../../app/models/database");
const { refactoreMe1 } = require("../../app/controllers/surveysController");

describe("refactoreMe1", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the totalSurveyValue on success", async () => {
    const mockResults = [
        { values: [ 100, 100, 90, 90, 100 ] },
        { values: [ 90, 100, 100, 80, 90 ] },
        { values: [ 80, 80, 80, 80, 80 ] },
    ];

    jest.spyOn(db.sequelize, "query").mockResolvedValue([mockResults]);

    await refactoreMe1(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      statusCode: 200,
      message: "success",
      data: [48, 46, 40, 0, 0, 0, 0, 0, 0, 0]
    });
  });

  it("should handle errors", async () => {
    const error = new Error("Database error");
    jest.spyOn(db.sequelize, "query").mockRejectedValue(error);

    await refactoreMe1(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      statusCode: 500,
      message: "error retrieving survey data.",
    });
  });
});
