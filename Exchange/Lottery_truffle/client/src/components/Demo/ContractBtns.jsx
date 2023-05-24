import { Flex, Input, InputGroup } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { Button, Text } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/react';
import { useState, useEffect} from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractBtns({ setValue }) {
    const { state: { contract, accounts, web3 } } = useEth();
    const [inputValue, setInputValue] = useState("");
    const [luckyNumber, setLuckyNumber] = useState("");
    const [minValue, setMinValue] = useState("");
    const [numPlayers, setNumPlayers] = useState("");
    const [players, setPlayers] = useState([]);
    const [maxLotterySize, setmaxLotterySize] = useState("");
    const [eventBlocks, setEventBlocks] = useState(new Set());
    const [oldWinner, setWinner]= useState("");

    // console.log("Contract: ",contract);
    // console.log("Accounts:",accounts);
    
    useEffect(() => {
        if (contract === null || contract.methods === null) {
            return;
        }

        const item = localStorage.getItem("luckyNum");
        if(item){
            setLuckyNumber(item);
        }

        console.log("uuuu,",web3.utils.BN(parseInt(luckyNumber)));


        const getMinEntry = async () => {
            const value = await contract.methods.minEntryPrice().call();
            console.log("M: ",value);
            setMinValue(value)
            return value
        };

        const getmaxLotterySize = async () => {
          const value = await contract.methods.lotterysize().call();
          console.log("M: ",value);
          setmaxLotterySize(value)
          return value
      };

        const getNumPlayers = async () => {
            const players = await contract.methods.getPlayerCount().call();
            setNumPlayers(players);
            return players
        }

        const getEntry = async (index) => {
            const entry = await contract.methods.entries(index).call();
            console.log(entry);
            return entry
        }

      const getWinner = async () => {
        const winner = await contract.methods.winner().call();
        console.log("Winner: ",winner);
        return winner;
      }
      getWinner().then(result => setWinner(result));

        getMinEntry().then(result => console.log("M2",result ));
        getmaxLotterySize();

        contract.events.winnerPickedEvent(function(err, data) {
          if (err){
            console.error("Eventlistener: ",err);
            return;
          }
            if(eventBlocks.has(data.blockNumber)){
                return;
            }

            eventBlocks.add(data.blockNumber);


          const winner = data.returnValues.winner;
          console.warn("Winner: ",winner);
          alert("Lottery ended. The winner is: " + winner);
          localStorage.setItem("luckyNum","");

          setTimeout(() => window.location.reload(), 2000);
        });

        contract.events.LotteryClosedEvent(function (err, event) {
            if (err) {
                console.error("Eventlistener null?: ", err);
                return;
            }
            console.log(event);
            console.log("EVENTS: ", eventBlocks);

            if (eventBlocks.has(event.blockNumber)) {
                return;
            }


            eventBlocks.add(event.blockNumber);

            alert("Lottery ended. The numbers will be revealed");
            console.log(event);

            revealNumber();
        });






        getNumPlayers().then(result => {
            console.log("Players", result, typeof (result));
            collectEntries(parseInt(result));
        });

        const collectEntries = async(playerCount) => {
            const promises = [];
            for (let index = 0; index <playerCount; index++) {
                promises.push(getEntry(index));
            }

            try {
                const results = await Promise.all(promises);
                setPlayers(results);
            } catch (error) {
                console.log("An error occurred while fetching entries:", error);
            }
        };
    }, [contract]);

    const handleInputChange = e => {
        if (/^\d+$|^$/.test(e.target.value)) {
            setInputValue(e.target.value);
        }
    };
    const handleInputChangeLuckyNumber = e => {       
        if (/^\d+$|^$/.test(e.target.value)) {
            setLuckyNumber(e.target.value);
        }
    };

    const revealNumber = async () => {
        if(contract == null){
            return;
        }

        
        const item = localStorage.getItem("luckyNum");
        if(item == null){
            console.log("item zero: ");
        }
        setLuckyNumber(item);

        const luckyValue = parseInt(item);
            console.log("xxxx", luckyValue, typeof (x));
            console.log("xxxx", luckyValue == 1);
            console.log("val: ", luckyNumber);

            // luckyNumber is always undefined

        contract.methods.reveal(luckyValue).send({ from: accounts[0] },
            function (err, result) {
                if (err) {
                    console.log("Error!", err);
                    return
                }


                console.log("function called");
            });
    };

    // useEffect(() => {
    //     revealNumber();
    // }
    // , [eventBlocks]);

    const read = async () => {

        if(parseInt(inputValue) < minValue)
        {
            alert("Minimum value is "+minValue);
            return;
        }
        const value = await contract.methods.read().call({ from: accounts[0] });
        setValue(value);
    };

    const enterLottery = async e => {
        if (e.target.tagName === "INPUT") {
            return;
        }
        if (inputValue === "") {
            alert("Please enter a value to write.");
            return;
        }
        
        const newValue = parseInt(inputValue);
        if(newValue < minValue){
          alert("Please enter a value bigger than the max value.");
          return;
        }

        localStorage.setItem("luckyNum", luckyNumber);

        // https://ethereum.stackexchange.com/questions/96697/soliditys-keccak256-hash-doesnt-match-web3-keccak-hash
        const encoded = web3.eth.abi.encodeParameters(['address', 'uint'],[accounts[0],luckyNumber])
        const hash = web3.utils.sha3(encoded, {encoding: 'hex'})
        
        await contract.methods.enter(hash).send({ from: accounts[0], value:newValue},
            function (err, result) {
                if (err) {
                    console.log("Error!", err);
                    return
                }

                console.log("function called");
                setTimeout(() => window.location.reload(), 2000);
            });
    };

    const longPoll = () => {
        window.location.reload();
        setTimeout(longPoll, 5000); // call this function again after 5 seconds
    };

    useEffect(() => {
        if(contract == null || contract.methods  == null) {
            return;
        }
        longPoll();
    }, []);

    const bgstyle = {
        background: 'linear-gradient(to bottom, rgba(224, 244, 255, 1), #1e90ff)',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        left: '0',
        top:'0'
    };

    const containerOfMain = {
        background: 'rgba(255, 255, 255, 0.9)',
        height: '80vh',
        width: '80vw',
        position: 'fixed',
        left: '20vh',
        top: '10vh',
        borderRadius: '10px',
        boxShadow: '0 0 50px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)'/* Apply a 10px blur to the background */
    };
    const addresscontainer = {
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        boxShadow: '0 0 50px rgba(0, 0, 0, 0.2)',
        padding: '10px',
        backdropFilter: 'blur(10px)'/* Apply a 10px blur to the background */
    };


  return (
<div style={bgstyle}>
    <div style={containerOfMain}>
            <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={'gray.800'}>

            <Box
              display='flex'
              alignItems='left'
              justifyContent='center'
              top='-10vh'
              width='70%'
              color='teal'>

              <VStack
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  flexDirection='column'
                  width='50%'
                  padding='5px'
                  spacing='2vh'
              >
                  <Heading as='h2' size='4xl' noOfLines={2}>
                      Lottery D-App
                  </Heading>

                  <Text fontSize={'3xl'}>
                    Participate in our lottery contest by entering the amount and stand a chance to win prizes in the form of Ethereum coins
                  </Text>
                  <Text fontSize={'3xl'} color='teal'>
                      The total number of players are {numPlayers} from max {maxLotterySize} players.
                  </Text>
                  <Text as='h3' fontSize={'4xl'}>
                      Addresses participated :
                  </Text>
                  <div style={addresscontainer}>
                      <ul style={{ listStyle: 'none', overflowY: 'scroll', height: '15vh',width:'28vw', padding: '2px' }}>
                          {players.map((entry, index) => (
                              <li key={index} style={{ marginBottom: '10px' }}>
                                  {entry.player}
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* EntryLength: {entries.length} */}
              </VStack>

            </Box>

            <VStack
              display='flex'
              alignItems='center'
              justifyContent='center'
              width='50%'
            >

                <Text as='h4' fontSize={'3xl'} color='teal' top='25vh' maxWidth='20vw' textAlign='center'>
                    {oldWinner !== '' && (
                        <span fontSize={'2xl'}>
                            The previous winner is {oldWinner} <br />
                        </span>
                    )}
                    {oldWinner == '' && (
                        <span fontSize={'2xl'}>
                            Currently there's no winner!  <br />
                        </span>
                    )}
                </Text>

                <Text fontSize={'3xl'} color='teal'>
                    You have to enter a minimum of {minValue} ether to participate
                  </Text>
                <InputGroup>
                <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder='Enter the amount you want to bet'
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '5px',
                        padding: '10px',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                        fontSize: '1.2rem',
                        width: '20vw',
                        position: 'fixed',
                        right: '5vw',
                    }}/>
                </InputGroup>
                <InputGroup>
                <Input
                    value={luckyNumber}
                    onChange={handleInputChangeLuckyNumber}
                    placeholder='Enter the LuckyNumber you want to bet on'
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '5px',
                        padding: '10px',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                        fontSize: '1.2rem',
                        width: '20vw',
                        position: 'fixed',
                        right: '5vw',
                        bottom: '10vh'
                    }}/>
                </InputGroup>
                <Button
                    colorScheme='teal'
                    variant='outline'
                    onClick={enterLottery}
                    style={{
                        backgroundColor: 'teal',
                        color: 'white',
                        borderRadius: '5px',
                        padding: '10px',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                        fontSize: '1.2rem',
                        width: '20vw',
                        position: 'fixed',
                        bottom: '1vh'
                    }}
                >
                    Submit
                </Button>


            </VStack>

            </Flex>
    </div>
</div>

  );
}

export default ContractBtns;