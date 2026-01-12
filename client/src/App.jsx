import { Route, Routes } from "react-router";
import Lobby from "./screens/Lobby";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Lobby />} />
      </Routes>
    </div>
  );
}

export default App;
