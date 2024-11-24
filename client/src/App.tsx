import "./App.css";

import RealTime from "./components/RealTime";
import { BrowserRouter as Router ,Route, Routes } from "react-router-dom";
import Something from "./components/something";
import OldData from "./components/OldData";

const App = () => {
  return (
    <Router>
      <div className=" h-screen">
        <Routes>
          <Route path="/realtime" element={<RealTime/>}/>
          <Route path="/olddata" element={<OldData/>}/>
        </Routes>

      </div>
    </Router>

  );
};

export default App;
