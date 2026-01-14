import { NavLink } from "react-router-dom";

export default function Menu() {
  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <NavLink to="/tabela-kursowa" style={{ marginRight: 12 }}>
         Strony Waluty
      </NavLink>
      <NavLink to="/cena-zlota" style={{ marginRight: 12 }}>
        Cena Złota
      </NavLink>
      <NavLink to="/autor">
        Autor
      </NavLink>
    </nav>
  );
}
