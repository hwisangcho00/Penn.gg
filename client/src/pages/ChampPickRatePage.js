import DropDown from '../components/DropDown';
import { useEffect, useState } from 'react';
import backgroundImg from '../images/summoners_rift.png';

const config = require('../config.json');

export default function ChampPickRatePage() {
  const [options, setOptions] = useState(['default']);
  const [selectedOption, setSelectedOption] = useState('');
  const [idToKeyMap, setIdToKeyMap] = useState({});
  const [selectedID, setSelectedID] = useState('');
  const [champPickRate, setChampPickRate] = useState(null); // Use null to indicate no data initially

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./riot_champion.json');

        if (!response.ok) {
          throw new Error(`Failed to load JSON file: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const namesArray = data.map((item) => item.id);

        const idToKeyMap = data.reduce((map, item) => {
          map[item.id] = item.key;
          return map;
        }, {});

        setIdToKeyMap(idToKeyMap);
        setOptions(namesArray);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };


   const queryChampPickRate = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/getPickrateChampion/${selectedID}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch pick rate: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setChampPickRate(data && data.length > 0 ? data[0].pick_rate : null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setChampPickRate(null);
      }
    };

    fetchData();
    queryChampPickRate();

  }, [selectedID]); 

  const handleSelect = (value) => {
    setSelectedOption(value);
    const champID = idToKeyMap[value];
    setSelectedID(champID);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
      }}
    >
      <div style={styles.overlay}>
        <div style={styles.container}>
          <h2 style={{ marginTop: '0px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>
            Choose your champion!
          </h2>
          <DropDown options={options} label="" onSelect={handleSelect} style={{ ...styles.champSelect, width: '50%' }} />
          <h2 style={{ fontSize: '70px', marginTop: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>
            {selectedOption || 'None'}
          </h2>
          <h2 style={{ marginTop: '0px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>
            {selectedOption} has the following pick rate: {champPickRate !== null ? `${champPickRate.toFixed(2)}%` : 'N/A'}
          </h2>
        </div>
      </div>
    </div>
  );
}


// Updated Styles
const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leagueIcon: {
    marginTop: '0px',
    maxWidth: '200px',
    height: 'auto',
  },
  // place the images side by side
  imagesRow: {
    display: 'flex',
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

  //champion selection dropdown
  champSelect: {
    marginTop: '50px',
  },

  // table formatting
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
    display: 'flex', // Enable Flexbox
    justifyContent: 'space-around', // This will space out the tables evenly
    alignItems: 'flex-start', // Aligns tables to the top of the container
    // You can adjust padding and margin as needed
  },
  pickRate: {
    textAlign: 'center',
    fontSize: '24px',
    fontFamily: 'leagueFontLight',
    color: '#C8AA6E',
    marginTop: '20px',
  },
};

