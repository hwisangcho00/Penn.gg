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
 * 
 * GET : /getBestTeammate/:championId/:lane
 * 
 * Query 1. Given a champion, choose five champions from each lane (TOP, MIDDLE, BOTTOM, JUNGLE) with the highest winning probability when played as a team
 * 
 */
const getBestTeammate = async function(req, res) {
  

  connection.query(`
    WITH champ_games AS (SELECT game_id AS gamenum, team_id AS teamnum
      FROM Player
      WHERE champion_id = ${req.params.championId}),
      team_champs AS (SELECT champion_id, win, timeline_lane
          FROM Player p JOIN champ_games c ON p.team_id = c.teamnum AND p.game_id = c.gamenum),
      prob_table AS (SELECT champion_id, SUM(win) AS wins, COUNT(*) AS total_games,
          SUM(win) / COUNT(*) AS win_probability
          FROM team_champs
          GROUP BY champion_id
          ORDER BY win_probability DESC),
      prob_table_name AS (
          SELECT p.*, C.champion_name
          FROM prob_table p JOIN Champion C ON p.champion_id = C.champion_id
          ),
      lanecount AS (
        SELECT ptn.champion_id,
                ptn.champion_name,
                ptn.win_probability,
                lc.lane,
                lc.count
        FROM prob_table_name ptn
        JOIN (
            SELECT
                champion_id,
                timeline_lane as lane,
                count(*) as count
            FROM team_champs
            WHERE timeline_lane <> 'NONE'
            GROUP BY champion_id, timeline_lane
            ORDER BY champion_id, count(*) DESC
        ) lc ON ptn.champion_id = lc.champion_id
        GROUP BY ptn.champion_id)
      SELECT *
      FROM lanecount
      WHERE lane = '${req.params.lane}' AND count > 10 AND champion_id <> ${req.params.championId}
      ORDER BY win_probability DESC
      LIMIT 5;
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
 * 
 * GET : /getTopOpponentsByLane/:championId/:lane
 * 
 * Query 2.	Given a champion, choose five champions from each lane with the highest losing probability 
 * when played as an opponent team
 * 
 * Used Index to optimize the efficiency of the query
 */
const getTopOpponentsByLane = async function(req, res) {
  connection.query(`
  WITH champ_games AS (SELECT game_id AS gamenum, team_id AS teamnum
    FROM Player
    WHERE champion_id = ${req.params.championId}),
    op_champs AS (SELECT champion_id, win, timeline_lane
    FROM Player p JOIN champ_games c ON p.team_id <> c.teamnum AND p.game_id = c.gamenum),
       prob_table AS (SELECT champion_id, SUM(win) AS wins, COUNT(*) AS total_games,
          SUM(win) / COUNT(*) AS win_probability
    FROM op_champs
    GROUP BY champion_id
    ORDER BY win_probability DESC),
    probs AS (
    SELECT p.*, C.champion_name
    FROM prob_table p JOIN Champion C ON p.champion_id = C.champion_id
    ),
    lanecount AS (
       SELECT
           pr.champion_id,
           pr.champion_name,
           pr.win_probability,
           lc.lane,
           lc.count
       FROM probs pr
       JOIN (
           SELECT
               champion_id,
               timeline_lane AS lane,
               count(*) AS count
           FROM op_champs
           WHERE timeline_lane <> 'NONE'
           GROUP BY champion_id, timeline_lane
           ORDER BY champion_id, count(*) DESC
       ) lc ON pr.champion_id = lc.champion_id
       GROUP BY pr.champion_id)
    SELECT *
    FROM lanecount
    WHERE lane = '${req.params.lane}' AND count > 10 AND champion_id <> ${req.params.championId}
    ORDER BY win_probability DESC
    LIMIT 5;
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
 * GET : /itemRecommendation/:championId
 * 
 * Query 3.	For a given champion_id, recommend the list of items by presenting them in order of highest winning probability to lowest when an item is purchased
 * 
 * Used Index to optimize the efficiency of the query
 */
const getItemRecommendation = async function(req, res) {
  connection.query(`
      WITH only_items AS (
        SELECT win, champion_id, stats_item0,stats_item1, stats_item2, stats_item3, stats_item4, stats_item5
        FROM Player
        WHERE champion_id = ${req.params.championId}
    ),
    champ_items AS (
        SELECT win, stats_item0 AS item FROM only_items WHERE stats_item0 <> 0
        UNION ALL
        SELECT win, stats_item1 FROM only_items WHERE stats_item1 <> 0
        UNION ALL
        SELECT win, stats_item2 FROM only_items WHERE stats_item2 <> 0
        UNION ALL
        SELECT win, stats_item3 FROM only_items WHERE stats_item3 <> 0
        UNION ALL
        SELECT win, stats_item4 FROM only_items WHERE stats_item4 <> 0
        UNION ALL
        SELECT win, stats_item5 FROM only_items WHERE stats_item5 <> 0
    ), item_recs AS (
        SELECT
            item,
            SUM(win) AS wins,
            COUNT(*) AS total,
            SUM(win) / COUNT(*) AS prob_wins
        FROM champ_items
        GROUP BY item
        HAVING COUNT(*) > 100
    )
    SELECT
        ir.*,
        i.item_name AS name
    FROM item_recs ir
    JOIN Item i ON ir.item = i.item_id
    ORDER BY prob_wins DESC;
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
 * GET : /teamCombination/:team1/:team2/:team3/:team4
 * 
 * Query 4.	Retrieve the number of games won and lost when five specific champions are played together on the same team.
 * 
 */
const getTeamCombination = async function(req, res) {
  connection.query(`
    SELECT
    COUNT(*) AS total_games,
    SUM(win) AS wins,
    (COUNT(*) - SUM(win)) AS losses
    FROM
      Player p
    WHERE
      p.champion_id IN (${req.params.team1}, ${req.params.team2},${req.params.team3}, ${req.params.team4})
    GROUP BY
      p.game_id, p.team_id
    HAVING
      COUNT(DISTINCT p.champion_id) = 5;
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
 * Query 5.	Calculate winrate for teams that have 1, 2, 3, 4, or 5 champions that are ranged on the team 
 * (trying to see how ranged champions influence winrate)
 * 
 * Used Index to optimize the efficiency of the query
 */

const ranged_winrate = async function(req, res) {
  connection.query(`
  SELECT
    champions_above_200,
    COUNT(*)                                                      AS total_games,
    SUM(win)                                                      AS wins,
    CAST(SUM(win) AS DECIMAL) / NULLIF(COUNT(*), 0) AS winrate
 FROM
    TeamAttackRange
 GROUP BY
    champions_above_200
 ORDER BY
    winrate DESC;
 
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
 * GET /champion_data/:championId
 * 
 * Query 6.	Show data for a certain champion (champion_id, name, average (kills, deaths, assists, largestKillingSpree, largestMultiKill, killingSprees, longestTimeSpentLiving)) 
 * 
 * Used Index to optimize the efficiency of the query
 */
const champion_data = async function(req, res) {
  connection.query(`
  WITH ChampionStats AS (
    SELECT
        p.champion_id,
        p.stats_kills,
        p.stats_deaths,
        p.stats_assists,
        p.stats_largestKillingSpree,
        p.stats_largestMultiKill,
        p.stats_killingSprees,
        p.stats_longestTimeSpentLiving
    FROM
        Player p
    WHERE
        p.champion_id = '${req.params.championId}'
  )
  SELECT
    AVG(p.stats_kills) AS avg_kills,
    AVG(p.stats_deaths) AS avg_deaths,
    AVG(p.stats_assists) AS avg_assists,
    AVG(p.stats_largestKillingSpree) AS avg_largestKillingSpree,
    AVG(p.stats_largestMultiKill) AS avg_largestMultiKill,
    AVG(p.stats_killingSprees) AS avg_killingSprees,
    AVG(p.stats_longestTimeSpentLiving) AS avg_longestTimeSpentLiving
  FROM
    ChampionStats as p
  GROUP BY
    champion_id; 
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}


/**
 * Query 7.	Calculate the win rate for each champion (each champion can be distinguished by the unique champion_id) 
 * and return the list of champions and their respective win rates in descending order (the champion with the highest win rate appears first on the list).
 * 
 * Used Calculate the win rate for each champion (each champion can be distinguished by the unique champion_id) 
 * and return the list of champions and their respective win rates in descending order (the champion with the highest win rate appears first on the list).Index to optimize the efficiency of the query
 */

const winrate_champion = async function(req, res) {

  const order = req.query.order ?? 0;

  const orderString = order === 0 ? "DESC" : "ASC";

  connection.query(`
  SELECT champion_id, win_rate
  FROM (
      SELECT
          champion_id,
          SUM(win) / COUNT(*) * 100 AS win_rate
      FROM Player
      WHERE champion_id = '${req.params.championId}'
      GROUP BY champion_id
  ) AS getWinrate
  ORDER BY win_rate ${orderString};
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

  const order = req.query.order ?? 0;

  const orderString = order === 0 ? "DESC" : "ASC";

  connection.query(`
    WITH TotalGames AS (
      SELECT COUNT(*) AS total_games
      FROM Game
    ),
    GamesPlayedByChampion AS (
        SELECT champion_id, COUNT(*) AS total_games_played
        FROM Player
        GROUP BY champion_id
    )
    SELECT GPC.champion_id, c.champion_name, (CAST(GPC.total_games_played AS DECIMAL) / TG.total_games) * 100 AS pick_rate
    FROM GamesPlayedByChampion GPC
    JOIN TotalGames TG
    JOIN Champion c ON GPC.champion_id = c.champion_id
    ORDER BY pick_rate ${orderString};
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
 * Query 9.	Calculate the win rate for each stat
 * 
 * Used Index to optimize the efficiency of the query
 */

const stat_winrate = async function(req, res) {
  connection.query(`
  SELECT 'firstBlood' AS stat, SUM(firstBlood = 1 AND win = 1) / SUM(firstBlood = 1) AS winrate
  FROM Team
  
  
  UNION
  
  
  SELECT 'firstTower' AS stat, SUM(firstTower = 1 AND win = 1) / SUM(firstTower = 1) AS winrate
  FROM Team
  
  
  UNION
  
  
  SELECT
     'firstInhibitor' AS stat, SUM(firstInhibitor = 1 AND win = 1) / SUM(firstInhibitor = 1) AS winrate
  FROM Team
  
  
  UNION
  
  
  SELECT
     'firstBaron' AS stat, SUM(firstBaron = 1 AND win = 1) / SUM(firstBaron = 1) AS winrate
  FROM Team
  
  
  UNION
  
  
  SELECT
     'firstDragon' AS stat, SUM(firstDragon = 1 AND win = 1) / SUM(firstDragon = 1) AS winrate
  FROM Team
  
  
  UNION
  
  
  SELECT
     'firstRiftHerald' AS stat, SUM(firstRiftHerald = 1 AND win = 1) / SUM(firstRiftHerald = 1) AS winrate
  FROM Team;
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

  const order = req.query.order ?? 0;

  const orderString = order === 0 ? "DESC" : "ASC";

  connection.query(`
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
      win_rate ${orderString}, total_games DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  random,
  getBestTeammate,
  getTopOpponentsByLane,
  getItemRecommendation,
  getTeamCombination,
  winrate_champion,
  winrate_item,
  pickrate_champion,
  champion_data,
  ranged_winrate,
  stat_winrate,
}
