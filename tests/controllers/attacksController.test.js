const db = require("../../app/models/database");
const { getData } = require("../../app/controllers/callWebsocketController");

describe("getData", () => {
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

  it("should return the correct data when query is successful", async () => {
    const mockQueryResults = [
      { sourcecountry: "BR", total: "417" },
      { sourcecountry: "US", total: "15" },
      { sourcecountry: "AZ", total: "14" },
      { sourcecountry: "SG", total: "14" },
      { sourcecountry: "CN", total: "9" },
      { sourcecountry: "HU", total: "9" },
      { sourcecountry: "BG", total: "7" },
      { sourcecountry: "JP", total: "7" },
      { sourcecountry: "BH", total: "2" },
      { sourcecountry: "DE", total: "2" },
      { sourcecountry: "AE", total: "0" },
      { sourcecountry: "CA", total: "0" },
      { sourcecountry: "DZ", total: "0" },
      { sourcecountry: "GB", total: "0" },
      { sourcecountry: "IL", total: "0" },
      { sourcecountry: "TH", total: "0" },
    ];

    // Mock implementasi untuk query ke database
    jest.spyOn(db.sequelize, "query").mockResolvedValue(mockQueryResults);

    await getData(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      statusCode: 200,
      message: "success",
      data: {
        label: ["BR","US","AZ","SG","CN","HU","BG","JP","BH","DE","AE","CA","DZ","GB","IL","TH"],
        total: [417, 15, 14, 14, 9, 9, 7, 7, 2, 2, 0, 0, 0, 0, 0, 0],
      },
    });
  });

  it("should handle errors correctly", async () => {
    jest.spyOn(db.sequelize, "query").mockRejectedValue(new Error("Database error"));
    await getData(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      statusCode: 500,
      message: "internal server error.",
    });
  });
});
