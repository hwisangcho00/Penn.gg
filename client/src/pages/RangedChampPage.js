import DropDown from '../components/DropDown';
import { useEffect, useState } from 'react';
import backgroundImg from '../images/summoners_rift.png';
import { Button } from '@mui/material';

const config = require('../config.json');


export default function RangedChampPage() {

    const [rangedChampData, setRangedChampData] = useState([{}]);
    const [selectedOption, setSelectedOption] = useState('');
    const [options, setOptions] = useState(['1', '2', '3', '4', '5'])


    useEffect(() => {

        const queryRangedWinrate = async () => {
            fetch(`http://${config.server_host}:${config.server_port}/getRangedWinrate`)
                .then(res => res.json())
                .then(resJson => {
                    console.log("Output:")
                    console.log(resJson)
                    resJson = resJson.sort(function (a, b) {
                        let x = a.champions_above_200;
                        let y = b.champions_above_200;

                        if (x > y) { return 1; }
                        if (x < y) { return -1; }
                        return 0;
                    })
                    setRangedChampData(resJson); // Update the state with the fetched data

                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setRangedChampData(null); // Reset the state in case of an error
                });
        }

        queryRangedWinrate();

    }, [selectedOption])


    const handleSelect = (value) => {
        setSelectedOption(value);
        // Do something with the selected value
    };

    return (
        <div style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '1536px 864px', // Or specify a size like '100px 100px'
            minHeight: '300vh',
            width: '100%', // Ensure the container spans the full width
            // If you need to ensure the container expands with its content:
            height: 'auto',
            position: 'relative'
        }}>
            <h2 style={{ marginTop: '0px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>How Ranged Champs Affect Winrate</h2>
            <div style={styles.tablesContainer}>
                {rangedChampData && (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center' }}>Number of Ranged Champs</th>
                                <th style={{ textAlign: 'center' }}>Wins</th>
                                <th style={{ textAlign: 'center' }}>Losses</th>
                                <th style={{ textAlign: 'center' }}>Winrate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rangedChampData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.champions_above_200}</td>
                                    <td>{item.wins}</td>
                                    <td>{item.total_games - item.wins}</td>
                                    <td style={{ color: '#66FF00' }}>{(item.winrate * 100).toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>

    )

}

const styles = {
    container: {
        paddingTop: '300px',
        height: '100vh',
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
        display: 'flex',     // Enable Flexbox
        justifyContent: 'space-around', // This will space out the tables evenly
        alignItems: 'flex-start', // Aligns tables to the top of the container
        // You can adjust padding and margin as needed
    },

};