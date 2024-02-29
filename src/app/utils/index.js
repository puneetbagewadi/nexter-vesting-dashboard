import BigNumber from "bignumber.js";
import { Contract } from "@ethersproject/contracts";
// import MigrationABI from "../abi/dwz-zee-migration.abi.json";
import VestingABI from "../abi/token-vesting.json";
import commaNumber from "comma-number";

BigNumber.config({ DECIMAL_PLACES: 18 });

export const getCurrentDate = () => new Date().getTime();

export const toBase = (value, decimals = 18) =>
  new BigNumber(value)
    .multipliedBy(10 ** decimals)
    .toFormat({ decimalSeparator: "." });

export const fromBase = (value, decimals = 18) =>
  new BigNumber(value).div(10 ** decimals).toFormat({ decimalSeparator: "." });

export const shorter = (str) =>
  str?.length > 8 ? str.slice(0, 6) + "..." + str.slice(-4) : str;

export const getUtcDateFormat = (value = "") =>
  value ? new Date(value * 1000).toUTCString() : 0;

export const formatToken = (tokenBNValue, tokenData) => {
  if (tokenBNValue) {
    const tokenBN = new BigNumber(tokenBNValue.toString());
    const decimalsBN = new BigNumber(10 ** tokenData.decimals);
    return tokenBN.dividedBy(decimalsBN);
  } else {
    return new BigNumber(0);
  }
};

export const numAsHex = (value, tokenData) => {
  let clippedFormat = new RegExp(
    "^-?\\d+(?:.\\d{0," + (parseInt(tokenData.decimals, 10) || -1) + "})?"
  );
  const tokenValue = value.toString().match(clippedFormat)[0];
  const bignumberFormatAmountToken = new BigNumber(tokenValue);
  const ten = new BigNumber(10);
  const multiplierAllowanceTokenB = ten.pow(tokenData.decimals);

  const amountOutToken = bignumberFormatAmountToken.times(
    multiplierAllowanceTokenB
  );
  return "0x" + amountOutToken.toString(16);
};

export const fetcher =
  (library, abi) =>
  (...args) => {
    const [arg1, arg2, ...params] = args;
    // it's a contract
    if (isAddress(arg1)) {
      const address = arg1;
      const method = arg2;
      const contract = new Contract(address, abi, library.getSigner());
      return contract[method](...params);
    }
    // it's a eth call
    const method = arg1;
    return library[method](arg2, ...params);
  };

// export const migrationContract = (library, stakingAddress) => {
//   return new Contract(stakingAddress, MigrationABI, library.getSigner());
// };

// const EthWeb3 = new Web3(EthRpcURL);
// export const getUserDWZBalance = async (account) => {
//   const contract = new EthWeb3.eth.Contract(ERC20ABI, DWZ_TOKEN_ADDR);
//   const tokenBalance = await contract.methods.balanceOf(account).call();
//   const balanceInWei = new BigNumber(tokenBalance).div(10 ** 18);

//   return balanceInWei.toString();
// };

export const vestingContract = (library, vestingAddress) => {
  return new Contract(vestingAddress, VestingABI, library?.getSigner());
};

export const truncateDecimales = (value) => {
  const number = Number(value);
  return commaNumber(Math.floor(number * 1000) / 1000);
};
export const arrayToObjectKeyIndexMap = (array) => {
  const initialValue = {};
  return array.reduce((obj, item, index) => {
    return {
      ...obj,
      [item]: index,
    };
  }, initialValue);
};
