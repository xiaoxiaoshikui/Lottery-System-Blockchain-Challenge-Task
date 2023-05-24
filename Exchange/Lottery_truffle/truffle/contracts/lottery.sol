// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Lottery {
    address payable public owner;
    
    uint256 offSet = 0;



    // map the range (depending on entry price payed to the adress of the user
    GameEntry[] public entries;

    // represesents one ticket; 
    // rangeEnd = offset + payed_entry
    struct GameEntry {
        uint256 rangeEnd;
        address payable player;
    }

    // save winner for quering the result to show the user
    address payable public  winner;
    //event for winner
    event winnerPickedEvent(address indexed winner);
    
    event LotteryClosedEvent();


    // min Value to send for entry in WEI
    uint256 public minEntryPrice;
    // count of players until game starts
    uint256 public lotterysize;


    bool entryPhase = true;

    mapping(address => Random) public random;
    struct Random {
        bytes32 commit;
        uint256 blockNumber;
        bool revealed;
    }
    uint revealedCounter = 0;

    // used for random generation
    uint256 noonce = 0;
    bytes32 seed;


    constructor(uint256 _minEntryPrice, uint256 _lotterysize) {
        owner = payable(msg.sender);
        minEntryPrice = _minEntryPrice;
        lotterysize = _lotterysize;
    }

    //Enter lottery function
    function enter(bytes32 luckyHash) public payable {
        // check that the min amount is payed
        require(entryPhase, "not in enter phase!");
        require(msg.value > minEntryPrice, "Not enough paid for lottery ticket");
        require(entries.length < lotterysize, "lottery is already full");
        require(luckyHash > 0, "luckyHash Null");

        //calc new Offset => set range in WEI and player
        offSet = offSet + msg.value;

        //might needds memory or storage keyword or sth
        entries.push(GameEntry(offSet, payable(msg.sender)));

        random[msg.sender] = Random(luckyHash, block.number,false);

        // if game is full, start picking winner process
        if(entries.length == lotterysize){
            // fire event
            entryPhase = false;
            emit LotteryClosedEvent();
        }
    }

    function reveal(uint luckyNumber) public {
        require(!entryPhase, "not in reveal phase");
        require(random[msg.sender].blockNumber != 0, "Must commit");
        require(random[msg.sender].revealed == false, "already revealed");
        require(getLuckyHash(luckyNumber) == random[msg.sender].commit, "invalid luckyNumber");
        require(block.number > random[msg.sender].blockNumber, "reveal too early");

        random[msg.sender].revealed = true;
        revealedCounter++;
        setRandom(luckyNumber);
        
        if(revealedCounter == lotterysize){
            pickWinner();
        }
    }

    function getLuckyHash(uint luckyNumber) public view returns (bytes32){
        return keccak256(abi.encode(msg.sender, luckyNumber));
    }

    function getLuckyHash2(uint luckyNumber, address x) public pure returns (bytes32){
        return keccak256(abi.encode(x, luckyNumber));
    }
   
    //set seed
    function setRandom(uint salt) private{
        noonce++;// in case multiple calls in one block
        seed = keccak256(abi.encode(seed, block.timestamp, block.prevrandao, noonce, salt));
    }

    function getRandom(uint256 max) private view returns (uint256) {
        return uint256(seed) % max;
    }

    //Picking winnner using random number
    function pickWinner() private  {
        // check lottery is full, before start
        require(entries.length == lotterysize, "lottery not full yet");
        require(!entryPhase, "not in reveal phase");

        uint256 range = getRandom(offSet);

        bool stopLoop = false;        
        // loop over all entries
        for (uint i=0; i<entries.length && !stopLoop; i++) {

            // if the rangeEnd is bigger than the range => than won
            if (entries[i].rangeEnd > range) {
                winner = entries[i].player;
                stopLoop = true;
            }
        }
        // if has no winner
        require(stopLoop,"Could not find a winner!");

        //transfer reward to the winner
        winner.transfer(address(this).balance);
        emit winnerPickedEvent(winner);

        //reset the state of the contract
        delete offSet;
        for (uint i=0; i<entries.length; i++) {
            delete random[entries[i].player];
        }
        delete entries;

        entryPhase = true;
        delete revealedCounter;
    }

    function getPlayerCount() public view returns(uint256){
        return entries.length;
    }

    function resetContract() public {
        require(!entryPhase, "not in reveal phase");
        uint lastBlock = random[entries[entries.length-1].player].blockNumber;
        require(block.number > lastBlock + 172800); // reset contract only possible after some time;

        for (uint i=0; i<entries.length; i++) {
            uint balance = 0;
            if(i > 0){
                balance = entries[i].rangeEnd - entries[i-1].rangeEnd;
            }else{
                // first player: range from 0 -
                balance = entries[i].rangeEnd;
            }

            if(random[entries[i].player].revealed){
                entries[i].player.transfer(balance);
            }else{
                // if has not number revealed in time. money goes to owner
                owner.transfer(balance);
            }

            delete random[entries[i].player];
        }
        delete entries;
        delete offSet;

        entryPhase = true;
        delete revealedCounter;
    }
}