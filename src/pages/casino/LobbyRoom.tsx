import React, { useEffect, useRef, useState } from "react";
import { toZonedTime, format } from 'date-fns-tz';
import { DateTime } from 'luxon';
import ResultTable from "../../components/ResultTable";
import Header from "../../components/Header";
import ModalConfirmLogout from "../../components/ModalConfirmLogout";
import { Col, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ScoreBoard from "../../components/ScoreBoard";
import CandleChart from "./chart/CandleChart";
const Cookies = require("js-cookie");

const LobbyRoom: React.FC = () => {
  const [isShowLogout, setIsShowLogout] = useState(false);
  const [dataRoom, setDataRoom] = useState<any>();
  const [coin, setCoin] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rateWin, setRateWin] = useState<number>();
  const [isPlayer, setIsPlayer] = useState<string>();
  const [image, setImage] = useState<string>();
  const [tableRound, setTableRound] = useState<any>();
  const [shuffle, setShuffle] = useState<number | null>(null);
  const [selectedKey, setSelectedKey] = useState<number | null>(1);

  const { id } = useParams();
  const token = Cookies.get("access_token");

  const userInfoString = localStorage.getItem("user_info");
  const navigate = useNavigate();

  useEffect(() => {
    if (dataRoom?.totalRound?.length) {
      axios
        .post(
          `${process.env.REACT_APP_URL_API}/users/subtract-coins-for-action`,
          {
            amount: 1,
            action: "PLAY_GAME",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => setCoin(data.data.coins))
        .catch((err) => {
          if (
            err.status === 400 &&
            err.response.data.message ===
              "Số xu hiện tại không đủ để thực hiện hành động: PLAY_GAME"
          ) {
            Swal.fire({
              icon: "error",
              title: "Lỗi tải dữ liệu",
              text: err.response.data.message,
              customClass: {
                popup: "bg-custom-image text-white",
              },
            });
            navigate("/casino/lobby");
          }
        });
    }
  }, [dataRoom?.totalRound?.length, token, navigate]);

  if (userInfoString) {
    const userInfo = JSON.parse(userInfoString);

    userInfo.coins = coin;

    localStorage.setItem("user_info", JSON.stringify(userInfo));
  }

  useEffect(() => {
    if (dataRoom === undefined) {
      setLoading(true);

      Swal.fire({
        title: "Đang tải dữ liệu trò chơi",
        html: "Load <b></b> Data.",
        timerProgressBar: true,
        customClass: {
          popup: "bg-custom-image text-white",
        },
        willOpen: () => {
          Swal.showLoading();
        },
      });
    }
    if (dataRoom) {
      // Khi có data thì đóng Swal
      Swal.close();
      setLoading(false);
    }
  }, [dataRoom]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      axios
        .get(
          `${process.env.REACT_APP_URL_API_CASINO}/predict/get-table-by-name?tableName=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => {
          setRateWin(data.data.percentCurrent.Forecast);
          setIsPlayer(data.data.percentCurrent.Round);
          setDataRoom(data.data);
        })
        .catch((err) => console.log(err));
    }, 1000); // Delay 1 giây

    return () => clearTimeout(timeout);
  }, [id, token, dataRoom]);

  useEffect(() => {
    if (isPlayer === "P") {
      setImage("/assets/casino/symbol_p.png");
    } else {
      setImage("/assets/casino/symbol_b.png");
    }
    if (dataRoom) {
      setTableRound(dataRoom?.groupRoad);
    }
    if (dataRoom?.shuffle !== 0) {
      setShuffle(0);
    }
    if (dataRoom && selectedKey === 1) {
      setTableRound(dataRoom?.ai0);
    }
    if (dataRoom && selectedKey === 2) {
      setTableRound(dataRoom?.ai1);
    }
    if (dataRoom && selectedKey === 3) {
      setTableRound(dataRoom?.ai2);
    }
    if (dataRoom && selectedKey === 4) {
      setTableRound(dataRoom?.ai3);
    }
    if (dataRoom && selectedKey === 5) {
      setTableRound(dataRoom?.ai4);
    }
    if (dataRoom && selectedKey === 6) {
      setTableRound(dataRoom?.ai5);
    }
  }, [isPlayer, dataRoom]);

  const lengthArray = new Array(tableRound?.groupRoad?.table.length).fill(null);
  // console.log(dataRoom?.totalRound);

  let countDown = 0;

  if (dataRoom?.statusGame === "GP_NEW_GAME_START") {
    const currentTime = dataRoom?.timeCurrent || DateTime.now().setZone("Asia/Ho_Chi_Minh", { keepLocalTime: false });
    const roundStartTime = dataRoom?.roundStartTime;
    const timePassed = currentTime - roundStartTime;
    const totalDuration = dataRoom?.iTime * 1000;
    const countDownUnix = Math.max(totalDuration - timePassed, 0);
    countDown = Math.floor(countDownUnix / 1000);
  }

  return (
    <>
      <Header setIsShowLogout={() => setIsShowLogout(true)} />
      <ModalConfirmLogout
        isShowLogout={isShowLogout}
        setIsShowLogout={() => {
          setIsShowLogout(false);
        }}
      />
      <div
        className="w-full min-h-screen mx-auto  text-white relative  p-4"
        id="app"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-center text-green-400 w-full md:w-2/3">
            Công thức AI
          </h1>
          <div className="w-full md:w-1/3 flex justify-center md:justify-end mt-4 md:mt-0">
            <a
              href="/casino/lobby"
              className="text-white px-4 py-2 rounded-lg shadow box-goto-lobby w-[10rem]"
            >
              Quay lại
            </a>
          </div>
        </div>
        {!loading && (
          <div className="container mx-auto">
            <Row className="px-5 flex justify-between">
              <Col xs={24} md={5}>
                <div className="w-full  p-3 rounded-md sec-formula_wrapper bg-black/50 ">
                  <h2 className="text-lg font-semibold mb-4 flex items-center justify-center">
                    Công thức AI
                  </h2>

                  <div className="space-y-2 ">
                    {Array.from({ length: 6 }, (_, i) => {
                      const aiData = dataRoom?.[`ai${i}`];
                      const win = aiData?.percentCurrent?.Forecast ?? 0;

                      return (
                        <div
                          key={i + 1}
                          className={`bg-green-600 px-3 py-2 hover:bg-green-500 cursor-pointer transition flex flex-col items-center justify-center ${
                            selectedKey === i + 1
                              ? "ring-2 ring-yellow-400"
                              : ""
                          }`}
                          onClick={() => setSelectedKey(i + 1)}
                        >
                          <p className="font-bold">
                            Công thức AI {i + 1} - {Math.round(win)}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Col>
              <Col xs={24} md={11}>
                <div className="w-full grid gap-5 ">
                  <div className="p-4 rounded-md score-board">
                    <ScoreBoard
                      dataRound={tableRound}
                      countDown={countDown}
                      shuffle={shuffle}
                    />
                    <ResultTable tableData={dataRoom?.totalRound} />
                  </div>
                  <Row>
                    <Col xs={12} md={8}>
                      <div className="box-statistic">
                        <h1
                          className=" text-center text-[20px] bg-[conic-gradient(from_342deg,_#0062cc_20%,_#0062cc_44%,_#0062cc)] bg-clip-text text-transparent drop-shadow-[0_0_10px_#0062cc]"
                          style={{
                            WebkitTextStrokeWidth: "0.5px",
                            WebkitTextStrokeColor: "white",
                          }}
                        >
                          PLAYER
                        </h1>
                        <h3
                          id="chart_1"
                          className="text-white !text-[2em] font-semibold text-center blue gt-50 red"
                          data-percent="43"
                        >
                          <div
                            className="progress-pie-chart"
                            id="chart_1"
                            data-percent="0"
                          >
                            <div className="ppc-progress">
                              <div className="ppc-progress-fill">
                                {tableRound?.percentCurrent.Player}%
                              </div>
                            </div>
                          </div>
                        </h3>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="box-statistic">
                        <h1
                          className="text-center text-[20px]  bg-[linear-gradient(177deg,_#28a745_20%,_#28a745_44%,_#28a745)] bg-clip-text text-transparent drop-shadow-[0_0_10px_#0062cc]"
                          style={{
                            WebkitTextStrokeWidth: "0.5px",
                            WebkitTextStrokeColor: "white",
                          }}
                        >
                          TIE
                        </h1>
                        <h3
                          id="chart_1"
                          className="text-white !text-[2em] font-semibold text-center blue gt-50 red"
                          data-percent="43"
                        >
                          <div
                            className="progress-pie-chart"
                            id="chart_1"
                            data-percent="0"
                          >
                            <div className="ppc-progress">
                              <div className="ppc-progress-fill"></div>
                            </div>
                            <div className="ppc-percents">
                              <div className="pcc-percents-wrapper">
                                {tableRound?.percentCurrent.Tier}%
                              </div>
                            </div>
                          </div>
                        </h3>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="box-statistic">
                        <h1
                          className="text-center text-[20px]  bg-[linear-gradient(342deg,_#dc3545_20%,_#dc3545_44%,_#dc3545)] bg-clip-text text-transparent drop-shadow-[0_0_10px_#0062cc]"
                          style={{
                            WebkitTextStrokeWidth: "0.5px",
                            WebkitTextStrokeColor: "white",
                          }}
                        >
                          BANKER
                        </h1>
                        <h3
                          id="chart_1"
                          className="text-white !text-[2em] font-semibold text-center blue gt-50 red"
                          data-percent="43"
                        >
                          <div
                            className="progress-pie-chart"
                            id="chart_1"
                            data-percent="0"
                          >
                            <div className="ppc-progress">
                              <div className="ppc-progress-fill"></div>
                            </div>
                            <div className="ppc-percents">
                              <div className="pcc-percents-wrapper">
                                {tableRound?.percentCurrent.Banker}%
                              </div>
                            </div>
                          </div>
                        </h3>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={24} md={7}>
                <div className="  sec-innerRoom col-12 col-md-12 d-flex align-items-center">
                  <div className="graph position-relative h-[70vh]">
                    <div className="graph-title">
                      <h1 id="graph_title">
                        Đồ thị thể hiện tỷ lệ dự đoán thắng theo công thức AI
                      </h1>
                    </div>
                    <CandleChart rounds={lengthArray} />
                  </div>
                </div>
                <div className="col-12 col-md-12 d-flex align-items-center">
                  <div className="chart-board">
                    <center></center>
                    <table className="border-separate !w-full">
                      <thead>
                        <tr>
                          <th className="text-center w-[33%]">Vòng</th>
                          <th className="text-center w-[33%]">Tay thắng</th>

                          <th className="text-center w-[33%]">Kết quả</th>
                        </tr>
                      </thead>
                      <tbody id="tbl_stack" className="text-white text-center">
                        {tableRound &&
                          tableRound?.groupRoad?.table.map((value: any) => (
                            <tr key={value.id}>
                              <td>{value.id}</td>
                              <td>
                                {value.countWin === 0 ? "-" : value.countWin}
                              </td>

                              <td
                                className={`${
                                  value.groupWin ? "bg-green-600" : "bg-red-600"
                                } text-white`}
                              >
                                {value.groupWin ? "Thắng" : "Thua"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <div className="round-table mt-7 ">
                      <table className=" !w-full">
                        <thead>
                          <tr>
                            <th className="text-center w-[33%]">
                              Tổng kết quả
                            </th>
                            <th className="text-center w-[33%]">Thắng</th>
                            <th className="text-center w-[33%]">Thua</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td id="total" className="text-center">
                              {tableRound?.groupRoad?.total?.group}
                            </td>
                            <td id="win" className="text-center bg-green">
                              {tableRound?.groupRoad?.total?.win}
                            </td>
                            <td id="lose" className="text-center bg-red">
                              {tableRound?.groupRoad?.total?.loss}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </>
  );
};

export default LobbyRoom;
