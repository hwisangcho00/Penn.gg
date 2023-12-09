import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';
import '../index.css';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'leagueFont',
        fontWeight: 700,
        letterSpacing: '0rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: '#C8AA6E',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar position='static' sx={{ backgroundColor: '#091428' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='LeagueHelper' isMain />
          <NavText href='/comps' text='Comps' />
          <NavText href='/' text='Stats' />
          <NavText href='/' text='Items' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
