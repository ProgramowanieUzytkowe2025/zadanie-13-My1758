import { useEffect, useState } from "react";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function CenaZlota() {
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState([]);
  const [days, setDays] = useState(10); // số ngày, mặc định 10

  useEffect(() => {
    // Giá vàng hiện tại
    fetch("https://api.nbp.pl/api/cenyzlota?format=json")
      .then(res => res.json())
      .then(data => setPrice(data[0]));

    // Lịch sử giá vàng
    fetch(`https://api.nbp.pl/api/cenyzlota/last/${days}?format=json`)
      .then(res => res.json())
      .then(data => setHistory(data));
  }, [days]); // khi days thay đổi, fetch lại history

  const chartData = {
    labels: history.map(item => item.data),
    datasets: [
      {
        label: "Cena złota (PLN)",
        data: history.map(item => item.cena),
        borderColor: "gold",
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Cena Złota</h2>

      {price && (
        <p>
          <strong>Aktualna cena:</strong> {price.cena} PLN ({price.data})
        </p>
      )}

      {/* Input số ngày */}
      <div style={{ margin: "16px 0" }}>
        <label>
          Liczba ostatnich notowań:{" "}
          <input
            type="number"
            value={days}
            min={1}
            max={100}
            onChange={e => setDays(e.target.value)}
          />
        </label>
      </div>

      <h3>Zmiana ceny złota w ostatnich {days} dniach</h3>

      {history.length > 0 && <Line data={chartData} />}
    </div>
  );
}
