import DropDown from '../components/DropDown';
import { useEffect, useState } from 'react';
import backgroundImg from '../images/summoners_rift.png';
import { Button } from '@mui/material';

const config = require('../config.json');


export default function DataForChampionPage() {

    const [champItemRecs, setChampItemRecs] = useState([{}]);
    const [options, setOptions] = useState(['default']);
    const [selectedOption, setSelectedOption] = useState('');
    const [idToKeyMap, setIdToKeyMap] = useState({});
    const [selectedID, setSelectedID] = useState('');


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
        
        const queryChampItemRecs = async () => {
            fetch(`http://${config.server_host}:${config.server_port}/getchampionData/${selectedID}`)
                .then(res => res.json())
                .then(resJson => {
                    console.log("Output:")
                    console.log(resJson)
                    setChampItemRecs([resJson]); // Update the state with the fetched data
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setChampItemRecs(null); // Reset the state in case of an error
                });
        }

        fetchData();
        queryChampItemRecs();

    }, [selectedID])


    const handleSelect = (value) => {
        setSelectedOption(value);
        // Do something with the selected value
        const champID = idToKeyMap[value];
        setSelectedID(champID);
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
        }}><h2 style={{ marginTop: '0px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>Choose your champion!</h2>
            <DropDown options={options} label="" onSelect={handleSelect} style={styles.champSelect} />
            <h2 style={{ fontSize: '70px', marginTop: '0px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>{selectedOption || 'None'}</h2>
            <h2 style={{ marginTop: '0px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>{selectedOption} has the following stats:</h2>
            <div style={styles.tablesContainer}>
                {champItemRecs && (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center' }}>Avg KDA</th>
                                <th style={{ textAlign: 'center' }}>Avg Largest Killing Spree</th>
                                <th style={{ textAlign: 'center' }}>Avg Largest Multikill</th>
                                <th style={{ textAlign: 'center' }}>Avg Longest Time Spent Living</th>
                            </tr>
                        </thead>
                        <tbody>
                            {champItemRecs.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.avg_kills} / {item.avg_deaths} / {item.avg_assists}</td>
                                    <td>{item.avg_largestKillingSpree}</td>
                                    <td>{item.avg_largestMultiKill}</td>
                                    <td>{item.avg_longestTimeSpentLiving}</td>
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