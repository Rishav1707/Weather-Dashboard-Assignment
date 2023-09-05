import "./App.css";
import Header from "./components/header/Header";
import Card from "./components/weather-card/Card";

const App = () => {
  return (
    <div className="App">
      <Header />
      <Card />
    </div>
  );
};

export default App;
