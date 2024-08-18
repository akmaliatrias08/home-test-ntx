const Attacks = require("./attacks");
const Surveys = require("./surveys");
const Users = require("./users");

const model = {}
model.user = Users
model.survey = Surveys
model.attacks = Attacks

module.exports = model