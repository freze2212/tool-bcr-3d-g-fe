import React, { useState, useEffect } from "react";
import axios from "axios";
import { mockApi } from "../../services/mockApi";
import Cookies from "js-cookie";
import ModalConfirmLogout from "../../components/ModalConfirmLogout";
import ProgressBar from "./components/ProgressBar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SiteBrand from "../../components/SiteBrand";

interface TableItem {
  time?: string;
  percent: number;
  typeGame?: string;
  name: string;
  _id: string;
  showIcon?: string;
  vassalage?: string;
}

// Add cyberpunk animations
const cyberpunkStyles = `
  @keyframes scan {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = cyberpunkStyles;
  document.head.appendChild(styleSheet);
}

const imageCasino = [
  {
    url: "/assets/casino/PG.png",
    link: "/PG",
    name: "PG ĐIỆN TỬ",
  },
  {
    url: "/assets/casino/BNG.png",
    link: "/BNG",
    name: "BNG ĐIỆN TỬ",
  },
  {
    url: "/assets/casino/CQ9.png",
    link: "/CQ9",
    name: "CQ9 ĐIỆN TỬ",
  },
  {
    url: "/assets/casino/EVOPLAY.png",
    link: "/EVOPLAY",
    name: "EVOPLAY ĐIỆN TỬ",
  },
  {
    url: "/assets/casino/FASTSPIN.png",
    link: "/FASHPIN",
    name: "FASHPIN ĐIỆN TỬ",
  },
  {
    url: "/assets/casino/JDB.png",
    link: "/JDB",
    name: "JDB ĐIỆN TỬ",
  },
  {
    url: "/assets/casino/JILI.png",
    link: "/JILI",
    name: "JILI ĐIỆN TỬ",
  },
  {
    url: "/assets/casino/PP.png",
    link: "/PP",
    name: "PP ĐIỆN TỬ",
  },
  {
    url: "/assets/casino/SPADEGAMING.png",
    link: "/SPADEGAMING",
    name: "SPADEGAMING ĐIỆN TỬ",
  },
  {
    url: "/assets/casino/SPRIBE.png",
    link: "/SPRIBE",
    name: "SPRIBE ĐIỆN TỬ",
  },
  {
    url: "/assets/casino/VA.png",
    link: "/VA",
    name: "VA ĐIỆN TỬ",
  },
];


const HomeNH = () => {
  const [isShowLogout, setIsShowLogout] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [tableList, setTableList] = useState<TableItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();

  // Add rainbow animation CSS
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { color: #ff0000; } /* Red */
        16% { color: #ff8000; } /* Orange */
        33% { color: #ffff00; } /* Yellow */
        50% { color: #00ff00; } /* Green */
        66% { color: #0080ff; } /* Blue */
        83% { color: #8000ff; } /* Purple */
        100% { color: #ff0080; } /* Pink */
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handleClick = (e: string) => {
    // Lưu thông tin sảnh vào localStorage
    const hallInfo = imageCasino.find(casino => casino.link === e);
    if (hallInfo) {
      localStorage.setItem('selected_hall_info', JSON.stringify({
        name: hallInfo.name,
        avatar: hallInfo.url.startsWith('/') ? hallInfo.url : `/${hallInfo.url}`
      }));
      console.log('Saved hall info:', hallInfo);
    }
    navigate(`/NH/slot${e}`);
  };

  useEffect(() => {
    // set initial
    const check = () => setIsMobile(window.innerWidth <= 430);
    check();
    window.addEventListener("resize", check);
    // load user info for profile area
    try {
      const u = localStorage.getItem("user_info");
      if (u) setUserInfo(JSON.parse(u));
    } catch (err) {
      setUserInfo(null);
    }
    return () => window.removeEventListener("resize", check);
  }, []);

  // Loading frame for mobile only
  useEffect(() => {
    if (isMobile) {
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
                border-radius: 8px;
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
        progress += 1.67; // 100% in 6 seconds (100/6 = 16.67 per second, but we update every 100ms)
        if (progress > 100) progress = 100;
        
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill && progressText) {
          progressFill.style.width = progress + '%';
          progressText.textContent = Math.round(progress) + '%';
        }
        
        // Show "Tải dữ liệu thành công!" when progress reaches 100%
        if (progress >= 100) {
          const lastMessage = document.querySelector('[data-progress="2"]');
          if (lastMessage) {
            lastMessage.innerHTML = '<span style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">Tải dữ liệu thành công!</span>';
          }
          clearInterval(progressInterval);
        }
      }, 100);

      // Close loading after 6 seconds
      setTimeout(() => {
        clearInterval(progressInterval);
        Swal.close();
      }, 6000);
    }
  }, [isMobile]);

  // Normalize string helper (same as Slot.tsx)
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");
  };

  // Fetch games when selectedHall changes
  useEffect(() => {
    const fetchTableList = async (hall: string) => {
      try {
        // Reset tableList trước để tránh hiển thị ảnh cũ
        setTableList([]);
        
        const token = Cookies.get("access_token");
        const typeGame = hall.replace(/\//g, "");
        // TẤT CẢ sảnh đều dùng mock API
        const mockResponse = await mockApi.getTableList(typeGame);
        setTableList(mockResponse.data);
      } catch (err) {
        console.error("Error fetching games for hall", err);
        setTableList([]);
      }
    };

    if (selectedHall) {
      fetchTableList(selectedHall);
    } else {
      setTableList([]);
    }
  }, [selectedHall]);

  // Filtered list using searchTerm
  const filteredTableList = tableList.filter((item) => {
    if (!searchTerm) return true;
    const normalizedTitle = normalizeString(item.name || "");
    const normalizedSearch = normalizeString(searchTerm);
    return normalizedTitle.includes(normalizedSearch);
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container-fluid lobby-bg position-relative mx-auto mb-5 max-w-screen-xl" style={{ position: 'relative' }}>
      {/* Logo căn giữa */}
      <div className="w-full h-[80px] flex justify-center items-center">
        <SiteBrand className="!w-auto" />
      </div>
      
      {/* Desktop / tablet layout */}
      {!isMobile && (
        <>
          {/* Nút back + User info section cùng hàng */}
          <div className="flex items-start justify-between w-full mb-8 my-7">
            {/* Nút back.png bên trái */}
            <div className="flex justify-start items-center">
              <a href="/" className="text-white no-underline">
                <img 
                  src="/assets/back.png" 
                  alt="Quay lại" 
                  className="w-20 h-16 hover:scale-105 transition-transform duration-200 cursor-pointer"
                />
              </a>
            </div>

            {/* Cyberpunk Logout Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsShowLogout(true)}
                style={{
                  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0a0a0a 100%)',
                  border: '2px solid #32a5d4',
                  borderRadius: '12px',
                  padding: '15px 30px',
                  color: '#32a5d4',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 0 20px rgba(50, 165, 212, 0.5)',
                  transition: 'all 0.3s ease',
                  textShadow: '0 0 10px #32a5d4'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(50, 165, 212, 0.8)';
                  e.currentTarget.style.borderColor = '#5bb3d4';
                  e.currentTarget.style.color = '#5bb3d4';
                  e.currentTarget.style.textShadow = '0 0 15px #5bb3d4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(50, 165, 212, 0.5)';
                  e.currentTarget.style.borderColor = '#32a5d4';
                  e.currentTarget.style.color = '#32a5d4';
                  e.currentTarget.style.textShadow = '0 0 10px #32a5d4';
                }}
              >
                {/* Scan line effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #32a5d4, transparent)',
                  animation: 'scan 2s linear infinite'
                }}></div>
                
                {/* Button text */}
                <span style={{ position: 'relative', zIndex: 1 }}>
                  ĐĂNG XUẤT
                </span>
                
                {/* Corner accents */}
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  left: '5px',
                  width: '10px',
                  height: '10px',
                  borderLeft: '2px solid #32a5d4',
                  borderTop: '2px solid #32a5d4',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '10px',
                  height: '10px',
                  borderRight: '2px solid #32a5d4',
                  borderTop: '2px solid #32a5d4',
                  animation: 'pulse 1.5s ease-in-out infinite 0.5s'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  left: '5px',
                  width: '10px',
                  height: '10px',
                  borderLeft: '2px solid #32a5d4',
                  borderBottom: '2px solid #32a5d4',
                  animation: 'pulse 1.5s ease-in-out infinite 1s'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  width: '10px',
                  height: '10px',
                  borderRight: '2px solid #32a5d4',
                  borderBottom: '2px solid #32a5d4',
                  animation: 'pulse 1.5s ease-in-out infinite 1.5s'
                }}></div>
              </button>
            </div>
          </div>

          <div
            id=""
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 all-programs py-8 mb-10"
          >
            {imageCasino.map((e) => {
              return (
                <div
                  key={e.link}
                  data-aos="flip-left"
                  data-aos-delay="100"
                  className="mb-1 aos-init aos-animate cursor-pointer transition-transform transform duration-300 ease-in-out hover:scale-110"
                  onClick={() => handleClick(e.link)}
                >
                  <div className="box-game w-[80%] mx-auto group">
                    <img
                      src={e.url && e.url.startsWith('/') ? e.url : `/${e.url}`}
                      alt="SA Casino Gaming"
                      onError={(ev) => (ev.currentTarget.src = '/assets/nohu.gif')}
                      className="w-full transition duration-300 ease-in-out group-hover:drop-shadow-[0_0_10px_#1e943b]"
                    />
                    <label className="mt-2 font-semibold text-white text-center block transition duration-300 ease-in-out group-hover:drop-shadow-[0_0_6px_#1e943b]">
                      {e.name}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Custom CSS for mobile layout */}
      <style>
        {`
          @media (max-width: 390px) {
            .mobile-home-container {
              gap: 0.5rem !important;
            }
            .text-base {
              font-size: 0.9rem !important;
            }
          }
        `}
      </style>

      {/* Mobile layout for <= 430px */}
      {isMobile && (
        <div className="py-2 px-3">
          {/* Top row: left column = profile, right column = halls list */}
          <div className="flex gap-3 mobile-home-container">
            <div className="w-1/3 p-3 rounded-md flex flex-col items-center gap-3">
              <img src="/assets/user-icon.gif" alt="avatar" className="w-28 h-28 rounded-full" />
              <div className="text-white font-bold text-sm text-center break-words">{userInfo?.userName || 'Khách'}</div>
              
              {/* Số xu với count-coins background và coin-icon */}
              <div className="relative w-full my-2">
                <img src="/assets/count-coins.png" alt="Count Coins Background" className="w-full h-full" style={{transform: 'scale(1.3, 1.2)'}} />
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <img src="/assets/coin-icon.png" alt="Coin Icon" />
                  <span className="text-white text-base font-semibold">Số xu: {userInfo?.coins ?? 0}</span>
                </div>
              </div>
              
              {/* Liên hệ với contact.admin background và hotline icon */}
              <div className="relative w-full cursor-pointer my-2" onClick={() => alert('Liên hệ admin: zalo hoặc chat')}>
                <img src="/assets/contact-admin.png" alt="Contact Admin Background" className="w-full h-full" style={{transform: 'scale(1.3, 1.2)'}} />
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <img src="/assets/hotline.png" alt="Hotline Icon" />
                  <span className="text-white text-base font-semibold">Liên hệ</span>
                </div>
              </div>
              
              {/* Đăng xuất với logout-btn background */}
              <div className="relative w-full cursor-pointer my-2" onClick={() => setIsShowLogout(true)}>
                <img src="/assets/logout-btn.png" alt="Logout Button Background" className="w-full h-full" style={{transform: 'scale(1.3, 1.2)'}} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-base font-semibold">ĐĂNG XUẤT</span>
                </div>
              </div>
            </div>

            <div className="w-2/3 relative">
              {/* Background image */}
              <img 
                src="/assets/menu-game.gif" 
                alt="Menu Game Background" 
                className="w-full h-full object-cover rounded-md"
                onError={(ev) => (ev.currentTarget.style.display = 'none')}
              />
              
              {/* Content overlay */}
              <div className="absolute inset-0 p-3 flex flex-col overflow-x-hidden">
                <h3 className="mb-2 text-xl text-center font-bold uppercase tracking-wider" style={{
                  color: '#00E0FF',
                  textShadow: '0 0 10px rgba(0, 224, 255, 0.8), 0 0 20px rgba(0, 224, 255, 0.6), 0 0 30px rgba(0, 224, 255, 0.4)',
                  fontFamily: 'Arial, sans-serif',
                  letterSpacing: '2px',
                  borderBottom: '1px solid #00E0FF',
                  paddingBottom: '8px',
                  width: 'fit-content',
                  margin: '0 auto'
                }}>Danh sách sảnh</h3>
                <div className="space-y-2 max-h-[28vh] overflow-y-auto overflow-x-hidden ml-4">
                  {imageCasino.map((e) => (
                    <div 
                      key={e.link} 
                      className={`cursor-pointer transition-all duration-300 ease-in-out ${
                        selectedHall === e.link 
                          ? 'scale-110 transform origin-center my-2' 
                          : 'hover:scale-105'
                      }`} 
                      onClick={() => {
                        setSelectedHall(e.link);
                        // Lưu thông tin sảnh vào localStorage
                        localStorage.setItem('selected_hall_info', JSON.stringify({
                          name: e.name,
                          avatar: e.url.startsWith('/') ? e.url : `/${e.url}`
                        }));
                        console.log('Saved hall info (mobile):', e);
                      }}
                    >
                      {selectedHall === e.link ? (
                        // Selected state: sử dụng ảnh nền logout-btn.png
                        <div className="relative">
                          <img 
                            src="/assets/logout-btn.png" 
                            alt="Button Background" 
                            className="w-full h-12 object-cover"
                            onError={(ev) => (ev.currentTarget.style.display = 'none')}
                          />
                          <div className="absolute inset-0 flex items-center gap-3 p-1">
                            <img 
                              src={e.url && e.url.startsWith('/') ? e.url : `/${e.url}`} 
                              alt={e.name} 
                              onError={(ev) => (ev.currentTarget.src = '/assets/nohu.gif')} 
                              className="w-16 h-10 object-contain" 
                            />
                            <div className="text-white text-sm font-semibold truncate drop-shadow-md animate-pulse" style={{
                              animation: 'rainbow 1.5s ease-in-out infinite alternate'
                            }}>
                              {e.name}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Normal state: không có nền, chỉ có icon và text
                        <div className="flex items-center gap-3 p-2">
                          <img 
                            src={e.url && e.url.startsWith('/') ? e.url : `/${e.url}`} 
                            alt={e.name} 
                            onError={(ev) => (ev.currentTarget.src = '/assets/nohu.gif')} 
                            className="w-14 h-8 object-contain" 
                          />
                          <div className="text-white text-xs truncate drop-shadow-md">
                            {e.name}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search box centered below the top row */}
          <div className="flex items-center gap-2 mt-3">
            <input value={searchTerm} onChange={handleSearch} placeholder={`Tìm kiếm game trong ${selectedHall ?? 'sảnh'}`} className="flex-1 px-3 py-2 rounded bg-black/20 text-white text-sm border border-white" />
            <button className="px-3 py-2 bg-gray-700 rounded text-white">🔍</button>
          </div>

          {/* Selected hall games list (unchanged behaviour) */}
          {selectedHall && (
            <div className="mt-2">
              <h4 className="text-white mb-2 text-sm">Trò chơi trong {selectedHall.replace('/', '')}</h4>
              <div className="grid grid-cols-2">
                 {filteredTableList.length > 0 ? (
                   filteredTableList.map((item, idx) => {
                     // Logic y hệt Slot.tsx: dùng index + 1
                     const hallName = selectedHall.replace('/', '');
                     // Sử dụng ảnh từ mock API nếu có, không thì dùng pattern cũ
                     const imageUrl = item.showIcon || `/assets/NH/${hallName}/${hallName}_${(idx + 1).toString().padStart(2, '0')}.png`;
                     console.log('HomeNH - Game:', item.name, 'Index:', idx + 1, 'Image:', imageUrl);
                     
                     return (
                       <div key={item._id || idx} className="w-full progress-equal-height">
                        <ProgressBar
                          percentage={item.percent ?? 0}
                          title={item.name}
                          imageUrl={imageUrl}
                          id={item._id || String(idx)}
                        />
                       </div>
                     );
                   })
                 ) : (
                   <div className="text-white/80">Không có trò chơi khớp hoặc đang tải...</div>
                 )}
              </div>
            </div>
          )}
        </div>
      )}
      
      <ModalConfirmLogout
        isShowLogout={isShowLogout}
        setIsShowLogout={() => {
          setIsShowLogout(false);
        }}
      />
    </div>
  );
};

export default HomeNH;
