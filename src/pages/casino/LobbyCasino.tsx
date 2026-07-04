import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import ModalConfirmLogout from "../../components/ModalConfirmLogout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function BaccaratRoomList() {
  const [isShowLogout, setIsShowLogout] = useState(false);
  const [dataRoom, setDataRom] = useState<any>([]);
  const Cookies = require("js-cookie");
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);

  const token = Cookies.get("access_token");
  const user_infor = localStorage.getItem("user_info");

  useEffect(() => {
    if (user_infor) {
      const test = JSON.parse(user_infor);
      setCoins(test.coins);
    }
  }, [user_infor]);

  const isShowText = (value: any) => {
    if (value.maintenance === 1) {
      return "Đang bảo trì";
    }
    if (value.percentCurrent.Forecast) {
      return Math.round(value.percentCurrent.Forecast) + "%";
    }
    if (value.shuffle !== 0) {
      return "Đang xáo bài";
    }
  };

  const handleClick = (value: any) => {
    if (coins !== 0) {
      navigate(`/casino/room/${value.tableName}`);
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi tải dữ liệu",
        text: "Vui lòng nạp thêm xu vào tài khoản!",
        customClass: {
          popup: "bg-custom-image text-white",
        },
      });
    }
  };

  const RoomCard = ({ value }: any) => {
    return (
      <div className="w-1/2 md:w-1/3 lg:w-1/4 p-2">
        <div
          className="room-box bg-gray-800 rounded-xl p-4 shadow-lg"
          onClick={() => handleClick(value)}
        >
          <h2 className="text-white text-center text-xl font-bold">
            BÀN: <span className="room-number">{value.tableName}</span>
          </h2>
          <h2 className="percent-room text-center font-semibold text-white drop-shadow-[0_0_6px_#55abd3] text-[2rem]">
            {isShowText(value)}
          </h2>
          <p className="text-white text-center mt-3 mb-1">Tỷ lệ thắng</p>
        </div>
      </div>
    );
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dataRoom.length === 0) {
      setIsLoading(true);
      Swal.fire({
        title: "LuckySlot",
        html: `
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-bottom: 20px;">
              Đang tải hệ thống...
            </div>
            
            <!-- Character placeholder area -->
            <div class="character-placeholder"></div>
            
            <!-- Circular progress ring -->
            <div class="progress-ring">
              <svg>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#22c55e;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle class="progress-bg" cx="50" cy="50" r="40"/>
                <circle class="progress-fill" cx="50" cy="50" r="40"/>
              </svg>
              <div class="progress-text">75%</div>
            </div>
            
            <!-- Progress bar -->
            <div style="width: 100%; height: 6px; background: rgba(34, 197, 94, 0.2); border-radius: 3px; margin: 20px 0; overflow: hidden;">
              <div style="width: 75%; height: 100%; background: linear-gradient(90deg, #22c55e 0%, #3b82f6 100%); border-radius: 3px; box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);"></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; color: rgba(255, 255, 255, 0.8); font-size: 14px;">
              <span>Hoàn tất...</span>
              <span style="color: #22c55e; font-weight: bold;">100%</span>
            </div>
            
            <!-- Loading dots -->
            <div style="display: flex; justify-content: center; margin-top: 20px; gap: 4px;">
              <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: dotPulse 1.4s infinite ease-in-out;"></div>
              <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: dotPulse 1.4s infinite ease-in-out 0.2s;"></div>
              <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: dotPulse 1.4s infinite ease-in-out 0.4s;"></div>
            </div>
            
            <!-- OK Button with wave animation -->
            <button class="wave-button" style="
              background: linear-gradient(45deg, #22c55e, #3b82f6);
              border: none;
              border-radius: 12px;
              padding: 12px 30px;
              font-size: 16px;
              font-weight: bold;
              color: white;
              text-transform: uppercase;
              letter-spacing: 1px;
              box-shadow: 0 0 20px rgba(34, 197, 94, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3);
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
              margin-top: 20px;
              cursor: pointer;
            " onclick="Swal.close()">
              <span style="position: relative; z-index: 1;">OK</span>
            </button>
          </div>
          <style>
            @keyframes dotPulse {
              0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
              40% { transform: scale(1.2); opacity: 1; }
            }
            
            .wave-button::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
              transition: left 0.6s ease;
            }
            
            .wave-button:hover::before {
              left: 100%;
            }
            
            .wave-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 0 30px rgba(34, 197, 94, 0.6), 0 6px 20px rgba(0, 0, 0, 0.4);
            }
          </style>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          popup: "bg-custom-image text-white",
        },
      });
      const timeout = setTimeout(() => {
        axios
          .get(
            `${process.env.REACT_APP_URL_API_CASINO}/predict/get-all-table`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((data) => setDataRom(data.data))
          .catch((err) => console.log(err));
      }, 1000); // Delay 1 giây

      return () => clearTimeout(timeout);
    } else {
      setIsLoading(false);
      Swal.close();
    }

    // Clear timeout nếu component bị unmount hoặc dependencies thay đổi
  }, [dataRoom]);

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Header setIsShowLogout={() => setIsShowLogout(true)} />
        <div
          className="min-h-screen bg-cover bg-center container-fluid lobby-bg position-relative  mx-auto    mb-5 max-w-screen-xl"
        >
        <div className="container mx-auto py-10 px-4">
          <div className="flex flex-wrap justify-center items-center mb-6">
            <div className="w-1/2 md:w-2/3">
              <img
                src="https://trumcasino6789.com/images/logo_ae.png"
                alt="logo"
                className="h-25"
              />
            </div>

            <div className="w-1/2 md:w-1/3 flex justify-center items-center">
              <a
                href="/casino"
                className="text-white px-4 py-2 rounded-lg shadow box-goto-lobby w-[10rem]"
              >
                Quay lại
              </a>
            </div>
          </div>

          {!isLoading && (
            <div className="flex flex-wrap">
              {dataRoom.map((e: any) => (
                <RoomCard key={e.id} value={e} />
              ))}
            </div>
          )}
        </div>
        <ModalConfirmLogout
          isShowLogout={isShowLogout}
          setIsShowLogout={() => {
            setIsShowLogout(false);
          }}
        />
        </div>
      </div>
    </>
  );
}
