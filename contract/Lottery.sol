// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// import "./RandomGenerator.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Lottery {
    address[] public participants;
    IERC20 public token;
    uint256 winnerIndex;
    uint256 totalParticipants;
    uint256 public pickwinnerStatus=1;
    address creator;
    uint256 private seeds=1;
    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this function");
        _;
    }
    modifier onlyParticipants() {
        require(allParticipants[msg.sender].register_status == 1, "Only participants can call this function");
        _;
    }
    struct participantInfo {
        mapping(uint256 => uint256) BetInfo;// betNumber=>stake
        uint256 balance;
        uint256 stakeSum;//sum of stake
        uint256 betFlag;// bet Flag, usr can only bet one time for each slot, 1 for betted, 0 for didnt bet
        uint256 register_status;
    }
    mapping(address => participantInfo) public allParticipants;
    event LotteryWinner(address winner, uint256 amount);

    constructor(address _token,uint256 tp) {
        //timeUnit is seconds
        creator=msg.sender;
        token = IERC20(_token);
        totalParticipants=tp;
    }

    function register() public{
        address usr=msg.sender;
        require(allParticipants[usr].register_status!=1, "You have been registered");
        require(participants.length<=totalParticipants, "This round is full of player");
        allParticipants[usr].balance=0;
        allParticipants[usr].betFlag=0;
        allParticipants[usr].register_status=1;
        participants.push(usr);
    }
    function balanceRefresh() public{
        // top up balance
        for (uint256 i = 0; i < participants.length; i++) {
            address usr_id = participants[i];
            uint256 usr_balance=token.balanceOf(usr_id);
            allParticipants[usr_id].balance=usr_balance;
        }
    }
    function placeBet( uint256[] memory Number,uint256[] memory amount) public onlyParticipants{
        //Number is the list of number choosen by player, amount is the list of stake putted on each number
        address usr=msg.sender;
        //get the some of stake 
        uint256 sum = 0;
        for (uint256 i = 0; i < amount.length; i++) {
        sum += amount[i];
        }
        allParticipants[usr].stakeSum=sum;

        require(allParticipants[usr].betFlag==0, "You have placed bet on this slot");
        require(allParticipants[usr].balance>=sum, "You don't have enough balance");
        require(Number.length == amount.length, "Array lengths do not match");
        require(pickwinnerStatus == 1, "this round has full");
        token.transferFrom(usr,address(this),sum);
        //put Betinfo into participantInfo
        for (uint256 i = 0; i < Number.length; i++) {
            allParticipants[usr].BetInfo[Number[i]]=amount[i];
            ///generate seeds
            seeds=seeds*(Number[i]+1);
        }
        allParticipants[usr].betFlag=1;
        // token.transferFrom(usr,address(this),sum);

        //check whether start to pick winner
        uint256 activateParticipants=0;
        for (uint256 i = 0; i < participants.length; i++) {
            activateParticipants=activateParticipants+allParticipants[participants[i]].betFlag;
        }
        if (activateParticipants>=totalParticipants){
            pickwinnerStatus=0;
            pickWinner();
        }
    }
    function getRandomNumber() public view returns (uint256) {
        // Pseudo-random number generation based on block information and bet number
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, seeds)));
        // Modulo operation to limit the range of the random number
        randomNumber = randomNumber % 36;  // If you want numbers between 0 and 35
        return randomNumber;
    }
    function pickWinner() private {
        require(participants.length > 0, "No participants");
        winnerIndex = getRandomNumber();
        //get the winner number first
        for (uint256 i = 0; i < participants.length; i++) {
            address usr_id = participants[i];
            //give winner money if they win
            token.transfer(usr_id,allParticipants[usr_id].BetInfo[winnerIndex]*36);
            } 
            //refresh all varable
        
        for (uint256 i = 0; i < participants.length; i++) {
            participants[i];
            delete allParticipants[participants[i]];
            } 
        seeds=1;
        delete participants;
        pickwinnerStatus=1;

        }
    
    // For front end
    function getWinnerIndex() public view returns (uint256) {
        return winnerIndex;
    }
    function getUsrBalance(address usr) public view returns (uint256) {
        return allParticipants[usr].balance;
    }
    function getUsrStake(address usr) public view returns (uint256) {
        return allParticipants[usr].stakeSum;
    }
}
