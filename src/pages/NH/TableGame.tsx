import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

import ModalConfirmLogout from "../../components/ModalConfirmLogout";
import styles from './style.module.css';
import ChatBox from '../../components/ChatBox';
import '../../components/SpinSystem.css';
import '../login/css/main.login.css';

const TableGame = () => {
  const [isShowLogout, setIsShowLogout] = useState(false);
  const { room } = useParams();
  const navigate = useNavigate();
  const [nameGame, setnameGame] = useState('Tool dự đoán kết quả nổ hủ');
  const [randomMemberCount, setRandomMemberCount] = useState(0);
  const [gameHallAvatar, setGameHallAvatar] = useState('');
  const [gameHallName, setGameHallName] = useState('');

  // Spin System states
  const [points, setPoints] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [manualValues, setManualValues] = useState({ rounds: 0, minBet: '0K' });
  const [autoValues, setAutoValues] = useState({ rounds: 0, minBet: '0K' });

  // Gif button states
  const [showGifButton, setShowGifButton] = useState(true);
  const [currentRounds, setCurrentRounds] = useState(0);
  const [countdown, setCountdown] = useState(0);

  // User coins state
  const [userCoins, setUserCoins] = useState(0);

  // Tạo danh sách 50 user với tên kiểu Việt Nam và số tiền thắng cố định
  const vietnameseGamers = [
    { user: "nhatnguyen123", amount: "2,500,000" },
    { user: "huyhungvip", amount: "3,200,000" },
    { user: "minhd", amount: "4,800,000" },
    { user: "quang2024", amount: "2,800,000" },
    { user: "tgame", amount: "5,500,000" },
    { user: "hoanglong99", amount: "3,600,000" },
    { user: "vietnamz", amount: "4,200,000" },
    { user: "dungmaster", amount: "6,800,000" },
    { user: "thangzz", amount: "3,400,000" },
    { user: "namking123", amount: "5,200,000" },
    { user: "hoaibao456", amount: "4,600,000" },
    { user: "tienphat789", amount: "7,200,000" },
    { user: "quocviet", amount: "3,800,000" },
    { user: "thanhdat", amount: "5,800,000" },
    { user: "vanhuy68", amount: "4,400,000" },
    { user: "ducminh23", amount: "6,400,000" },
    { user: "nam9x", amount: "3,900,000" },
    { user: "tuanvip77", amount: "5,600,000" },
    { user: "minhthanh", amount: "4,700,000" },
    { user: "quanghuy", amount: "6,200,000" },
    { user: "vietdanchoi", amount: "3,300,000" },
    { user: "caoducz", amount: "5,400,000" },
    { user: "hduc99", amount: "4,900,000" },
    { user: "tuanminh077", amount: "6,600,000" },
    { user: "namnolove7", amount: "3,700,000" },
    { user: "huyzz9", amount: "5,900,000" },
    { user: "ducbbbbb", amount: "4,300,000" },
    { user: "minhdaibay", amount: "6,900,000" },
    { user: "quangthattha", amount: "3,500,000" },
    { user: "thanhpro", amount: "5,700,000" },
    { user: "vanthicam", amount: "4,500,000" },
    { user: "hoaiz", amount: "6,300,000" },
    { user: "tien98", amount: "3,600,000" },
    { user: "quocoai", amount: "5,300,000" },
    { user: "datOyz", amount: "4,800,000" },
    { user: "longhip79", amount: "6,700,000" },
    { user: "baophat", amount: "3,400,000" },
    { user: "phatloczzz", amount: "5,100,000" },
    { user: "vietchymto", amount: "4,600,000" },
    { user: "caotedam", amount: "6,500,000" },
    { user: "duc3", amount: "3,800,000" },
    { user: "nampo", amount: "5,400,000" },
    { user: "hkingking", amount: "4,700,000" },
    { user: "shanevanboning", amount: "6,100,000" },
    { user: "hhiihhaa", amount: "3,900,000" },
    { user: "huhuhuhoho", amount: "5,600,000" },
    { user: "vip456", amount: "4,400,000" },
    { user: "masterchef", amount: "6,800,000" },
    { user: "king89", amount: "3,200,000" },
    { user: "proprohaha", amount: "5,800,000" }
  ];

  useEffect(() => {
    // Random member count mỗi khi component mount (refresh trang)
    setRandomMemberCount(Math.floor(Math.random() * 201) + 300);
    
    // Load user coins from localStorage initially
    const userInfoRaw = localStorage.getItem('user_info');
    if (userInfoRaw) {
      const userInfo = JSON.parse(userInfoRaw);
      setUserCoins(userInfo.coins || 0);
    }
    
    // Fetch fresh user data from API
    fetchUserCoins();
  }, []);

  // Function to fetch user coins from API
  const fetchUserCoins = async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) return;

      const response = await axios.get(
        `${process.env.REACT_APP_URL_API}/users/current`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const userData = response.data;
      const coins = userData.coins || userData.user?.coins || userData.data?.coins || 0;
      setUserCoins(coins);
      
      // Update localStorage with fresh data
      const userInfoRaw = localStorage.getItem('user_info');
      if (userInfoRaw) {
        const userInfo = JSON.parse(userInfoRaw);
        const updatedUserInfo = { ...userInfo, coins: coins };
        localStorage.setItem('user_info', JSON.stringify(updatedUserInfo));
      }
    } catch (error: any) {
      console.error('Error fetching user coins:', error);
    }
  };

  // Function to deduct coins via API
  const deductCoins = async (amount: number = 1, action: string = "PLAY_GAME") => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        alert('Vui lòng đăng nhập lại!');
        return false;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_URL_API}/users/subtract-coins-for-action`,
        {
          amount: amount,
          action: action,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update coins from API response
      const newCoins = response.data.coins;
      setUserCoins(newCoins);
      
      // Update localStorage
      const userInfoRaw = localStorage.getItem('user_info');
      if (userInfoRaw) {
        const userInfo = JSON.parse(userInfoRaw);
        const updatedUserInfo = { ...userInfo, coins: newCoins };
        localStorage.setItem('user_info', JSON.stringify(updatedUserInfo));
      }
      
      return true;
    } catch (error: any) {
      console.error('Error deducting coins:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400 && 
          error.response?.data?.message?.includes("không đủ")) {
        alert(error.response.data.message);
      } else {
        alert('Có lỗi xảy ra khi trừ xu. Vui lòng thử lại!');
      }
      
      return false;
    }
  };

  // Function to check if user has enough coins
  const hasEnoughCoins = (amount: number = 1) => {
    return userCoins >= amount;
  };

  // Spin System functions
  const handleSpinStart = async () => {
    const inputPoints = parseInt(points);
    if (!inputPoints || inputPoints <= 0) {
      alert('Vui lòng nhập số điểm hợp lệ!');
      return;
    }

    // Check if user has enough coins
    if (!hasEnoughCoins(1)) {
      alert('Bạn không đủ xu để thực hiện hành động này!');
      return;
    }

    // Deduct 1 coin via API
    const success = await deductCoins(1, "SPIN_START");
    if (!success) {
      return; // Stop if deduction failed
    }

    setIsSpinning(true);
    
    // Random giá trị mới cho cả 2 button
    const newManualRounds = 15 + Math.floor(inputPoints * 0.2) + Math.floor(Math.random() * 20);
    const newManualBet = 1000 + Math.floor(inputPoints * 5) + Math.floor(Math.random() * 3000);
    const manualBetFormatted = newManualBet >= 1000 
      ? `${Math.floor(newManualBet / 1000)}K`
      : `${newManualBet}`;

    const newAutoRounds = 35 + Math.floor(inputPoints * 0.5) + Math.floor(Math.random() * 30);
    const newAutoBet = 3000 + Math.floor(inputPoints * 10) + Math.floor(Math.random() * 5000);
    const autoBetFormatted = newAutoBet >= 1000 
      ? `${Math.floor(newAutoBet / 1000)}K`
      : `${newAutoBet}`;

    // Update giá trị trên button
    setManualValues({ rounds: newManualRounds, minBet: manualBetFormatted });
    setAutoValues({ rounds: newAutoRounds, minBet: autoBetFormatted });

    // Reset sau 0.25 giây
    setTimeout(() => {
      setIsSpinning(false);
    }, 250);
  };

  const handleSpinMode = (mode: 'manual' | 'auto') => {
    const inputPoints = parseInt(points);
    if (!inputPoints || inputPoints <= 0) {
      alert('Vui lòng nhập số điểm hợp lệ!');
      return;
    }

    console.log(`Chọn mode: ${mode}, điểm: ${inputPoints}`);
  };

  // Gif button functions
  const handleGifButtonClick = async () => {
    if (!showGifButton) return;
    
    // Check if user has enough coins
    if (!hasEnoughCoins(1)) {
      alert('Bạn không đủ xu để thực hiện hành động này!');
      return;
    }

    // Deduct 1 coin via API
    const success = await deductCoins(1, "GIF_BUTTON");
    if (!success) {
      return; // Stop if deduction failed
    }
    
    // Ẩn button gif
    setShowGifButton(false);
    
    // Random số vòng từ 50-80
    const randomRounds = Math.floor(Math.random() * 31) + 50; // 50-80 vòng
    
    // Random thời gian đếm ngược từ 10-15 phút (600-900 giây)
    const randomMinutes = Math.floor(Math.random() * 6) + 10; // 10-15 phút
    const totalSeconds = randomMinutes * 60; // Chuyển thành giây
    
    setCurrentRounds(randomRounds);
    setCountdown(totalSeconds);
    
    // Bắt đầu đếm ngược
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Reset sau khi đếm xong
          setTimeout(() => {
            setShowGifButton(true);
            setCurrentRounds(0);
            setCountdown(0);
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const fetchTableList = async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          console.error('No access token found');
          Swal.fire({
            icon: "error",
            title: "Lỗi xác thực",
            text: "Vui lòng đăng nhập lại",
            customClass: {
              popup: "bg-custom-image text-white",
            },
          });
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_URL_API_CASINO}/NH/gameOne?id=${room}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
         


        setnameGame(response.data.name);
        
        // Debug: Log toàn bộ API response để xem có gì
        console.log('Full API response:', response.data);
        
        // Lấy thông tin sảnh từ localStorage (được lưu khi chọn sảnh từ HomeNH)
        const savedHallInfo = localStorage.getItem('selected_hall_info');
        if (savedHallInfo) {
          try {
            const hallInfo = JSON.parse(savedHallInfo);
            setGameHallName(hallInfo.name);
            setGameHallAvatar(hallInfo.avatar);
            console.log('Using saved hall info:', hallInfo);
          } catch (e) {
            console.error('Error parsing saved hall info:', e);
          }
        }
        
        // Nếu không có thông tin sảnh từ localStorage, lấy từ API response
        if (!savedHallInfo && response.data.hallName && response.data.hallAvatar) {
          setGameHallName(response.data.hallName);
          setGameHallAvatar(response.data.hallAvatar);
          console.log('Using API hall info:', response.data.hallName, response.data.hallAvatar);
        }
        
        // Fallback cuối cùng: lấy từ URL
        if (!savedHallInfo && (!response.data.hallName || !response.data.hallAvatar)) {
          const currentPath = window.location.pathname;
          console.log('No hall info found, using URL fallback:', currentPath);
          
          if (currentPath.includes('/PG')) {
            setGameHallName('PG ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/PG.png');
          } else if (currentPath.includes('/BNG')) {
            setGameHallName('BNG ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/BNG.png');
          } else if (currentPath.includes('/CQ9')) {
            setGameHallName('CQ9 ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/CQ9.png');
          } else if (currentPath.includes('/EVOPLAY')) {
            setGameHallName('EVOPLAY ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/EVOPLAY.png');
          } else if (currentPath.includes('/FASHPIN')) {
            setGameHallName('FASHPIN ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/FASTSPIN.png');
          } else if (currentPath.includes('/JDB')) {
            setGameHallName('JDB ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/JDB.png');
          } else if (currentPath.includes('/JILI')) {
            setGameHallName('JILI ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/JILI.png');
          } else if (currentPath.includes('/PP')) {
            setGameHallName('PP ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/PP.png');
          } else if (currentPath.includes('/SPADEGAMING')) {
            setGameHallName('SPADEGAMING ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/SPADEGAMING.png');
          } else if (currentPath.includes('/SPRIBE')) {
            setGameHallName('SPRIBE ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/SPRIBE.png');
          } else if (currentPath.includes('/VA')) {
            setGameHallName('VA ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/VA.png');
          } else if (currentPath.includes('/AG')) {
            setGameHallName('AG ĐIỆN TỬ');
            setGameHallAvatar('/assets/NH/menuGame/AG.png');
          } else if (currentPath.includes('/MG')) {
            setGameHallName('MG ĐIỆN TỬ');
            setGameHallAvatar('/assets/NH/menuGame/MG.png');
          } else {
            // Default
            setGameHallName('PG ĐIỆN TỬ');
            setGameHallAvatar('/assets/casino/PG.png');
          }
        }
        
        console.log('Final hall name:', gameHallName);
        console.log('Final hall avatar:', gameHallAvatar);
      } catch (error: any) {
        console.error('Error fetching table list:', error);
         
        // Xử lý lỗi cụ thể
        if (error.response?.status === 401 || error.response?.status === 403) {
          Swal.fire({
            icon: "error",
            title: "Lỗi xác thực",
            text: "Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
            customClass: {
              popup: "bg-custom-image text-white",
            },
          });
        } else if (error.response?.data?.message === "Authorization") {
          Swal.fire({
            icon: "error",
            title: "Lỗi quyền truy cập",
            text: "Bạn không có quyền truy cập sảnh này hoặc token đã hết hạn.",
            customClass: {
              popup: "bg-custom-image text-white",
            },
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi tải dữ liệu",
            text: "Không thể tải thông tin sảnh. Vui lòng thử lại.",
            customClass: {
              popup: "bg-custom-image text-white",
            },
          });
        }
      }
    };

    fetchTableList();
    window.scrollTo(0, 0);
  }, [room, gameHallAvatar, gameHallName]);



  return (
    <div>
      <div className="container-fluid lobby-bg position-relative mx-auto mb-5 max-w-screen-xl">
        {/* Logo căn giữa */}
        <div className="w-full h-[80px] flex justify-center items-center">
          <img className="!w-[260px]" src="/assets/logo.png" alt="logo" />
        </div>
         
        <div className="container mx-auto">
            {/* User panel (avatar, name, coins, contact, logout) */}
            <div className={styles.tableUserPanel}>
              {(() => {
                const userInfoRaw = localStorage.getItem('user_info');
                const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
                const avatar = localStorage.getItem('user_avatar') || '/assets/user-ico.png';
                return (
                  <div className={styles.userBox}>
                    <img src={avatar} alt="avatar" className={styles.userAvatar} />
                    <div className={styles.userMeta}>
                      <div className={styles.userName}>{userInfo?.userName || 'GUEST'}</div>
                      <div className={styles.userCoins}>Số xu: {userCoins}</div>
                    </div>
                    <div className={styles.userActions}>
                      <button className={styles.btnContact} onClick={() => {
                        const email = process.env.REACT_APP_ADMIN_EMAIL || 'support@example.com';
                        window.location.href = `mailto:${email}`;
                      }}>Liên hệ Admin</button>
                      <button className={styles.btnLogout} onClick={() => {
                        console.log('Logout button clicked');
                        setIsShowLogout(true);
                        console.log('isShowLogout set to true');
                      }}>Đăng xuất</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          <div className="flex flex-wrap my-7">
            <div className="w-1/2 md:w-1/3 flex justify-center items-center">
              <button
                type="button"
                onClick={() => {
                  // go back if history exists, otherwise fallback to the slot page or /NH
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    const page = localStorage.getItem("NH_PAGE");
                    if (page) navigate(`/NH/slot/${page}`);
                    else navigate('/NH');
                  }
                }}
                className="text-white no-underline"
              >
                <div className="text-white px-4 py-2 rounded-lg shadow box-goto-lobby w-[10rem]">
                  Quay lại
                </div>
              </button>
            </div>
          </div>
          <div className={"flex justify-center"}>
            <div className={`${styles.detailGameInner}`}>
              {/* Game Details Container */}
              <div className={styles.containerDetail}>
                {/* Game Title Section */}
                <div className="flex">
                  <img
                    src={`${localStorage.getItem('title_img')}`}
                    className={styles.imgTitleTable}
                    alt="Ảnh game" />
                  <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeContent}>{nameGame}</div>
                  </div>
                </div>

                {/* Game Hall Avatar Section */}
                <div className={styles.gameHallAvatarSection}>
                  <div className={styles.gameHallAvatarTitle}>{gameHallName || 'SẢNH GAME GỐC'}</div>
                  <div className={styles.gameHallAvatarContainer}>
                    <img
                      src={gameHallAvatar}
                      alt={gameHallName || 'Sảnh Game Gốc'}
                      className={styles.gameHallAvatarImage}
                      onError={(e) => {
                        console.log('Image load error, using fallback');
                        e.currentTarget.src = '';
                      }}
                    />
                  </div>
                </div>

                {/* Spin System - đặt bên trong khối tiêu đề + sảnh gốc */}
                <div className="spin-system">
                  {/* Top row: Mega Win + Gif/Countdown */}
                  <div className="spin-top-row">
                    <div className={styles.megawinContainer}></div>
                    <div className="gif-button-container">
                      {showGifButton ? (
                        <button
                          onClick={handleGifButtonClick}
                          className="gif-button"
                        >
                          <div className="gif-placeholder">🎰 GIF BUTTON 🎰</div>
                        </button>
                      ) : (
                        <div className="countdown-display">
                          <div className="countdown-title">SỐ VÒNG</div>
                          <div className="countdown-number">{currentRounds}</div>
                          <div className="countdown-label">ĐẾM NGƯỢC</div>
                          <div className="countdown-timer">
                            {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Input và Start button */}
                  <div className="spin-input-section">
                    <div className="points-input-container">
                      <div className="points-label">NHẬP SỐ ĐIỂM</div>
                      <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        className="points-input"
                        placeholder="..."
                        min="1"
                        max="9999"
                      />
                    </div>
                    
                    <button
                      onClick={handleSpinStart}
                      disabled={isSpinning}
                      className="start-button"
                    >
                      <img 
                        src="/assets/start.gif" 
                        alt="START" 
                        className="start-gif"
                      />
                    </button>
                  </div>

                  {/* Spin modes */}
                  <div className="spin-modes-container">
                    <div className="spin-modes">
                      <button
                        onClick={() => handleSpinMode('manual')}
                        disabled={!points || isSpinning}
                        className="spin-mode manual-mode"
                      >
                        <div className="mode-title">QUAY MỒI THỦ CÔNG</div>
                        <div className="mode-details">{manualValues.rounds} vòng - min {manualValues.minBet}</div>
                      </button>
                      
                      <button
                        onClick={() => handleSpinMode('auto')}
                        disabled={!points || isSpinning}
                        className="spin-mode auto-mode"
                      >
                        <div className="mode-title">QUAY AUTO</div>
                        <div className="mode-details">{autoValues.rounds} vòng - min {autoValues.minBet}</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>                             


          

          {/* Spin System đã đưa vào bên trong khối tiêu đề + sảnh gốc ở trên */}

          {/* Horizontal layout container for Wintool and ChatBox */}
          <div className={styles.horizontalLayoutContainer}>
            {/* Wintool winners box */}
            <div className={styles.wintoolWrapper} style={{ margin: 0, width: 'auto' }}>
              <div className={styles.wintoolInner}>
                <div className={styles.wintoolTitle}>
                  <div className={styles.wintoolMember}>{randomMemberCount}</div>
                </div>
                <div className={styles.wintoolList}>
                  <div className={styles.wintoolListContent}>
                    {vietnameseGamers.map((gamer, index) => (
                      <div key={index} className={styles.wintoolItem}>
                        <span className={styles.wintoolUser}>{gamer.user}***</span> - thắng {gamer.amount} VND
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Realtime chatbox */}
            <ChatBox user={localStorage.getItem('user_info') ? JSON.parse(localStorage.getItem('user_info') || '{}').userName : 'guest'} />
          </div>

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

export default TableGame;
