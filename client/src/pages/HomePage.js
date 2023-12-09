import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// basic imports
import leagueImg from '../images/league.ico';
import backgroundImg from '../images/summoners_rift.png';
import DropDown from '../components/DropDown';
import '../index.css';


const config = require('../config.json');

export default function HomePage() {

  const [options, setOptions] = useState(['default']);
  const [selectedOption, setSelectedOption] = useState('');
  const [idToKeyMap, setIdToKeyMap] = useState({});
  const [selectedID, setSelectedID] = useState('');
  //const idToKeyMap = '';


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./riot_champion.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load JSON file: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const namesArray = data.map(item => item.id);

        // dictionary for mapping champion names with champion ids (for Query)
        const idToKeyMap = data.reduce((map, item) => {
          map[item.id] = item.key;
          return map;
        }, {});

        setIdToKeyMap(idToKeyMap);
        setOptions(namesArray);
        console.log(namesArray);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures that this effect runs once, similar to componentDidMount


  const handleSelect = (value) => {
    setSelectedOption(value);
    // Do something with the selected value
    const champID = idToKeyMap[value];
    setSelectedID(champID);
  };

  // when comps button is clicked, navigate to the composition query page and execute query
  const navigate = useNavigate();
  const handleButtonClick = () => {
    //navigate("/comps", { state: { selectedChampion: selectedOption} });
    navigate("/comps", { state: { selectedChampion: selectedOption, selectedKey: selectedID} });
  };

  return (
    <div style={{ 
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'cover',
      minHeight: '100vh'
    }}>
      <div style={styles.overlay}>
        <div style={styles.container}>
        <img src={leagueImg} alt="league logo" style={styles.leagueIcon} />
          <h1 style={{ fontFamily: "'leagueFont', sans-serif" }}>Welcome to League Simulator!</h1>
          <h2 style={{ color: '#C8AA6E', fontFamily: "'leagueFont', sans-serif" }}>Select your champion:</h2>
          <DropDown options={options} label="" onSelect={handleSelect} style={styles.champSelect} />
          <button className="button" onClick={handleButtonClick}>Find Best Team Comps</button>
        </div>
      </div>
    </div>
  );
};

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
    marginTop: '50px'
  }
};