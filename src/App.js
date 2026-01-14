import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import TabelaKursowa from './pages/TabelaKursowa';
import CenaZlota from './pages/CenaZlota';
import Menu from './pages/Menu';
import Autor from './pages/Autor';
import SzczegolyWaluty from "./pages/SzczegolyWaluty";

export default function App() {
return (
<Router>
  <Menu />
  <Routes>
    <Route path="/tabela-kursowa" element={<TabelaKursowa />} />
    <Route path="/cena-zlota" element={<CenaZlota />} />
    <Route path="/autor" element={<Autor />} />
    <Route path="/tabela-kursowa/:tabela/:waluta" element={<SzczegolyWaluty />}/>
    <Route path="*" element={<TabelaKursowa />} />
  </Routes>
</Router>
);
}