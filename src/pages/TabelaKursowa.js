import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TabelaKursowa() {
  const [rates, setRates] = useState([]);
  const [table, setTable] = useState("A");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    fetch(`https://api.nbp.pl/api/exchangerates/tables/${table}?format=json`)
      .then(res => res.json())
      .then(data => {
        setRates(data[0].rates);
        if (data[0].rates.length > 0) {
          setSelectedCurrency(data[0].rates[0].code); 
        }
      });
  }, [table]);

  const handleGo = () => {
    if (selectedCurrency) {
      navigate(`/tabela-kursowa/${table}/${selectedCurrency}`);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Tabela kursów walut NBP</h2>

      <label>
        Wybierz tabelę:
        <select value={table} onChange={e => setTable(e.target.value)}>
          <option value="A">Tabela A</option>
          <option value="B">Tabela B</option>
          <option value="C">Tabela C</option>
        </select>
      </label>

      <br /><br />

      <label>
        Wybierz walutę:
        <select
          value={selectedCurrency}
          onChange={e => setSelectedCurrency(e.target.value)}
        >
          {rates.map(r => (
            <option key={r.code} value={r.code}>
              {r.currency} ({r.code})
            </option>
          ))}
        </select>
      </label>

      <button
        style={{ marginLeft: 12 }}
        onClick={handleGo}
      >
        Przejdź
      </button>

      <br /><br />

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Waluta</th>
            <th>Kod</th>
            {table === "C" ? (
              <>
                <th>Kupno</th>
                <th>Sprzedaż</th>
              </>
            ) : (
              <th>Kurs średni</th>
            )}
          </tr>
        </thead>

        <tbody>
          {rates.map(r => (
            <tr key={r.code}>
              <td>{r.currency}</td>
              <td>{r.code}</td>
              {table === "C" ? (
                <>
                  <td>{r.bid}</td>
                  <td>{r.ask}</td>
                </>
              ) : (
                <td>{r.mid}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
