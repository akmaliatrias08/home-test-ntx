const db = require("../models/database");
const bcrypt = require("bcrypt");
const Users = require("../models/users");
const config  = require("../config/auth");
const jwt = require("jsonwebtoken");

const getUserByUsername = async (username) => {
    try {
       const [user] = await db.sequelize.query(
        `SELECT id, username, password FROM users WHERE username = :username`, 
        {
            replacements: {username},
            type: db.sequelize.QueryTypes.SELECT
        }
       )

       return user
    } catch (err) {
        console.log(err);
        throw new Error(err)
    }
}

const getUserByDigits = async (digits) => {
    try {
       const [user] = await db.sequelize.query(
        `SELECT digits FROM users WHERE digits = :digits`, 
        {
            replacements: {digits},
            type: db.sequelize.QueryTypes.SELECT
        }
       )

       return user
    } catch (err) {
        console.log(err);
        throw new Error(err)
    }
}

exports.register = async (req, res) => {
  try {
    const username = req.body.username || "";
    const password = req.body.password || "";
    const fullname = req.body.fullname || "";
    const digits = req.body.digits || "";
    const company = req.body.company || "";


    if (!username || !password || !fullname || !digits || !company) {
        res.status(400).send({
            success: false,
            statusCode: 400,
            message: "username, password, fullname, and digits required",
        });
        return
    }

    //check username exist 
    const isUsernameExist = await getUserByUsername(username)
    if(isUsernameExist){
        res.status(400).send({
            success: false,
            statusCode: 400,
            message: "username already exist",
        });
        return
    }

    //check digits exist
    const isDigitsExist = await getUserByDigits(digits)
    if(isDigitsExist){
        res.status(400).send({
            success: false,
            statusCode: 400,
            message: "digits already exist",
        });
        return
    }

    const user = new Users()
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);

    user.username = username
    user.fullname = fullname
    user.salt = salt
    user.digits = digits
    user.company = company

    const [result] = await db.sequelize.query(
        `INSERT INTO users (username, password, salt, fullname, digits, company) 
        VALUES (:username, :password, :salt, :fullname, :digits, :company) RETURNING *`, 
        {
            replacements: user, 
            type: db.sequelize.QueryTypes.INSERT
        }
    );

    res.status(201).send({
        success: true,
        statusCode: 201,
        message: "success",
        data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
        success: false,
        statusCode: 500,
        message: "internal server error",
    });
  }
};

exports.login = async(req, res) => {
    try {
        const username = req.body.username || ""
        const password = req.body.password || ""

        if(!username || !password){
            res.status(400).send({
                success: false,
                statusCode: 400,
                message: "username and password is required",
            });
            return
        }

        //check username is exist 
        const user = await getUserByUsername(username)

        if(!user){
            res.status(400).send({
                success: false,
                statusCode: 400,
                message: "username not found",
            });
            return
        }

        //validate password 
        console.log(user, "USER");
        
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            res.status(400).send({
                success: false,
                statusCode: 400,
                message: "incorrect password",
            });
            return
        }

        console.log(config.SECRET);
        
        const token = jwt.sign({ id: user.id }, config.secret, {expiresIn: '1d'});
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "success",
            data: {token},
        }); 
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            statusCode: 500,
            message: "internal server error",
        });
    }
};
