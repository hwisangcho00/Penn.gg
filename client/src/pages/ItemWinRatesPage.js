import React, { useEffect, useState } from 'react';
import backgroundImg from '../images/summoners_rift.png';

const config = require('../config.json');

export default function TeamWinLossPage() {
  const [teamWinLossData, setTeamWinLossData] = useState([]);

  useEffect(() => {
    const queryTeamWinLoss = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/getTeamCombination/1/2/3/4`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch team win/loss data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setTeamWinLossData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setTeamWinLossData(null);
      }
    };

    queryTeamWinLoss();
  }, []);

  return (
    <div style={{
      backgroundImage: `url(${backgroundImg})`,
      backgroundRepeat: 'repeat',
      backgroundSize: '1536px 864px',
      minHeight: '1300vh',
      width: '100%',
      height: 'auto',
      position: 'relative',
    }}>
      <div style={styles.overlay}>
        <div style={styles.container}>
          <h2 style={{ marginTop: '0px', fontSize: '50px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>Team Win/Loss Data</h2>
        </div>
        <div style={styles.tablesContainer}>
          {teamWinLossData && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Total Games</th>
                  <th style={{ textAlign: 'center' }}>Wins</th>
                  <th style={{ textAlign: 'center' }}>Losses</th>
                </tr>
              </thead>
              <tbody>
                {teamWinLossData.map((team, index) => (
                  <tr key={index}>
                    <td>{team.total_games}</td>
                    <td>{team.wins}</td>
                    <td>{team.losses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: '100px',
    height: '100px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  table: {
    textAlign: 'center',
    fontSize: '20px',
    fontFamily: 'leagueFontLight',
    backgroundColor: '#010A13',
    marginTop: '10px',
    color: '#C8AA6E',
    border: '1px solid #C8AA6E',
    borderSpacing: '40px 0px',
  },

  tablesContainer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
};
