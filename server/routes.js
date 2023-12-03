const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type => LEFT FOR BASIC TESTING
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Joseph Cho';
  const pennKey = 'hwisang';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'

    res.send(`Created by ${pennKey}`);


  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}

// Simple Testing Route : GET /random
const random = async function(req, res) {
  connection.query(`
    SELECT champion_name FROM Champion
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        champion_name : data[0].champion_name,
      });
    }
  });
}

/**
 * Query 7.	Calculate the win rate for each champion (each champion can be distinguished by the unique champion_id) 
 * and return the list of champions and their respective win rates in descending order (the champion with the highest win rate appears first on the list).
 * 
 * Used Index to optimize the efficiency of the query
 */

const winrate_champion = async function(req, res) {
  connection.query(`
    SELECT champion_id, COUNT(DISTINCT game_id) AS total_games_played, SUM(win) AS total_games_won, AVG(win) * 100 AS win_rate
    FROM Player
    GROUP BY champion_id
    ORDER BY win_rate DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

/**
 * Query 8.	Calculate the pick rate for each champion (that is, how many times that champion has been chosen to play in a game) 
 * and return the list of champions and their respective pick rate in descending order 
 * (the champion with the highest pick rate appears first on the list).
 * 
 * Used Index to optimize the efficiency of the query
 */

const pickrate_champion = async function(req, res) {
  connection.query(`
    WITH TotalGames AS (
      SELECT COUNT(DISTINCT game_id) AS total_games
      FROM Game
    ),
    GamesPlayedByChampion AS (
        SELECT champion_id, COUNT(DISTINCT game_id) AS total_games_played
        FROM Player
        GROUP BY champion_id
    )
    SELECT GPC.champion_id, c.champion_name, (CAST(GPC.total_games_played AS DECIMAL) / TG.total_games) * 100 AS pick_rate
    FROM GamesPlayedByChampion GPC
    CROSS JOIN TotalGames TG
    JOIN Champion c ON GPC.champion_id = c.champion_id
    ORDER BY pick_rate DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

/**
 * Query 10. Calculate the winrates for each item, also returning some of the information about each item.
 * 
 * Used Index to optimize the efficiency of the query
 */

const winrate_item = async function(req, res) {
  connection.query(`
    WITH slot0 AS (
      SELECT
          p.stats_item0 AS item_id,
          COUNT(*) AS total_games,
          SUM(p.win) AS wins
      FROM
          Player p
      WHERE
          p.stats_item0 <> 0 AND p.stats_item0 is NOT NULL
      GROUP BY
          p.stats_item0
  ),
  slot1 AS (
      SELECT
          p.stats_item1 AS item_id,
          COUNT(*) AS total_games,
          SUM(p.win) AS wins
      FROM
          Player p
      WHERE
          p.stats_item1 <> 0 AND p.stats_item1 is NOT NULL
      GROUP BY
          p.stats_item1
  ),
  slot2 AS (
      SELECT
          p.stats_item2 AS item_id,
          COUNT(*) AS total_games,
          SUM(p.win) AS wins
      FROM
          Player p
      WHERE
          p.stats_item2 <> 0 AND p.stats_item2 is NOT NULL
      GROUP BY
          p.stats_item2
  ),
  slot3 AS (
      SELECT
          p.stats_item3 AS item_id,
          COUNT(*) AS total_games,
          SUM(p.win) AS wins
      FROM
          Player p
      WHERE
          p.stats_item3 <> 0 AND p.stats_item3 is NOT NULL
      GROUP BY
          p.stats_item3
  ),
  slot4 AS (
      SELECT
          p.stats_item4 AS item_id,
          COUNT(*) AS total_games,
          SUM(p.win) AS wins
      FROM
          Player p
      WHERE
          p.stats_item4 <> 0 AND p.stats_item4 is NOT NULL
      GROUP BY
          p.stats_item4
  ),
  slot5 AS (
      SELECT
          p.stats_item5 AS item_id,
          COUNT(*) AS total_games,
          SUM(p.win) AS wins
      FROM
          Player p
      WHERE
          p.stats_item5 <> 0 AND p.stats_item5 is NOT NULL
      GROUP BY
          p.stats_item5
  ),
  allSlotsUnion AS (
      (SELECT * FROM slot0) UNION (SELECT * FROM slot1) UNION (SELECT * FROM slot2) UNION (SELECT * FROM slot3) UNION
      (SELECT * FROM slot4) UNION (SELECT * FROM slot5)
  ),
  allSlots AS (
      SELECT item_id, SUM(total_games) as total_games, SUM(wins) as wins
      FROM allSlotsUnion
      GROUP BY item_id
  )
  SELECT
      allSlots.item_id,
      i.item_name,
      i.item_explain,
      allSlots.total_games,
      allSlots.wins,
      (allSlots.wins * 100.0 / NULLIF(allSlots.total_games, 0)) AS win_rate
  FROM
      allSlots Join Item i ON allSlots.item_id = i.item_id
  ORDER BY
      win_rate DESC, total_games DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /song/:song_id
const song = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Hint: unlike route 2, you can directly SELECT * and just return data[0]
  // Most of the code is already written for you, you just need to fill in the query
  connection.query(`
    SELECT *
    FROM Songs
    WHERE song_id = '${req.params.song_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 4: GET /album/:album_id
const album = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  
  connection.query(`
    SELECT *
    FROM Albums
    WHERE album_id = '${req.params.album_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 5: GET /albums
const albums = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  
  connection.query(`
    SELECT *
    FROM Albums
    ORDER BY release_date DESC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 6: GET /album_songs/:album_id
const album_songs = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  connection.query(`
    SELECT song_id, title, number, duration, plays
    FROM Songs S
    WHERE album_id = '${req.params.album_id}'
    ORDER BY number
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function(req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    connection.query(`
      SELECT S.song_id, S.title, A.album_id, A.title AS album, S.plays
      FROM Songs S JOIN Albums A ON S.album_id = A.album_id
      ORDER BY S.plays DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    
    const offset = (page - 1) * pageSize;

    connection.query(`
      SELECT S.song_id, S.title, A.album_id, A.title AS album, S.plays
      FROM Songs S JOIN Albums A ON S.album_id = A.album_id
      ORDER BY S.plays DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 8: GET /top_albums
const top_albums = async function(req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  
  if (!page) {
    connection.query(`
      SELECT A.album_id, A.title, SUM(S.plays) as plays
      FROM Albums A JOIN Songs S ON S.album_id = A.album_id
      GROUP BY A.album_id, A.title
      ORDER BY plays DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = (page - 1) * pageSize;

    connection.query(`
      SELECT A.album_id, A.title, SUM(S.plays) as plays
      FROM Albums A JOIN Songs S ON S.album_id = A.album_id
      GROUP BY A.album_id, A.title
      ORDER BY plays DESC 
      LIMIT ${pageSize} OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }

}

// Route 9: GET /search_albums
const search_songs = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const title = req.query.title ?? '';
  const durationLow = req.query.duration_low ?? 60;
  const durationHigh = req.query.duration_high ?? 660;
  const playsLow = req.query.plays_low ?? 0;
  const playsHigh = req.query.plays_high ?? 1100000000;
  const danceabilityLow = req.query.danceability_low ?? 0;
  const danceabilityHigh = req.query.danceability_high ?? 1;
  const energyLow = req.query.energy_low ?? 0;
  const energyHigh = req.query.energy_high ?? 1;
  const valenceLow = req.query.valence_low ?? 0;
  const valenceHigh = req.query.valence_high ?? 1;
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  connection.query(`
      SELECT *
      FROM Songs
      WHERE
        (title LIKE '%${title}%') AND
        (duration <= ${durationHigh} AND duration >= ${durationLow}) AND
        (plays <= ${playsHigh} AND plays >= ${playsLow}) AND
        (danceability <= ${danceabilityHigh} AND danceability >= ${danceabilityLow}) AND
        (energy <= ${energyHigh} AND energy >= ${energyLow}) AND
        (valence <= ${valenceHigh} AND valence >= ${valenceLow}) AND
        (explicit <= ${explicit})
      ORDER BY title
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
}

module.exports = {
  author,
  random,
  song,
  album,
  albums,
  album_songs,
  top_songs,
  top_albums,
  search_songs,
  winrate_champion,
  winrate_item,
  pickrate_champion,
}
