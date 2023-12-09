import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import backgroundImg from '../images/summoners_rift.png';
const config = require('../config.json');

function CompsPage() {
  const location = useLocation();
  const selectedChampion = location.state?.selectedChampion;
  const selectedID = location.state?.selectedKey;
  const championImage = selectedChampion ? require(`../images/portraits/${selectedChampion}.png`) : null;
  const [isLoading, setIsLoading] = useState(false);


  // best champion recommendations
  const [topRecs, setTopRecs] = useState(null);


  useEffect(() => {
    //fetch(`http://${config.server_host}:${config.server_port}/getBestTeammate/:${selectedID}/:TOP`)
    fetch(`http://${config.server_host}:${config.server_port}/getTopOpponentsByLane/119/TOP}`)
      .then(res => res.json())
      .then(data => {
        setTopRecs(data); // Update the state with the fetched data
        setIsLoading(false); // Stop loading once data is fetched
    })
      .catch(error => {
        console.error('Error fetching data:', error);
        setTopRecs(null); // Reset the state in case of an error
      });
  }, [selectedID]); // Dependency array includes selectedID to re-fetch when it changes
  

  return (
    <div style={{ 
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        minHeight: '100vh'
      }}>
        <div style={styles.overlay}>
          <div style={styles.container}>
          {championImage && <img src={championImage} alt={selectedChampion} style={styles.championImage} />}
      <h2 style={{color: '#C8AA6E', fontFamily: 'leagueFont'}}>Selected Champion: {selectedChampion || 'None'}</h2>
      <h2 style={{color: '#C8AA6E', fontFamily: 'leagueFont'}}>Champion ID: {selectedID || 'None'}</h2>
      <h3 style={{color: '#C8AA6E', fontFamily: 'leagueFont'}}>Query Results go Here:</h3>
      {isLoading ? (
            <p style={{color: 'white'}}>Processing...</p>
          ) : (
            <p style={{color: 'white'}}>
                Results Here: 
              {topRecs ? JSON.stringify(topRecs, null, 2) : 'No data available'}
            </p>
          )}
          </div>
        </div>
    </div>
  );
}

export default CompsPage;

const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
    },
  
    //for background
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent white
      minHeight: '100vh', // Full viewport height
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    // champion image
    championImage: {
        marginTop: '0px', 
        maxWidth: '200px', 
        height: 'auto', 
      },    
    
  };
