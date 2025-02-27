"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "./icons/chevron-down";
import { ChevronUp } from "./icons/chevron-up";
import { ICurrency } from "@/features/exchange/model/types";

interface Props {
  selectedCurrency: ICurrency;
  onSelect: (currency: ICurrency) => void;
  currencies: ICurrency[];
}

export const CurrencySelect = ({ selectedCurrency, onSelect, currencies }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const selected = currencies.find((c) => c.id === selectedCurrency.id);
  const dropdownRef = useRef<HTMLDivElement>(null); 

  const filteredCurrencies = currencies.filter((currency) =>
    (activeTab === "all" || currency.type === activeTab) &&
    (currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []); 

  console.log("render CurrencySelect")

  return (
    <div className="w-full bg-transparent transition-all duration-300 ease-in-out" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col z-50  items-center justify-center w-full p-2 rounded-xl"
      >
        <div className="w-full flex items-center gap-3 px-3">
          {selected && <img src={selected.icon} alt={selected.name} className="w-6 h-6" />}
          <div className="flex flex-col items-start justify-between gap-1">
            <span className="text-gray-500">{selected?.name || "Select currency"}</span>
            <span className="text-white font-semibold text-lg">{selected?.symbol}</span>
          </div>
          <div className={`ml-auto transition-transform align-bottom duration-300 z-10 ${isOpen ? "rotate-180" : "rotate-0"}`}>
            <ChevronDown /> 
          </div>
        </div>
      </button>

      <div
        className={`absolute w-full left-0 right-0 px-5 py-3 mt-1 bg-white border-2 border-t-0 border-gray-200 flex flex-col gap-5 rounded-br-lg rounded-bl-lg shadow-lg 
          transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
          }`}
      >
      {isOpen && (
        <>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-200 focus-within:border-gray-500 rounded-xl focus:outline-none"
          />

          <div className="flex gap-2">
              {["All", "Crypto", "Bank", "Cash"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === tab.toLocaleLowerCase() ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab.toLocaleLowerCase())}
                >
                  {tab}
                </button>
              ))}
            </div>

          <div className="max-h-52 overflow-y-auto">
            {filteredCurrencies.map((currency) => (
              <button
                key={currency.name}
                className="flex items-center w-full rounded-xl py-2 hover:bg-gray-200"
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
          </>
      )}
      </div>
    </div>
  );
};
