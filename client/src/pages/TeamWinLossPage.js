import React, { useEffect, useState } from 'react';
import DropDown from '../components/DropDown';
import backgroundImg from '../images/summoners_rift.png';

const config = require('../config.json');

export default function TeamWinLossPage() {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [idToKeyMap, setIdToKeyMap] = useState({});
  const [champ1, setChamp1] = useState('');
  const [champ2, setChamp2] = useState('');
  const [champ3, setChamp3] = useState('');
  const [champ4, setChamp4] = useState('');
  const [champ5, setChamp5] = useState('');
  const [teamWinLoss, setTeamWinLoss] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./riot_champion.json');

        if (!response.ok) {
          throw new Error(`Failed to load JSON file: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const namesArray = data.map((item) => item.id);
        const idMap = data.reduce((map, item) => {
          map[item.id] = item.key;
          return map;
        }, {});
        setOptions(namesArray);
        setIdToKeyMap(idMap);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (value, index) => {
    setSelectedOption(value);
    const champID = idToKeyMap[value];
    switch (index) {
      case 0:
        setChamp1(champID);
        break;
      case 1:
        setChamp2(champID);
        break;
      case 2:
        setChamp3(champID);
        break;
      case 3:
        setChamp4(champID);
        break;
      case 4:
        setChamp5(champID);
        break;
      default:
        break;
    }
  };


  const handleSubmit = async () => {
    if (champ1 === '' || champ2 === '' || champ3 === '' || champ4 === '' || champ5 === '') {
      return;
    }

    try {
      const url = `http://${config.server_host}:${config.server_port}/getTeamCombination/${champ1}/${champ2}/${champ3}/${champ4}/${champ5}`;
      console.log('Request URL:', url);
  
      const response = await fetch(url);
  
      console.log('Response Status:', response.status);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch team win-loss data: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Received data from the server:', data);

      if (Object.keys(data).length > 0) {
        setTeamWinLoss(data && data.length > 0 ? data[0] : null);
      } else {
        setTeamWinLoss(null);
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
      setTeamWinLoss(null);
    }
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
            Choose your team!
          </h2>
          {Array.from({ length: 5 }).map((_, index) => (
            <div style = {styles.dropDown}>
            <DropDown
              key={index}
              options={options}
              label={`Champion ${index + 1}`}
              onSelect={(value) => handleSelect(value, index)}
              style={{ ...styles.champSelect, width: '50%' }}
            />
            </div>
          ))}
          <button onClick={handleSubmit} style={styles.submitButton}>
            Done
          </button>
          {teamWinLoss !== null ? (
            <div>
              <h2 style={{ marginTop: '40px', fontSize: '24px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>
                Total Games: {teamWinLoss.total_games}
              </h2>
              <h2 style={{ marginTop: '0px', fontSize: '24px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>
                Wins: {teamWinLoss.wins}
              </h2>
              <h2 style={{ marginTop: '0px', fontSize: '24px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>
                Losses: {teamWinLoss.losses}
              </h2>
            </div>
          ) : (
            <h2 style={{ marginTop: '40px', fontSize: '24px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>
              No data to display.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  dropDown: {
    padding: '1vh',
    width: '30vw'
  },
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  champSelect: {
    marginTop: '20px',
  },
  submitButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '18px',
    backgroundColor: '#C8AA6E',
    color: '#010A13',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
  },
};
