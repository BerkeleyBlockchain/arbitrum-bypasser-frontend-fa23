import { parseABI } from "./parse";
import { readJSON } from "./readFile";

// return dict protocol to name and etc
export const fetchProtocolList = async (mainnet_bool) => {
  const testnet_map = await readJSON("testnet_map.json");
  const mainnet_map = await readJSON("mainnet_map.json");

  if (mainnet_bool) {
    return mainnet_map;
  } else {
    return testnet_map;
  }
};

// return dict function to params
export const fetchFunctionList = async (mainnet_bool, protocol_address) => {
  const protocol_list = await fetchProtocolList(mainnet_bool);
  const protocol = protocol_list[protocol_address];

  // const name = protocol["name"];
  const file = protocol["file"];

  const fileroute = mainnet_bool ? `mainnet/${file}` : `testnet/${file}`;
  const abi = await readJSON(fileroute);

  const map = parseABI(abi);

  return map;
};

export const fetchParamFields = (mainnet_bool, function_list) => {};
