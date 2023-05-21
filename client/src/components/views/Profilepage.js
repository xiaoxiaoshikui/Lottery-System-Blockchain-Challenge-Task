import React, { Component } from "react";
import "./style.scss";

import Stats from "./components/Stats";
import Table from "./components/Table";
import Wheel from "./img/wheel.jpg";
import Options from "./components/Options";
import {withRouter} from "react-router-dom";
import {api} from "../../helpers/api";
const styles = {

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



class Profilepage extends Component {
    state = {
        playerAmount: localStorage.getItem("money"),
        betMap: [],
        spinResult: "",
        betResult: "",
        chipSelected: null,
        currentTotalBet: 0,
        lastSpin: null,
        lastResult: null,
        lastWinMessages: []
    };

    handleLogout = () => {
        const { history } = this.props;
        history.push('/UsersOverview');
    };

    selectBetHandler = bet => {
        let betMap = Object.assign([], this.state.betMap);
        let chipSelected = this.state.chipSelected;
        let playerAmount = this.state.playerAmount;
        let totalBet = this.state.currentTotalBet;
        let remaining = playerAmount - totalBet;


        betMap.forEach(function(obj) {
            // Check if the bet has already been placed
            if (
                obj.value === bet &&
                obj.currentBet === null &&
                remaining >= chipSelected
            ) {
                if (playerAmount >= chipSelected) {
                    obj.currentBet = chipSelected;
                    totalBet += chipSelected;
                }
            } else if (obj.value === bet && obj.currentBet !== chipSelected) {
                totalBet -= obj.currentBet;
                obj.currentBet = null;
            } else if (obj.value === bet && obj.currentBet === chipSelected) {
                obj.currentBet = null;
                totalBet -= chipSelected;
            }

            // if (
            //     obj.value === bet &&
            //     obj.currentBet === null &&
            //     remaining >= chipSelected &&
            //     totalBet ===0
            //
            // ) {
            //     if (playerAmount >= chipSelected) {
            //         obj.currentBet = chipSelected;
            //         totalBet += chipSelected;
            //     }
            // }
        }
        );

        this.setState(() => ({
            betMap,
            currentTotalBet: totalBet,
            playerAmount: playerAmount
        }));
    };

    selectChipHandler = bet => {
        let chip;
        if (this.state.chipSelected === null || this.state.chipSelected !== bet) {
            chip = bet;
            // this.clearBetsHandler()
        } else if (this.state.chipSelected === bet) {
            chip = null;
        }
        this.setState(() => ({ chipSelected: chip }));
    };

    populateBetsHandler = () => {
        let betMapArray = [];
        let numberBets = [];
        let betMap = [];
        for (let i = 0; i <= 36; i++) {
            numberBets.push(i);
        }
        let wordBets = [
            "3rd row",
            "2nd row",
            "1st row",
            "1st 12",
            "2nd 12",
            "3rd 12",
            "1-18",
            "EVEN",
            "Red",
            "Black",
            "ODD",
            "19-36"
        ];
        betMapArray = numberBets.concat(wordBets);
        function Slot(value, currentBet) {
            this.value = value;
            this.currentBet = currentBet;
        }
        for (let i = 0; i < betMapArray.length; i++) {
            let betInstance = new Slot(betMapArray[i], null);
            betMap.push(betInstance);
        }

        this.setState(() => ({ betMap, chipSelected: null }));
    };

    componentDidMount = () => {
        this.populateBetsHandler();
    };

    clearBetsHandler = () => {
        this.setState(() => ({ currentTotalBet: 0 }));
        this.populateBetsHandler();
    };

    spinWheelHandler = async () => {
        let playerAmount = this.state.playerAmount;
        let startingAmount = this.state.playerAmount;
        let totalBet = this.state.currentTotalBet;
        let betMap = this.state.betMap;
        let winnings = 0;
        let winMessages = [];

        let activeBets = betMap.filter(slot => slot.currentBet);
        this.setState(() => ({
            playerAmount: startingAmount-activeBets[0].currentBet,
        }));
        let values = activeBets.map(slot => slot.value);
        let currentBets = activeBets.map(slot => slot.currentBet);
        console.log(values+"aaaaaaaa"+currentBets)
        const response = await api.post(`/bet?value=${values}&playerAmount=${currentBets}&myAddress=${localStorage.getItem("token")}&privateKey=${localStorage.getItem("privatekey")}`);
        // console.log(response)
        // localStorage.setItem('money', response.data.money.gasUsed);
        // setBalance(localStorage.getItem("money"));
        // playerAmount=response.data.playerAmount
        // const response =[];
        winnings = 0;
        localStorage.setItem('money', response.data.playerAmount);
        this.setState(() => ({
            playerAmount: response.data.playerAmount,
            lastSpin: parseInt(response.data.lastSpin),
            lastResult: response.data.lastResult,
            lastWinMessages: response.data.lastWinMessages
        }));
        };


    render() {
        let numbers = [];
        for (let i = 0; i < 37; i++) {
            numbers.push(i);
        }

        return (
            <div className="App">
                <h1 className="header">Roulette</h1>
                <button style={styles.button} onClick={this.handleLogout}>Back</button>
                <div className="screen">
                    <div className="game">
                        <div className="display">
                            <Stats
                                playerAmount={this.state.playerAmount}
                                currentTotalBet={this.state.currentTotalBet}
                                lastResult={this.state.lastResult}
                                lastWinMessages={this.state.lastWinMessages}
                                lastSpin={this.state.lastSpin}
                            />
                            <Table
                                lastSpin={this.state.lastSpin}
                                betSelected={this.state.betSelected}
                                selectBetHandler={this.selectBetHandler}
                                betMap={this.state.betMap}
                            />
                        </div>
                        <Options
                            chipSelected={this.state.chipSelected}
                            selectChip={this.selectChipHandler}
                            clearBets={this.clearBetsHandler}
                            spinWheel={this.spinWheelHandler}
                        />
                    </div>
                    <div className="wheel__display">
                        <img className="wheel__image" src={Wheel} alt="wheel" />
                        {numbers.map(num => (
                            <ResultBall
                                key={num}
                                number={num}
                                lastSpin={this.state.lastSpin}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

const ResultBall = props => {
    let classname;
    if (props.lastSpin === props.number) {
        classname = `ball ball__${props.number}`;
    }

    return <div className={classname} />;
};
//This code is from github:https://github.com/peterdurham/roulette/tree/master
export default withRouter(Profilepage);