import { React } from "react";
import axios from "axios";
// const axios = require("axios");

export async function getLastTransactions(account, num = 5) {
  const apiKey = process.env.REACT_APP_ETHERSCAN;
  // change url if not using sepolia
  const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&page=1&offset=${num}&sort=desc&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const transactions = response.data.result;
    return transactions.slice(0, num); // Return the last 5 transactions
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
}
