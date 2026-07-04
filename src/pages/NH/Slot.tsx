import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { mockApi } from '../../services/mockApi';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

import ModalConfirmLogout from "../../components/ModalConfirmLogout";
import styles from './style.module.css';
import { getFormattedTime } from "../../utilities/axios.utilities";
import ProgressBar from '../NH/components/ProgressBar';

interface TableItem {
  time?: string;
  percent: number;
  typeGame?: string;
  name: string;
  _id: string;
  showIcon?: string;
  vassalage?: string;
}

const Slot = () => {
  const [isShowLogout, setIsShowLogout] = useState(false);
  const [tableList, setTableList] = useState<TableItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { room } = useParams();
  const currentTime = getFormattedTime();
  const [isLoading, setIsLoading] = useState(true);

  // Function to remove accents and convert to lowercase
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Filter tableList based on search term
  const filteredTableList = tableList.filter((item) => {
    if (!searchTerm) return true;
    const normalizedTitle = normalizeString(item.name);
    const normalizedSearch = normalizeString(searchTerm);
    return normalizedTitle.includes(normalizedSearch);
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Loading frame for both mobile and PC
  useEffect(() => {
    
    Swal.fire({
      html: `
        <div style="
          background: 
            radial-gradient(circle at 20% 20%, rgba(138, 43, 226, 0.2) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(0, 191, 255, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(255, 0, 150, 0.1) 0%, transparent 70%),
            linear-gradient(135deg, 
              rgba(10, 10, 25, 0.98) 0%, 
              rgba(20, 20, 40, 0.95) 25%,
              rgba(15, 15, 35, 0.98) 50%,
              rgba(25, 25, 45, 0.95) 75%,
              rgba(10, 10, 25, 0.98) 100%);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #8a2be2, #00bfff, #ff0096, #8a2be2) 1;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          color: white;
          max-width: 350px;
          width: 90%;
          box-shadow: 
            0 0 50px rgba(138, 43, 226, 0.6),
            0 0 100px rgba(0, 191, 255, 0.3),
            0 0 150px rgba(255, 0, 150, 0.2),
            0 20px 60px rgba(0, 0, 0, 0.7),
            inset 0 0 40px rgba(138, 43, 226, 0.15),
            inset 0 0 80px rgba(0, 191, 255, 0.1);
          position: relative;
          font-family: 'Courier New', monospace;
        ">
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
            animation: textGlow 2s ease-in-out infinite;
          ">
            <div style="
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #8a2be2, #00bfff);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
              font-size: 40px;
              color: #000;
              font-weight: bold;
              box-shadow: 
                0 0 20px rgba(138, 43, 226, 0.6),
                0 0 40px rgba(0, 191, 255, 0.3);
              animation: iconPulse 1.5s ease-in-out infinite;
              border: 2px solid rgba(255, 255, 255, 0.3);
            ">⚡</div>
            <h2 style="
              margin: 0; 
              color: #8a2be2; 
              font-size: 20px; 
              font-weight: 900;
              text-shadow: 
                0 0 15px rgba(138, 43, 226, 0.8),
                0 0 25px rgba(138, 43, 226, 0.5);
              letter-spacing: 2px;
              text-transform: uppercase;
              text-align: center;
              line-height: 1.2;
            ">INITIALIZING HACK TOOL...</h2>
          </div>
          
          <div style="
            margin-bottom: 25px; 
            font-size: 14px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          ">
            <div style="
              padding: 8px 16px;
              background: rgba(255, 255, 255, 0.05);
              border-radius: 6px;
              border: 1px solid rgba(255, 255, 255, 0.1);
              animation: progressGlow 1.5s ease-in-out infinite;
              text-align: center;
            ">
              <span style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">Đang tải dữ liệu sảnh game...</span>
            </div>
            <div data-progress="2" style="
              padding: 8px 16px;
              background: rgba(255, 255, 255, 0.05);
              border-radius: 6px;
              border: 1px solid rgba(255, 255, 255, 0.1);
              animation: progressGlow 1.5s ease-in-out infinite 0.5s;
              text-align: center;
            ">
              <span style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">Đang tải danh sách game...</span>
            </div>
          </div>
          
          <div style="
            width: 100%;
            height: 16px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 15px;
            position: relative;
          ">
            <div id="progress-fill" style="
              width: 0%;
              height: 100%;
              background: linear-gradient(90deg, #8a2be2, #00bfff, #ff0096, #8a2be2);
              border-radius: 4px;
              transition: width 0.3s ease;
              box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
            "></div>
            <div id="progress-text" style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-size: 12px;
              font-weight: bold;
              text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
            ">0%</div>
          </div>
          
          <div style="
            font-size: 14px; 
            color: #00bfff;
            text-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
            letter-spacing: 1px;
          ">
            » HACK TOOL READY «
          </div>
        </div>
        
        <style>
          .loading-frame-popup {
            z-index: 99999 !important;
          }
          @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 10px rgba(138, 43, 226, 0.5); }
            50% { text-shadow: 0 0 20px rgba(138, 43, 226, 0.8); }
          }
          @keyframes iconPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          @keyframes progressGlow {
            0%, 100% { 
              background: rgba(255, 255, 255, 0.05);
              border-color: rgba(255, 255, 255, 0.1);
            }
            50% { 
              background: rgba(138, 43, 226, 0.1);
              border-color: rgba(138, 43, 226, 0.3);
            }
          }
          @keyframes progressBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        </style>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: 'transparent',
      width: 'auto',
      customClass: {
        popup: 'loading-frame-popup'
      },
      backdrop: 'rgba(0, 0, 0, 0.65)'
    });

    // Progress bar animation
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 2.5; // 100% in 4 seconds (100/4 = 25 per second, but we update every 100ms)
      if (progress > 100) progress = 100;
      
      const progressFill = document.getElementById('progress-fill');
      const progressText = document.getElementById('progress-text');
      
      if (progressFill && progressText) {
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
      }
      
      // Show "Đã hack thành công!" when progress reaches 100%
      if (progress >= 100) {
        const lastMessage = document.querySelector('[data-progress="2"]');
        if (lastMessage) {
          lastMessage.innerHTML = '<span style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">Đã hack thành công!</span>';
        }
        clearInterval(progressInterval);
      }
    }, 100);

    // Close loading after 4 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      Swal.close();
      // Keep isLoading as true to show content
    }, 4000);

    const fetchTableList = async () => {
      try {
        const token = Cookies.get("access_token");
        // TẤT CẢ sảnh đều dùng mock API
        if (room) {
          const mockResponse = await mockApi.getTableList(room);
          setTableList(mockResponse.data);
        }
      } catch (error) {
        console.error('Error fetching table list:', error);
      }
    };

    fetchTableList();
    window.scrollTo(0, 0);
  }, [room]);

  localStorage.setItem("NH_PAGE", String(room));

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Centered Logo */}
      <div className="w-full h-[80px] flex justify-center items-center">
        <a className="navbar-brand" href="/">
          <img className="!w-[260px]" src="/assets/logo.png" alt="logo" />
        </a>
      </div>
      <div className={`container-fluid lobby-bg position-relative mx-auto mb-5 max-w-screen-xl`}>
          <div className="container mx-auto">
            <div className="flex flex-wrap my-7">
              <div className="w-1/2 md:w-2/3">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  className={'w-full max-w-full md:max-w-[25%] h-12 px-4 text-white bg-opacity-20 bg-white border border-white rounded-[20px] transition duration-300 ease-in-out placeholder-white focus:outline-none focus:border-white focus:shadow-[0_0_5px_2px_rgba(255,255,255,0.6)]'}
                  placeholder="Tìm kiếm..."
                />
              </div>
              <div className="w-1/2 md:w-1/3 flex justify-center items-center">
                <a href="/NH" className="text-white no-underline">
                  <img 
                    src="/assets/back.png" 
                    alt="Quay lại" 
                    className="w-20 h-16 hover:scale-105 transition-transform duration-200 cursor-pointer ml-24"
                  />
                </a>
              </div>
            </div>
            <label className={"font-semibold text-white text-center block " + styles.loadTime}>
              {room} | Load Time: {currentTime}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 justify-items-center">
              {filteredTableList.length > 0 ? (
                filteredTableList.map((item, index) => (
                  <div key={item._id || index} className="w-full max-w-[220px]">
                    <ProgressBar
                      percentage={item.percent}
                      title={item.name}
                      imageUrl={item.showIcon || `/assets/NH/${room}/${room}_${(index + 1).toString().padStart(2, '0')}.png`}
                      id={item._id}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-white py-20">
                  <div className="text-2xl font-bold mb-4">Không có dữ liệu game</div>
                  <div className="text-lg opacity-75">Vui lòng thử lại sau hoặc liên hệ admin</div>
                </div>
              )}
            </div>
            <div style={{ height: 200 }}></div>
          </div>
        </div>
      <ModalConfirmLogout
        isShowLogout={isShowLogout}
        setIsShowLogout={() => {
          setIsShowLogout(false);
        }}
      />
    </div>
  );
};

export default Slot;
