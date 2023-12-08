import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import leagueImg from '../images/league.ico';
import backgroundImg from '../images/summoners_rift.png';
import DropDown from '../components/DropDown';


const config = require('../config.json');


export default function HomePage() {
  const [options, setOptions] = useState(['default']);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./riot_champion.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load JSON file: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const namesArray = data.map(item => item.id);

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
  };

  return (
    <div style={{ 
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'cover',
      minHeight: '100vh'
    }}>
      <div style={styles.overlay}>
        <div style={styles.container}>
        <DropDown options={options} label="Select an option" onSelect={handleSelect} />
        <p>Selected Option: {selectedOption}</p>
        <h1 style={{color:'white'}}>Welcome to League Simulator!</h1>
          <img src={leagueImg} alt="Description" style={styles.leagueIcon} />
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
    maxWidth: '80px', 
    height: 'auto', 
  },
  //for background
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent white
    minHeight: '100vh', // Full viewport height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
};