import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Approuter from "./routes/router";

function App() {
  useEffect(() => {
    document.title = "MAO MAY MẮN";
  }, []);

  return (
    <BrowserRouter>
      <Approuter />
    </BrowserRouter>
  );
}

export default App;
