import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

interface NavbarProps {
  items: {
    name: string;
    path: string;
  }[];
}

function Navbar({ items }: NavbarProps) {
  return (
    <>
    <nav className={styles["navbar"]}>
      <ul className={styles["nav_list"]}>
        {items.map((item, index) => (
          <li key={index} className="nav_item">
            <Link to={item.path}>
            <div className={styles.nav_item}>{item.name}</div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
    </>
  );
}

export default Navbar;