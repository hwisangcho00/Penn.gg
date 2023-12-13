import DropDown from '../components/DropDown';
import { useEffect, useState } from 'react';
import backgroundImg from '../images/summoners_rift.png';
import { Button } from '@mui/material';

const config = require('../config.json');


export default function ItemWinRatesPage() {

    const [champItemRecs, setChampItemRecs] = useState([]);


    useEffect(() => {
        
        
        const queryItemRecs = async () => {
            fetch(`http://${config.server_host}:${config.server_port}/getWinrateItem`)
                .then(res => res.json())
                .then(resJson => {
                    console.log("Output:")
                    console.log(resJson)
                    setChampItemRecs(resJson); // Update the state with the fetched data
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setChampItemRecs(null); // Reset the state in case of an error
                });
        }

        queryItemRecs();

    }, [])


    return (
        <div style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '1536px 864px', // Or specify a size like '100px 100px'
            minHeight: '1300vh',
            width: '100%', // Ensure the container spans the full width
            // If you need to ensure the container expands with its content:
            height: 'auto',
            position: 'relative'
        }}>
             <div style={styles.overlay}>
                <div style={styles.container}>
                <h2 style={{ marginTop: '0px', fontSize: '50px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>Item Recs Based On Winrate</h2>
                </div>
            <div style={styles.tablesContainer}>
                {champItemRecs && (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center' }}>Item Name</th>
                                <th style={{ textAlign: 'center' }}>Explanation</th>
                                <th style={{ textAlign: 'center' }}>Winrate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {champItemRecs.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.item_name}</td>
                                    <td>{item.item_explain}</td>
                                    <td style={{ color: '#66FF00' }}>{(item.win_rate).toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

             </div>
        </div>

    )

}

const styles = {
    container: {
        paddingTop: '100px',
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },

    //for background
    overlay: {
        position: 'absolute', // Position absolutely within the relative parent
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent white
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
        marginTop: '30px',
        display: 'flex',     // Enable Flexbox
        justifyContent: 'space-around', // This will space out the tables evenly
        alignItems: 'flex-start', // Aligns tables to the top of the container
        // You can adjust padding and margin as needed
    },

};