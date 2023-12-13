import { useEffect, useState } from 'react';
import backgroundImg from '../images/summoners_rift.png';

const config = require('../config.json');

export default function StatWinRatePage() {
  const [statWinRates, setStatWinRates] = useState([]);

  useEffect(() => {
    const fetchStatWinRates = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/getStatWinrate`);
        if (!response.ok) {
          throw new Error(`Failed to fetch win rates: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setStatWinRates(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setStatWinRates([]);
      }
    };

    fetchStatWinRates();
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
        minHeight: '100vh',
        width: '100%',
        height: 'auto',
        position: 'relative',
      }}
    >
      <div style={styles.overlay}>
        <div style={styles.container}>
          <h2 style={{ marginTop: '0px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>
            Win Rates for Each Stat
          </h2>
          <div style={styles.tablesContainer}>
            {statWinRates && (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>Stat</th>
                    <th style={{ textAlign: 'center' }}>Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {statWinRates.map((item, index) => (
                    <tr key={index}>
                      <td>{item.stat}</td>
                      <td style={{ color: '#66FF00' }}>{(item.winrate * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: '300px',
    height: '40vh',
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
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
};
