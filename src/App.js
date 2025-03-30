import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "./App.css";

const API_URL = "https://api.exchangerate-api.com/v4/latest/";

export default function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState({});
  const [convertAmount, setConvertAmount] = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    fetch(`${API_URL}${fromCurrency}`)
      .then((res) => res.json())
      .then((data) => setExchangeRate(data.rates))
      .catch((err) => console.error("Failed to fetch"));
  }, [fromCurrency]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const availableCurrencies = useMemo(() => Object.keys(exchangeRate), [exchangeRate]);

  const convert = useCallback(() => {
    if (exchangeRate[toCurrency]) {
      const rate = exchangeRate[toCurrency];
      setConvertAmount((amount * rate).toFixed(2));
    }
  }, [amount, toCurrency, exchangeRate]);

  return (
    <div className="app">
      <h1>Currency Converter</h1>
      <div>
        <input
          type="number"
          ref={inputRef}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {availableCurrencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {availableCurrencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
        <button onClick={convert}>Convert</button>
      </div>
      <h2>Convert Amount: {convertAmount}</h2>
    </div>
  );
}