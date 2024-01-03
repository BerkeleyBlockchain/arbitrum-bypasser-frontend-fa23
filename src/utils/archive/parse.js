/**
 * @param {object} abi - ABI of contract in json dictioanry format
 * @returns {object} mapping of function names to function signatures
 */
export const parseABI = (abi) => {
  const functionMap = {};

  abi.forEach((item) => {
    if (item.type === "function") {
      functionMap[item.name] = item.inputs;
    }
  });

  return functionMap;
};
