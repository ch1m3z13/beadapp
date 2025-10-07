// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProjectTracker {
    event ProjectTracked(address indexed user, string project);

    function trackProject(string calldata project) external {
        emit ProjectTracked(msg.sender, project);
    }
}