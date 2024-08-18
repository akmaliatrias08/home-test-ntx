const { getData } = require("./callWebsocketController")
const { refactoreMe1, refactoreMe2 } = require("./surveysController")
const { register, login } = require("./usersController")

const controllers = {}

controllers.survey = {refactoreMe1, refactoreMe2}
controllers.attacks = {getData}
controllers.users = {register, login}

module.exports = controllers