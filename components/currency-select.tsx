"use client";
import { useState } from "react";
import { ChevronDown } from "./icons/chevron-down";
import { ChevronUp } from "./icons/chevron-up";

interface Currency {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  network: string;
  contractAddress: string | null;
}

interface Props {
  selectedCurrency: Currency;
  onSelect: (symbol: Currency) => void;
  currencies: Currency[];
}

export const CurrencySelect = ({ selectedCurrency, onSelect, currencies }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = currencies.find((c) => c.id === selectedCurrency.id);

  return (
    <div className="w-full bg-transparent">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col  items-center justify-center w-full p-2 rounded-lg"
      >
        <div className="w-full flex items-center gap-3 px-3">
          {selected && <img src={selected.icon} alt={selected.name} className="w-6 h-6" />}
          <div className="flex flex-col items-start justify-between gap-1">
            <span className="text-gray-500">{selected?.name || "Select currency"}</span>
            <span className="text-white font-semibold text-lg">{selected?.symbol}</span>
          </div>
          <div className="ml-auto">
             { isOpen ? <ChevronUp /> : <ChevronDown />  }
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 left-0 right-0 rounded-lg shadow-lg bg-white">
          {currencies.map((currency) => (
            <button
              key={currency.symbol}
              className="flex items-center w-full rounded-xl px-5 py-2 hover:bg-gray-200"
              onClick={() => {
                onSelect(currency);
                setIsOpen(false);
              }}
            >
              <img src={currency.icon} alt={currency.name} className="w-6 h-6 mr-2" />
              {currency.name} ({currency.symbol})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
