// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    uint public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    string public name = "Stakes";
    string public symbol = "L";
    uint8 public decimals = 18;
    address public creator;
    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this function");
        _;
    }

    constructor() {
        creator = msg.sender;
    }

    function transfer(address recipient, uint amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
    function approve(address spender, uint amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
    // I should only let the creater to call this function, now everyone is able to do it
    function mint(address mint_to_address,uint amount) external onlyCreator{
        balanceOf[mint_to_address] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }


    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
    // function balanceOf(address usr_) external returns(uint){
    //     uint balance=balanceOf[usr_];
    //     return balance;
    // }
}