const { getData } = require("./callWebsocketController")
const { refactoreMe1, refactoreMe2 } = require("./surveysController")

const controllers = {}

controllers.survey = {refactoreMe1, refactoreMe2}
controllers.attacks = {getData}
module.exports = controllers