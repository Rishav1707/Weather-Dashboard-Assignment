import "./App.css";
import Header from "./components/header/header";
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
