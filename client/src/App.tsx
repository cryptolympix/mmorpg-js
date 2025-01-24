import "./App.scss";
import Config from "../../shared/config.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
import GameScreen from "./components/GameScreen";
import { GameProvider } from "./contexts/GameContext";

interface AppProps {}

function App({}: AppProps) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{Config.common.title}</title>
      </Helmet>
      <div className="App">
        <GameProvider>
          <GameScreen />
        </GameProvider>
      </div>
    </HelmetProvider>
  );
}

export default App;
