const WebSocket = require("ws");
const axios = require("axios");
const db = require('../models/database')
const redis = require('redis')
const { promisify } = require('util');
const { get } = require("http");

const insertAttacks = async (data) => {
  // insert data to database
  for (const attack of data){
    await db.sequelize.query(
      `INSERT INTO attacks (sourceCountry, destinationCountry) VALUES (:sourceCountry, :destinationCountry)`, {
      replacements: {
        sourceCountry: attack.sourceCountry,
        destinationCountry: attack.destinationCountry
      }, 
      type: db.sequelize.QueryTypes.INSERT,
    })
  }

  return
}


exports.callmeWebSocket = async (server, redisClient) => {
  const wss = new WebSocket.Server({ server });
  await redisClient.connect();

  wss.on("connection", (ws) => {
    // Function to fetch data from the API
    const fetchData = async () => {
      
      try {
        //get data from redis
        const cacheKey = "attacksData:1"
        const cachedData = await redisClient.get(cacheKey)
        let isCached = false
        let attacks
        
        if (cachedData){
          isCached = true
          attacks = JSON.parse(cachedData)

          console.log('Data get from cache');
        } else {
          const response = await axios.get("https://livethreatmap.radware.com/api/map/attacks?limit=1");
          attacks = response.data.flat()

          //cache in redis
          const dataString = JSON.stringify(attacks)
          await redisClient.set(cacheKey, dataString, {EX: 240, NX: true})

          console.log('Data fetched from API, and cached');
        }

        //insert into database
        await insertAttacks(attacks)

        ws.send(JSON.stringify({
          isCached, 
          message: "Data successfully insert to DB"
        }))
      } catch (error) {
        console.error("Error fetching data:", error);
        ws.send(JSON.stringify({ error: "Failed to fetch data" }));
      }
    };

    // Initial fetch
    fetchData();

    // Set interval to fetch data every 3 minutes (180000 milliseconds)
    const intervalId = setInterval(fetchData, 180000);

    // Clear interval when client disconnects
    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(intervalId);
    });
  });
};

exports.getData = async (req, res) => {
  // do something
  try {
    const queryTotalByCountry = await db.sequelize.query(
      `SELECT DISTINCT sourceCountry, COUNT(CASE WHEN destinationCountry != '  ' THEN destinationCountry ELSE null END) as total 
      FROM attacks GROUP BY sourceCountry ORDER BY total DESC`, {
        type: db.sequelize.QueryTypes.SELECT
    })

    let sourceCountries = []
    let totalByCountries = []

    for (const value of queryTotalByCountry) {
      sourceCountries.push(value.sourcecountry)
      totalByCountries.push(Number(value.total))
    }

    const data = {
      label: sourceCountries,
      total: totalByCountries
    }

    res.status(200).send({
      success: true,
      statusCode: 200, 
      message: "success",
      data
    })
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      statusCode: 500,
      message: "internal server error.",
    });
  }
};
