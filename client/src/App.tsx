import "./App.scss";
import Config from "./config.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
import GameScreen from "./components/GameScreen";
import { PlayerProvider } from "./contexts/PlayerContext";

interface AppProps {}

function App({}: AppProps) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{Config.common.title}</title>
      </Helmet>
      <div className="App">
        <PlayerProvider>
          <GameScreen />
        </PlayerProvider>
      </div>
    </HelmetProvider>
  );
}

export default App;
