const db = require("../models/database");

// function ini sebenarnya adalah hasil survey dri beberapa pertanyaan, yang mana nilai dri jawaban tsb akan di store pada array seperti yang ada di dataset
exports.refactoreMe1 = async (req, res) => {
  try {
    const [results] = await db.sequelize.query(`SELECT * FROM "surveys"`);
    console.log(results)
    const surveyValue = Array.from({ length: 10 }, () => []);

    results.forEach((e, index) => {
      surveyValue[index].push(...e.values);
    });

    const totalSurveyValue = surveyValue.map(indexArray => 
      indexArray.reduce((a, b) => a + b, 0) / 10
    );

    res.status(200).send({
      statusCode: 200,
      success: true,
      data: totalSurveyValue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      statusCode: 500,
      success: false,
      message: "Error retrieving survey data.",
    });
  }
};


// function ini untuk menjalakan query sql insert dan mengupdate field "dosurvey" yang ada di table user menjadi true, jika melihat data yang di berikan, salah satu usernnya memiliki dosurvey dengan data false
exports.refactoreMe2 = async (req, res) => {
  let { userId, values } = req.body;
  values = JSON.parse(values)

  try {
    const [result] = await db.sequelize.query(
      `INSERT INTO "surveys" ("userId", values) VALUES (:userId, ARRAY [:values]) RETURNING *`,
      {
        replacements: { userId, values},
        type: db.sequelize.QueryTypes.INSERT,
      }
    );

    await db.sequelize.query(
      `UPDATE "users" SET dosurvey = true WHERE id = :id`,
      {
        replacements: { id: userId },
        type: db.sequelize.QueryTypes.UPDATE,
      }
    );

    res.status(201).send({
      statusCode: 201,
      message: "Survey sent successfully!",
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      statusCode: 500,
      message: "Cannot post survey.",
      success: false,
    });
  }
};
