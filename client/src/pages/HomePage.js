import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import leagueImg from '../images/league.ico';
import backgroundImg from '../images/summoners_rift.png';

const config = require('../config.json');

export default function HomePage() {
  return (
    <div style={{ 
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'cover',
      minHeight: '100vh'
    }}>
      <div style={styles.overlay}>
        <div style={styles.container}>
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