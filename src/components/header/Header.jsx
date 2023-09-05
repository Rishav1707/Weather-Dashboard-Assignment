import "./Header.css";
import icon from "../../assets/icon.svg";

const Header = () => {
  return (
    <div className="header">
      <img src={icon} alt="icon" />
      <h1>Weather Dashboard</h1>
    </div>
  );
};

export default Header;
