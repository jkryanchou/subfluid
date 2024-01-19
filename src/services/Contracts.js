
const USDC = {
  address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
  abi: [
    "function approve(address spender, uint256 amount) external returns (bool)",
  ],
  decimals: BigInt(1e6),
};

const AAVE = {
  address: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
  abi: [
      "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external",
      "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external"
  ],
};

const GHO = {
  address: "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
  abi: [
      "function transfer(address to, uint256 amount) external returns (bool)",
  ],
  decimals: BigInt(1e18),
};

export { USDC, AAVE, GHO}
