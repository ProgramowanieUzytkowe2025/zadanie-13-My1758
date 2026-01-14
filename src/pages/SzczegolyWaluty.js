import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function SzczegolyWaluty() {
  const { waluta, tabela } = useParams();
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  // Lấy thông tin chi tiết tiền tệ
  useEffect(() => {
    fetch(`https://api.nbp.pl/api/exchangerates/rates/${tabela}/${waluta}?format=json`)
      .then(res => res.json())
      .then(res => setData(res));
  }, [waluta, tabela]);

  // Lấy lịch sử 30 ngày để vẽ biểu đồ
  useEffect(() => {
    fetch(`https://api.nbp.pl/api/exchangerates/rates/${tabela}/${waluta}/last/30?format=json`)
      .then(res => res.json())
      .then(res => setHistory(res.rates));
  }, [waluta, tabela]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setResult(null);

    let searchDate = date;

    while (true) {
      try {
        const res = await fetch(
          `https://api.nbp.pl/api/exchangerates/rates/${tabela}/${waluta}/${searchDate}?format=json`
        );

        if (!res.ok) {
          searchDate = previousDay(searchDate);
          continue;
        }

        const data = await res.json();
        const rate = data.rates[0].mid;

        setResult((amount * rate).toFixed(2));
        break;
      } catch {
        setError("Błąd pobierania danych");
        break;
      }
    }
  };

  function previousDay(dateStr) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  }

  if (!data) return <p>Ładowanie danych…</p>;

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: history.map(d => d.effectiveDate),
    datasets: [
      {
        label: waluta,
        data: history.map(d => d.mid),
        borderColor: "blue",
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Szczegóły waluty</h2>
      <p><strong>Nazwa:</strong> {data.currency}</p>
      <p><strong>Kod:</strong> {data.code}</p>
      <p><strong>Aktualny kurs:</strong> {data.rates[0].mid} PLN</p>

      <hr />

      <h3>Przelicz walutę na PLN</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Kwota:
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Data:
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </label>
        </div>

        <button type="submit">Przelicz</button>
      </form>

      {result && (
        <p>
          <strong>Wynik:</strong> {amount} {data.code} = {result} PLN
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      <h3>Historia kursu (ostatnie 30 dni)</h3>
      {history.length > 0 && <Line data={chartData} />}
    </div>
  );
}
