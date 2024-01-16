import { React } from "react";
import axios from "axios";
// const axios = require("axios");

const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/v1/scanner/getTransactions`;

export async function getLastTransactions(account, num = 5, livenet) {
  const queryParams = {
    account: account,
    livenet: livenet, // Use a boolean value
  };

  try {
    const response = await axios.get(apiUrl, { params: queryParams });
    // console.log(response);

    if (response.status !== 200 && response.status !== 201) {
      console.error("Response from scanner failed:", response);
      return [];
    }
    // console.log(response.data);

    const transactions = response.data.message?.result;
    // console.log(transactions);
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}
