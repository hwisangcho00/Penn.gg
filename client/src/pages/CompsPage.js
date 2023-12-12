import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import backgroundImg from '../images/summoners_rift.png';
const config = require('../config.json');

// fetching portrait pngs for each champion in the composition
const getImageSrc = (championName) => {
    try {
      return require(`../images/portraits/${championName}.png`);
    } catch (error) {
      return require(`../images/portraits/-1.png`); // Error handling: Default image for potential name mismatch
    }
  };

function CompsPage() {
  const location = useLocation();
  const selectedChampion = location.state?.selectedChampion;
  const selectedID = location.state?.selectedKey;
  const championImage = selectedChampion ? require(`../images/portraits/${selectedChampion}.png`) : null;


  // best champion recommendations
  const [topRecs, setTopRecs] = useState(null);
  const [jgRecs, setJgRecs] = useState(null);
  const [midRecs, setMidRecs] = useState(null);
  const [botRecs, setBotRecs] = useState(null);

  // worst opponent champion picks
  const [topOpp, setTopOpp] = useState(null);
  const [jgOpp, setJgOpp] = useState(null);
  const [midOpp, setMidOpp] = useState(null);
  const [botOpp, setBotOpp] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
  
    const fetchURL = (lane) => {
      return fetch(`http://${config.server_host}:${config.server_port}/getBestTeammate/${selectedID}/${lane}`, { signal })
        .then(res => res.json())
        .then(resJson => {
          console.log("Output:", resJson);
          if (lane === "TOP") setTopRecs(resJson);
          else if (lane === "MIDDLE") setMidRecs(resJson);
          else if (lane === "JUNGLE") setJgRecs(resJson);
          else if (lane === "BOTTOM") setBotRecs(resJson);
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.error(`Error fetching data for lane ${lane}:`, error);
          }
        });
    };
  
    const fetchOpponentURL = (lane) => {
      return fetch(`http://${config.server_host}:${config.server_port}/getTopOpponentsByLane/${selectedID}/${lane}`, { signal })
        .then(res => res.json())
        .then(resJson => {
          console.log("Output:", resJson);
          if (lane === "TOP") setTopOpp(resJson);
          else if (lane === "JUNGLE") setJgOpp(resJson);
          else if (lane === "MIDDLE") setMidOpp(resJson);
          else if (lane === "BOTTOM") setBotOpp(resJson);
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.error(`Error fetching opponent data for lane ${lane}:`, error);
          }
        });
    };
  
    ["TOP", "MIDDLE", "JUNGLE", "BOTTOM"].forEach(lane => {
      fetchURL(lane);
      fetchOpponentURL(lane);
    });
  
    // Cleanup function to abort fetch on unmount or when selectedID changes
    return () => {
      abortController.abort();
    };
  }, [selectedID]); // Dependency array includes selectedID to re-fetch when it changes
  
  

  return (
    <div style={{ 
        backgroundImage: `url(${backgroundImg})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '1536px 864px', // Or specify a size like '100px 100px'
        minHeight: '300vh',
        width: '100%', // Ensure the container spans the full width
        // If you need to ensure the container expands with its content:
        height: 'auto',
        position: 'relative'
      }}>
        <div style={styles.overlay}>
          <div style={styles.container}>
          {championImage && <img src={championImage} alt={selectedChampion} style={styles.championImage} />}
      <h2 style={{fontSize:'70px', marginTop:'0px', color: '#C8AA6E', fontFamily: 'leagueFont'}}>{selectedChampion || 'None'}</h2>
      <h2 style={{marginTop: '0px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont'}}>{selectedChampion} is best with...</h2>
      
      <div style={styles.tablesContainer}>
        {topRecs && topRecs.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                    <th style={{textAlign: 'center'}}>Portraits</th>
                    <th style={{textAlign: 'center'}}>TOP Lane Champions</th>
                    <th style={{textAlign: 'center'}}>Winrate</th>
                </tr>
              </thead>
              <tbody>
                {topRecs.map((item, index) => (
                  <tr key={index}>
                    <td><img
          src={getImageSrc(item.champion_name)}
          alt={item.champion_name}
          style={{ width: '60px', height: 'auto' }} 
        /></td>
                    <td>{item.champion_name}</td>
                    <td style={{color: '#66FF00'}}>{(item.win_probability * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}

        {jgRecs && jgRecs.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                    <th style={{textAlign: 'center'}}>Portraits</th>
                    <th style={{textAlign: 'center'}}>JUNGLE Lane Champions</th>
                    <th style={{textAlign: 'center'}}>Winrate</th>
                </tr>
              </thead>
              <tbody>
                {jgRecs.map((item, index) => (
                  <tr key={index}>
                    <td><img
          src={getImageSrc(item.champion_name)}
          alt={item.champion_name}
          style={{ width: '60px', height: 'auto' }} 
        /></td>
                    <td>{item.champion_name}</td>
                    <td style={{color: '#66FF00'}}>{(item.win_probability * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}
        </div>

        <div style={styles.tablesContainer}>
        {midRecs && midRecs.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                    <th style={{textAlign: 'center'}}>Portraits</th>
                    <th style={{textAlign: 'center'}}>MID Lane Champions</th>
                    <th style={{textAlign: 'center'}}>Winrate</th>
                </tr>
              </thead>
              <tbody>
                {midRecs.map((item, index) => (
                  <tr key={index}>
                    <td><img
          src={getImageSrc(item.champion_name)}
          alt={item.champion_name}
          style={{ width: '60px', height: 'auto' }} 
        /></td>
                    <td>{item.champion_name}</td>
                    <td style={{color: '#66FF00'}}>{(item.win_probability * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}

    {botRecs && botRecs.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                    <th style={{textAlign: 'center'}}>Portraits</th>
                    <th style={{textAlign: 'center'}}>BOT Lane Champions</th>
                    <th style={{textAlign: 'center'}}>Winrate</th>
                </tr>
              </thead>
              <tbody>
                {botRecs.map((item, index) => (
                  <tr key={index}>
                    <td><img
          src={getImageSrc(item.champion_name)}
          alt={item.champion_name}
          style={{ width: '60px', height: 'auto' }} 
        /></td>
                    <td>{item.champion_name}</td>
                    <td style={{color: '#66FF00'}}>{(item.win_probability * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}
        </div>
        <h2 style={{marginTop: '100px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont'}}>{selectedChampion} loses more against...</h2>

        <div style={styles.tablesContainer}>
        {topOpp && topOpp.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                    <th style={{textAlign: 'center'}}>Portraits</th>
                    <th style={{textAlign: 'center'}}>TOP Lane Champions</th>
                    <th style={{textAlign: 'center'}}>Winrate</th>
                </tr>
              </thead>
              <tbody>
                {topOpp.map((item, index) => (
                  <tr key={index}>
                    <td><img
          src={getImageSrc(item.champion_name)}
          alt={item.champion_name}
          style={{ width: '60px', height: 'auto' }} 
        /></td>
                    <td>{item.champion_name}</td>
                    <td style={{color: 'red'}}>{(100 - item.win_probability * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}

        {jgOpp && jgOpp.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                    <th style={{textAlign: 'center'}}>Portraits</th>
                    <th style={{textAlign: 'center'}}>JUNGLE Lane Champions</th>
                    <th style={{textAlign: 'center'}}>Winrate</th>
                </tr>
              </thead>
              <tbody>
                {jgOpp.map((item, index) => (
                  <tr key={index}>
                    <td><img
          src={getImageSrc(item.champion_name)}
          alt={item.champion_name}
          style={{ width: '60px', height: 'auto' }} 
        /></td>
                    <td>{item.champion_name}</td>
                    <td style={{color: 'red'}}>{(100 - item.win_probability * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}
        </div>

        <div style={styles.tablesContainer}>
        {midOpp && midOpp.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                    <th style={{textAlign: 'center'}}>Portraits</th>
                    <th style={{textAlign: 'center'}}>MID Lane Champions</th>
                    <th style={{textAlign: 'center'}}>Winrate</th>
                </tr>
              </thead>
              <tbody>
                {midOpp.map((item, index) => (
                  <tr key={index}>
                    <td><img
          src={getImageSrc(item.champion_name)}
          alt={item.champion_name}
          style={{ width: '60px', height: 'auto' }} 
        /></td>
                    <td>{item.champion_name}</td>
                    <td style={{color: 'red'}}>{(100 - item.win_probability * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}

        {botOpp && botOpp.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                    <th style={{textAlign: 'center'}}>Portraits</th>
                    <th style={{textAlign: 'center'}}>BOT Lane Champions</th>
                    <th style={{textAlign: 'center'}}>Winrate</th>
                </tr>
              </thead>
              <tbody>
                {botOpp.map((item, index) => (
                  <tr key={index}>
                    <td><img
          src={getImageSrc(item.champion_name)}
          alt={item.champion_name}
          style={{ width: '60px', height: 'auto' }} 
        /></td>
                    <td>{item.champion_name}</td>
                    <td style={{color: 'red'}}>{(100 - item.win_probability * 100).toFixed(2)}%</td>
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

export default CompsPage;

const styles = {
    container: {
        paddingTop: '300px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      position: 'relative'
    },
  
    //for background
    overlay: {
        position: 'absolute', // Position absolutely within the relative parent
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent white
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // Add your existing overlay styles here (like background color, opacity, etc.)
      },
  
    // champion image
    championImage: {
        paddingTop: '1200px',
        display: 'block', // to enable margin auto
        marginLeft: 'auto', // center the image
        marginRight: 'auto', // center the image
        width: '150px', 
        height: 'auto', 
      },
      
    table: {
        textAlign: 'center',
        fontSize: '20px',
        fontFamily: 'leagueFontLight',
        backgroundColor: '#010A13',
        marginTop: '10px',
        color: '#C8AA6E', 
        border: '1px solid #C8AA6E', 
        borderSpacing: '40px 0px' 
    },

    tablesContainer: {
        display: 'flex',     // Enable Flexbox
        justifyContent: 'space-around', // This will space out the tables evenly
        alignItems: 'flex-start', // Aligns tables to the top of the container
        // You can adjust padding and margin as needed
      },
    
  };
// <h2 style={{color: '#C8AA6E', fontFamily: 'leagueFont'}}>Champion ID: {selectedID || 'None'}</h2>