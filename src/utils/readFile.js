// import from constants

/**
 * @param {string} file_name - name of file
 * @returns {object} abi of that file
 */
export const readABI = (file_name) => {};

export const readMapping = (file_name) => {};

export const readJSON = async (fileName) => {
  try {
    // Dynamically import the JSON file based on the file name
    const data = require(`../constants/${fileName}`);
    return data;
  } catch (error) {
    console.error("Error importing JSON file: ", error);
    return null;
  }
};
