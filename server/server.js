const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
// app.get('/author/:type', routes.author);
// app.get('/random', routes.random);
// app.get('/song/:song_id', routes.song);
// app.get('/album/:album_id', routes.album);
// app.get('/albums', routes.albums);
// app.get('/album_songs/:album_id', routes.album_songs);
// app.get('/top_songs', routes.top_songs);
// app.get('/top_albums', routes.top_albums);
// app.get('/search_songs', routes.search_songs);

app.get('/random', routes.random);
app.get('/getBestTeammate/:championId/:lane', routes.getBestTeammate);
app.get('/getTopOpponentsByLane/:championId/:lane', routes.getTopOpponentsByLane);
app.get('/getItemRecommendation/:championId', routes.getItemRecommendation);
app.get('/getTeamCombination/:team1/:team2/:team3/:team4', routes.getTeamCombination);
app.get('/getWinrateChampion/:championId', routes.winrate_champion);
app.get('/getWinrateItem', routes.winrate_item);
app.get('/getPickrateChampion', routes.pickrate_champion);
app.get('/getchampionData/:championId', routes.champion_data);
app.get('/getRangedWinrate', routes.ranged_winrate);
app.get('/getStatWinrate', routes.stat_winrate);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
