// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Treasury.sol";
import "./Token.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";


contract Gov {
    address public treasury;
    address public daoToken;
    uint256 proposalThreshold = 1e18; // 最小投票 token 数
    uint256 succeededVotes = 1000; // 超过 1/10 投票即为成功通过
    //    uint256 failed = 10;
    //    bool active = false;
    //    uint256 startDelayPeriod = 0;
    //    uint256 endDelayPeriod = startDelayPeriod + 3 days;
    /// @notice The total number of proposals
    //    uint256 public proposalCount;
    //    bool unlock = false;

    struct Voter {
        /// @notice Whether or not a vote has been cast
        bool hasVoted;
        /// @notice Whether or not the voter supports the proposal
        bool support;
        /// @notice The number of votes the voter had, which were cast
        uint256 votes;
    }

    struct Proposal {
        uint256 id; // 提案 id
        address proposer; // 提案人
        uint256 approvalVotes; // 当前支持票数
        uint256 againstVotes; // 当前反对票数
//        address targets;
//        bytes[] calldatas;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => Voter) public voters;

    constructor(
        address _daoToken,
        address _treasury
    ) public {
        treasury = _treasury;
        daoToken = _daoToken;
    }

    // 提案
    function propose(uint256 proposalId) external {
        Proposal memory newProposal = Proposal({
        id : proposalId,
        proposer : msg.sender,
        approvalVotes : 0,
        againstVotes : 0,
        executed : false

        });
        proposals[newProposal.id] = newProposal;
    }

    // 持有 token 进行投票
    function vote(
        address voter,
        uint256 proposalId,
        bool support
    ) public {
        Proposal storage proposal = proposals[proposalId];
        Voter storage sender = voters[voter];
        require(!sender.hasVoted, "Already voted.");
        uint256 balance = Token(daoToken).balanceOf(msg.sender);
        require(balance >= proposalThreshold, "proposer votes below proposal threshold");
        uint256 votes = SafeMath.div(balance, proposalThreshold);
        if (support) {
            proposal.approvalVotes = SafeMath.add(proposal.approvalVotes, votes);
        } else {
            proposal.againstVotes = SafeMath.add(proposal.againstVotes, votes);
        }
        sender.hasVoted = true;
        sender.support = support;
        sender.votes = votes;
    }

    // 执行提案
    function execute(uint256 proposalId, address to) external {
        console.log("approvalVotes: ", proposals[proposalId].approvalVotes);
        require(proposals[proposalId].approvalVotes >= succeededVotes, "cannot executed proposal");
        //        require(block.timestamp >= endDelayPeriod, "invalid time");
        // TODO: 暂时定为任何一个提案都可以提取资金, 需要改成读取 proposal 并执行
//        address payable treasuryAddress = address(uint160(treasury));
        Treasury(payable(treasury)).withdraw(to);
        proposals[proposalId].executed = true;
    }
}