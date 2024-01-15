import { NextResponse } from "next/server";

import { getL2Network } from "@arbitrum/sdk/dist/lib/dataEntities/networks";
import { InboxTools } from "@arbitrum/sdk/dist/lib/inbox/inbox";
import { arbitrum, arbitrumSepolia } from "viem/chains";
import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers/src.ts/json-rpc-provider";

export async function GET(request) {
  // console.log(getL2Network);
  // console.log(InboxTools);
  // console.log(arbitrum);
  // console.log(arbitrumSepolia);
  console.log(JsonRpcProvider);
  // console.log(ethers.provider);

  try {
    const data = {
      l1TxHash: "0x1234567890",
      l2TxHash: "0x0987654321",
      status: false,
    };
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
