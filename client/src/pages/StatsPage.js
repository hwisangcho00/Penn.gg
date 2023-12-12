import { useEffect, useState } from 'react';
import backgroundImg from '../images/summoners_rift.png';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../index.css';
const config = require('../config.json');


export default function StatsPage() {
  const navigate = useNavigate();

  const handleButtonClick = (navString) => {
    //navigate("/comps", { state: { selectedChampion: selectedOption} });
    navigate(navString);
  };

  return (
    <div style={{
      backgroundImage: `url(${backgroundImg})`,
      backgroundRepeat: 'repeat',
<<<<<<< HEAD
      backgroundSize: 'cover', // Or specify a size like '100px 100px'
=======
      backgroundSize: '1536px 864px', // Or specify a size like '100px 100px'
>>>>>>> 5ff0931 (UI updates)
      minHeight: '100vh',
      width: '100%', // Ensure the container spans the full width
      // If you need to ensure the container expands with its content:
      height: 'auto',
      position: 'relative',
      display: 'flex',
      flexDirection: "column",
    }}>
      <div style={styles.overlay}>
      <div style={styles.container}>
        <div>
          <h1 style={{ fontSize: '90px', textAlign: 'center' }}>Champion Stats</h1>
          <p style={{ fontSize: '25px', textAlign: 'center' }}>Find different statistics of individual champions.</p>
        </div>
        <div>
        <button className="button" onClick={() => handleButtonClick("/rangedChamp")}>Wins and Losses For Number of Ranged Champs</button>
        </div>
        <div>
        <button className="button" onClick={() => handleButtonClick("/dataForChampion")}>Individual Champion Stats</button>
        </div>
      </div>
    </div>
    </div>


  )

}

const styles = {
  container: {
    paddingTop: '300px',
    height: '20vh',
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