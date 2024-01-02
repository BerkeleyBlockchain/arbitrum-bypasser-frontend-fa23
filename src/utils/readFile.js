// import from constants

import { forEachChild } from "typescript";

/**
 * @param {string} file_name - name of file
 * @returns {object} abi of that file
 */
export const readABI = async (fileName) => {
  try {
    // Dynamically import the JSON file based on the file name
    const data = await import(`../contractABIs/testnet/${fileName}`);
    return data.default;
  } catch (error) {
    console.error("Error importing JSON file: ", error);
    return null;
  }
};

export const readABIFunctions = async (fileName) => {
  try {
    // Dynamically import the JSON file based on the file name
    const rawData = await import(`../contractABIs/testnet/${fileName}`);
    const data = rawData.default;
    const reorg = {};

    data.forEach((object) => {
      if (object.type === "function") {
        reorg[object.name] = { ...object };
      }
    });

    return reorg;
  } catch (error) {
    console.error("Error importing JSON file: ", error);
    return null;
  }
};
