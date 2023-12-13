# CIS-4500: Penn.gg
![Screenshot 2023-12-13 004820](https://github.com/hwisangcho00/CIS-4500_League_Simulator/assets/81304520/76b05c95-5226-4ed1-a6ad-e0ebf1012a38)

## How to Run
Open two terminals, one for the client and one for the server. Then, execute the following commands.

Server terminal:
```
cd server
npm install
npm start
```
Client terminal:
```
cd client
npm install
npm start
```

## What is League Simulator?
* League of Legends is a competitive 5v5 video game where players form teams of five
and battle against each other, aiming to destroy the Nexus, a core structure located within the enemy's base. Over the past decade, the game has surged in popularity, amassing millions of players worldwide. With a diverse pool of 164 champions to choose from in each match, players can create over 3 quadrillion unique combinations of 10 champions.
* Victory hinges not only on the choice of champions but also on the synergy between them and the strategic selection of items. This has led players to ponder the ideal team composition that ensures a high win rate. However, the task is complex, as some champions demand a higher skill level than others. Consequently, a team composition that excels in higher ranks may underperform among lower-ranked players, and vice versa.
* Our ultimate goal is to develop a user-friendly game simulator that leverages extensive data from past matches. By inputting a selected champion, players can query historical data to receive recommendations on optimal team compositions and item choices that maximize the chances of winning. Additionally, the simulator can display a list of enemy champions that have historically diminished the win rate of the selected champion, aiding players in making strategic bans before the picking phase.

## What features are available?
* Upon selecting a champion, receive recommendations for a team composition that
ensures the highest win rate.
* Get suggestions for an opponent team composition that has historically exhibited the
lowest win rate, aiding players during the ban and pick phase.
* Obtain recommendations for the optimal item build for the chosen champion.
