interface ICurrency {
    id: string;
    name: string;
    type: string;
    symbol: string;
    icon: string;
    network: string;
    contractAddress: string | null;
    minAmount: number;
    maxAmount: number;
}

export type { ICurrency }