import Cookies from "js-cookie";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/hompage/HomePage";
import PrivateRoute from "../components/PrivateRouter";
import HomeAdmin from "../pages/Admin/HomeAdmin";
import Login from "../pages/login/Login";
import HomeCasino from "../pages/casino/HomeCasino";
import BaccaratRoomList from "../pages/casino/LobbyCasino";
import LobbyRoom from "../pages/casino/LobbyRoom";
import CandleChart from "../pages/casino/chart/CandleChart";

import HomeNH from "../pages/NH/HomeNH";
import SlotNH from "../pages/NH/Slot";
import TableGameNew from "../pages/NH/TableGameNew";
import WintoolForward from "../pages/NH/WintoolForward";

const Approuter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Routes>
              <Route
                path="/"
                element ={
                  (Cookies.get("access_token") || localStorage.getItem("access_token"))
                  ? <Navigate to= "/homeNH" replace />
                  : <Navigate to= "/login" replace />
                }
              />
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<HomeAdmin />} />
              <Route path="/homeNH" element={<HomeNH />} />
              <Route path="/NH" element={<HomeNH />} />
              <Route path="/NH/slot/:room" element={<SlotNH />}/>
              <Route path="/NH/table/:room" element={<TableGameNew/>} />
              <Route path="/wintool-forward" element={<WintoolForward />} />
              {/* <Route path="/casino" element={<HomeCasino />} /> */}
              {/* <Route path="/casino/:id" element={<BaccaratRoomList />} />
              <Route path="/casino/room/:id" element={<LobbyRoom />} />
              <Route path="/chart" element={<CandleChart />} /> */}
            </Routes>
          </PrivateRoute>
        }
      />

    </Routes>
  );
};

export default Approuter;
