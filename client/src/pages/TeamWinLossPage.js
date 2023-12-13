import React, { useState, useEffect } from 'react';
import backgroundImg from '../images/summoners_rift.png';
import DropDown from '../components/DropDown';

const config = require('../config.json');

export default function TeamWinLossPage() {
  const [options, setOptions] = useState(['default']);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [idToKeyMap, setIdToKeyMap] = useState({});
  const [teamWinLossData, setTeamWinLossData] = useState(null);

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

    const queryTeamWinLoss = async () => {
      try {
        const championsIDs = selectedOptions.map((option) => idToKeyMap[option]);
        const response = await fetch(`http://${config.server_host}:${config.server_port}/getTeamCombination/${championsIDs.join('/')}`);
        
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

    fetchData();
    queryTeamWinLoss();
  }, [selectedOptions]);

  const handleSelect = (value) => {
    const updatedOptions = [...selectedOptions, value];
    setSelectedOptions(updatedOptions);
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
            Choose your champions for the team combination!
          </h2>
          <div>
            {options.map((option) => (
              <DropDown
                key={option}
                options={[option]}
                label=""
                onSelect={(value) => handleSelect(value)}
                style={{ ...styles.champSelect, width: '50%' }}
              />
            ))}
          </div>
          <h2 style={{ marginTop: '40px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>
            Selected Champions: {selectedOptions.join(', ') || 'None'}
          </h2>
          <h2 style={{ marginTop: '0px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>
            Team Win/Loss Data: {teamWinLossData !== null ? `${teamWinLossData[0].wins} Wins, ${teamWinLossData[0].losses} Losses` : 'N/A'}
          </h2>
        </div>
      </div>
    </div>
  );
}

const styles = {
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
};
