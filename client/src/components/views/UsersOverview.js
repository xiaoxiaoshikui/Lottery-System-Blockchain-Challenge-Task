import React, { useEffect,useState } from 'react';
import {api, handleError} from "../../helpers/api";
import {useHistory} from "react-router-dom";
const styles = {
    container: {
        width: '300px',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    text: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    textwallet: {
        fontSize: '11px',
        marginBottom: '10px',
    },
    button: {
        padding: '10px 20px',
        margin: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        backgroundColor: '#4caf50',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
    },
};
const UsersOverview = () => {
    const [balance, setBalance] = useState(0);
    const [walletAddress, setWalletAddress] = useState('');
    const history = useHistory();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('privatekey');
        history.push('/login');
    };
    const handleAddmoney = async () => {
        alert("Please contact the administrator to increase your money.");
        const response = await api.post(`/addmoney?balance=${balance}&walletAddress=${walletAddress}&privatekey=${localStorage.getItem("privatekey")}`);
        console.log(response)
        localStorage.setItem('money', response.data.money);
        setBalance(localStorage.getItem("money"));
        alert(`Add money to ${localStorage.getItem("money")}`);
    };

    const handleEnterGame = () => {
        if (balance>0){
            history.push('/Profilepage');
        } else{
            alert("You have no money, please recharge it!");
        }
    };
    useEffect(() => {
        async function fetchData() {
            try {
                setWalletAddress(localStorage.getItem("token"));
                setBalance(parseInt(localStorage.getItem("money")));
                // const response = await api.get(`/users?privatekey=${localStorage.getItem("privatekey")}&myAddress=${localStorage.getItem("token")}`);
                console.log(localStorage.getItem("money"))
                // setBalance(response.data.money.gasUsed);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, []);


    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Dashboard</h2>
            <p style={styles.text}>Balance: {balance}</p>
            <p style={styles.textwallet}>Wallet Address: {walletAddress}</p>
            <button style={styles.button} onClick={handleLogout}>Logout</button>
            <button style={styles.button} onClick={handleAddmoney}>Add money</button>
            <button style={styles.button} onClick={handleEnterGame}>Enter Game</button>
        </div>
    );
};

export default UsersOverview;
