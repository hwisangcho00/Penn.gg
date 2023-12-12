import DropDown from '../components/DropDown';
import { useEffect, useState } from 'react';
import backgroundImg from '../images/summoners_rift.png';
import { Button } from '@mui/material';
import ReactLoading from "react-loading";
import '../index.css';

const config = require('../config.json');


export default function ChampItemRecsPage() {

    const [champItemRecs, setChampItemRecs] = useState([{}]);
    const [options, setOptions] = useState(['default']);
    const [selectedOption, setSelectedOption] = useState('');
    const [idToKeyMap, setIdToKeyMap] = useState({});
    const [selectedID, setSelectedID] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setIsLoading(true); // Start loading
    
        const fetchData = async () => {
            try {
                const response = await fetch('./riot_champion.json');
                if (!response.ok) {
                    throw new Error(`Failed to load JSON file: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                const namesArray = data.map(item => item.id);
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
            try {
                const res = await fetch(`http://${config.server_host}:${config.server_port}/getItemRecommendation/${selectedID}`);
                const resJson = await res.json();
                console.log("Output:", resJson);
                setChampItemRecs(resJson);
            } catch (error) {
                console.error('Error fetching data:', error);
                setChampItemRecs(null);
            }
        };
    
        Promise.all([fetchData(), queryChampItemRecs()]).finally(() => {
            setIsLoading(false); // Stop loading once both data are fetched
        });
    
    }, [selectedID]);
    


    const handleSelect = (value) => {
        setSelectedOption(value);
        // Do something with the selected value
        const champID = idToKeyMap[value];
        setSelectedID(champID);
    };

    return (
        <div style={styles.backgroundImageStyle}>
            <div style={styles.container}>

            <h2 style={{ marginTop: '0px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>Choose your champion!</h2>
            <div style={{width: '500px'}}>
            <DropDown options={options} label="" onSelect={handleSelect} style={{ ...styles.champSelect, width: '50%' }} />
            </div>
            <h2 style={{ fontSize: '70px', marginTop: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>{selectedOption || 'None'}</h2>
            <h2 style={{ marginTop: '0px', fontSize: '40px', color: '#C8AA6E', fontFamily: 'leagueFont' }}>{selectedOption} is best with...</h2>
            
            {isLoading ? (
                <ReactLoading type={"bubbles"} color="#C8AA6E" />
                ) : (
                
                    <div style={styles.tablesContainer}>
                {champItemRecs && (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center' }}>Item Name</th>
                                <th style={{ textAlign: 'center' }}>Wins</th>
                                <th style={{ textAlign: 'center' }}>Losses</th>
                                <th style={{ textAlign: 'center' }}>Winrate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {champItemRecs.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.wins}</td>
                                    <td>{item.total - item.wins}</td>
                                    <td style={{ color: '#66FF00' }}>{(item.prob_wins * 100).toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            )}

        </div>
        </div>

    )

}

const styles = {
    container: {
        paddingTop: '100px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: backgroundImg,
        backgroundRepeat: 'repeat',
      },

    //for background
    backgroundImageStyle : {
        backgroundImage: `url(${backgroundImg}), linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))`,
        backgroundRepeat: 'repeat-y',
        backgroundSize: 'cover',
        backgroundBlendMode: 'overlay', // Blend the image and the gradient
        minHeight: '100vh',
        width: '100%',
        height: 'auto',
        position: 'relative',
    },
    
    // Overlay style
    overlayStyle : {
        position: 'absolute', // Overlay is absolutely positioned within the relative parent
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adjust the color and opacity as needed
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