import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import ChatBox from "../../components/ChatBox";
import ModalConfirmLogout from "../../components/ModalConfirmLogout";
import axios from "axios";
import Cookies from "js-cookie";
import styles from "./style.module.css";
import "../login/css/main.login.css";
import Swal from "sweetalert2";
import SiteBrand from "../../components/SiteBrand";

const TableGameNew = () => {
  const navigate = useNavigate();
  const { room } = useParams();
  const userInfo = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user_info") || "null"); } catch { return null; }
  }, []);

  const userName: string = userInfo?.userName || "GUEST";
  const [userCoins, setUserCoins] = useState<number>(userInfo?.coins ?? 0);
  const [isShowLogout, setIsShowLogout] = useState(false);
  const avatar: string = localStorage.getItem("user_avatar") || "/assets/user-icon.gif";
  const hallAvatar: string = (localStorage.getItem("selected_hall_avatar") || localStorage.getItem("hallAvatar") || "/assets/casino/PG.png") as string;
  const gameImg: string = (localStorage.getItem("title_img") || "/assets/phantichchitiet.gif") as string;
  const gameTitle = "MAO MAY MẮN";
  const winPercent = parseInt(localStorage.getItem("win_percent") || "97");

  // Spin system states
  const [points, setPoints] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [manualValues, setManualValues] = useState({ rounds: 0, minBet: "0K" });
  const [autoValues, setAutoValues] = useState({ rounds: 0, minBet: "0K" });
  const [showGifButton, setShowGifButton] = useState(true);
  const [currentRounds, setCurrentRounds] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  // Random game names for winners
  const gameNames = [
    "3 con lợn", "Slot Girl King", "Baccarat", "Dragon Tiger", "Roulette", 
    "Blackjack", "Poker", "Slot Fortune", "Crazy Monkey", "Lucky Wheel",
    "Golden Dragon", "Phoenix Rising", "Lucky 7", "Diamond Rush", "Treasure Hunt"
  ];

  // Generate random winners with game names - use all 50 gamers
  const generateRandomWinners = () => {
    return vietnameseGamers.map(gamer => ({
      ...gamer,
      game: gameNames[Math.floor(Math.random() * gameNames.length)]
    }));
  };

  const [winners, setWinners] = useState(generateRandomWinners());
  const [randomMemberCount, setRandomMemberCount] = useState(0);

  // Helpers: coin fetch/update
  useEffect(() => {
    const raw = localStorage.getItem("user_info");
    if (raw) {
      try { setUserCoins(JSON.parse(raw)?.coins ?? 0); } catch {}
    }
    
    // Random member count mỗi khi component mount (refresh trang)
    setRandomMemberCount(Math.floor(Math.random() * 201) + 300);
  }, []);

  // Loading frame for both mobile and PC
  useEffect(() => {
    setIsLoading(true);
      
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
                <span style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">Đang chiếm quyền...</span>
              </div>
              <div data-progress="2" style="
                padding: 8px 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: progressGlow 1.5s ease-in-out infinite 0.5s;
                text-align: center;
              ">
                <span style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">Đang xâm nhập hệ thống...</span>
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
      setIsLoading(false);
    }, 4000);
  }, []);

  const deductCoins = async (amount: number = 1, action: string = "PLAY_GAME") => {
    try {
      const token = Cookies.get("access_token");
      if (!token) return true; // không chặn luồng khi dev chưa login
      const res = await axios.post(
        `${process.env.REACT_APP_URL_API}/users/subtract-coins-for-action`,
        { amount, action },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const newCoins = res.data?.coins ?? userCoins;
      setUserCoins(newCoins);
      const raw = localStorage.getItem("user_info");
      if (raw) {
        const u = JSON.parse(raw); u.coins = newCoins; localStorage.setItem("user_info", JSON.stringify(u));
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  // Random in range function
  const randomInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const makeMinBet = (target: number, lowFactor: number, highFactor: number) => {
    const min = Math.max(1, Math.round(target * lowFactor));
    const max = Math.max(min + 1, Math.round(target * highFactor));
    return randomInRange(min, max);
  };

  // Generate spin options based on target points (sub-linear scale, keep rounds low)
  const generateSpinOptions = (target: number) => {
    const core = Math.max(4, Math.round(Math.sqrt(target) * 0.55 + 3));

    function makeOptions(extraSpins = 0) {
      return [
        {
          label: "Ultra Safe",
          spins: randomInRange(Math.max(2, core - 3), Math.max(3, core - 1)) + extraSpins,
          min: makeMinBet(target, 0.008, 0.025),
        },
        {
          label: "Safe",
          spins: randomInRange(Math.max(3, core - 2), core) + extraSpins,
          min: makeMinBet(target, 0.015, 0.04),
        },
        {
          label: "Balanced",
          spins: randomInRange(core, core + 2) + extraSpins,
          min: makeMinBet(target, 0.03, 0.06),
        },
        {
          label: "Aggressive",
          spins: randomInRange(core + 1, core + 4) + extraSpins,
          min: makeMinBet(target, 0.05, 0.08),
        },
        {
          label: "All-in",
          spins: randomInRange(core + 3, core + 7) + extraSpins,
          min: makeMinBet(target, 0.07, 0.12),
        },
      ];
    }

    return {
      manual: makeOptions(),
      auto: makeOptions(randomInRange(2, 5)),
    };
  };

  // Actions
  const handleStart = async () => {
    const input = parseInt(points);
    if (!input || input <= 0) return;
    
    // Check if user has enough coins
    if (userCoins < 1) {
      showInsufficientXuModal();
      return;
    }

    // Deduct 1 xu
    const ok = await deductCoins(1, "SPIN_START");
    if (!ok) {
      showInsufficientXuModal();
      return;
    }
    
    setIsSpinning(true);
    
    // Sử dụng công thức generateSpinOptions mới
    const spinOptions = generateSpinOptions(input);
    
    // Chọn random 1 option từ mỗi loại (manual và auto) - giờ có 5 options
    const selectedManual = spinOptions.manual[Math.floor(Math.random() * 5)];
    const selectedAuto = spinOptions.auto[Math.floor(Math.random() * 5)];
    
    const manualBetFormatted = selectedManual.min >= 1000 ? 
      `${Math.floor(selectedManual.min / 1000)}K` : 
      `${selectedManual.min}`;
    
    const autoBetFormatted = selectedAuto.min >= 1000 ? 
      `${Math.floor(selectedAuto.min / 1000)}K` : 
      `${selectedAuto.min}`;
    
    setManualValues({ 
      rounds: selectedManual.spins, 
      minBet: manualBetFormatted 
    });
    setAutoValues({ 
      rounds: selectedAuto.spins, 
      minBet: autoBetFormatted 
    });
    setTimeout(() => setIsSpinning(false), 250);
  };

  const handleGifButtonClick = async () => {
    if (!showGifButton) return;
    
    // Check if user has enough coins
    if (userCoins < 1) {
      showInsufficientXuModal();
      return;
    }

    // Deduct 1 xu
    const ok = await deductCoins(1, "GIF_BUTTON");
    if (!ok) {
      showInsufficientXuModal();
      return;
    }
    
    setShowGifButton(false);
    
    // Sử dụng randomInRange cho số vòng quay
    const randomRounds = randomInRange(10, 18);
    // Sử dụng randomInRange cho thời gian countdown (10-15 phút)
    const totalSeconds = randomInRange(10 * 60, 15 * 60); // 10-15 phút
    
    setCurrentRounds(randomRounds);
    setCountdown(totalSeconds);
    const id = setInterval(() => {
      setCountdown((p) => {
        if (p <= 1) { clearInterval(id); setShowGifButton(true); setCurrentRounds(0); return 0; }
        return p - 1;
      });
    }, 1000);
  };

  const handle3WinClick = async () => {
    // Check if user has enough coins
    if (userCoins < 1) {
      showInsufficientXuModal();
      return;
    }

    // Deduct 1 xu
    const ok = await deductCoins(1, "3_WIN_CLICK");
    if (!ok) {
      showInsufficientXuModal();
      return;
    }

    // Navigate to wintool-forward page
    navigate('/wintool-forward');
  };

  const showInsufficientXuModal = () => {
    // Create modal element
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(8px);
      animation: modalFadeIn 0.3s ease-out;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: 
        radial-gradient(circle at 30% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(255, 235, 59, 0.05) 0%, transparent 50%),
        linear-gradient(135deg, 
          rgba(26, 26, 46, 0.95) 0%, 
          rgba(22, 33, 62, 0.98) 25%,
          rgba(15, 52, 96, 0.95) 50%,
          rgba(22, 33, 62, 0.98) 75%,
          rgba(26, 26, 46, 0.95) 100%);
      border: 2px solid #ff6b6b;
      border-radius: 25px;
      padding: 35px;
      text-align: center;
      color: white;
      max-width: 420px;
      width: 90%;
      box-shadow: 
        0 0 40px rgba(255, 107, 107, 0.4),
        0 0 80px rgba(255, 235, 59, 0.2),
        0 20px 60px rgba(0, 0, 0, 0.5),
        inset 0 0 30px rgba(255, 107, 107, 0.1);
      position: relative;
      animation: modalSlideIn 0.4s ease-out;
      font-family: 'Courier New', monospace;
    `;

    modalContent.innerHTML = `
      <style>
        @keyframes modalFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes modalSlideIn {
          0% { 
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
            filter: blur(5px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(255, 107, 107, 0.5); }
          50% { text-shadow: 0 0 20px rgba(255, 107, 107, 0.8); }
        }
      </style>
      
      <div style="display: flex; align-items: center; margin-bottom: 25px; animation: textGlow 2s ease-in-out infinite;">
        <div style="
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #ffeb3b, #ffc107);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          font-size: 28px;
          color: #000;
          font-weight: bold;
          box-shadow: 
            0 0 20px rgba(255, 235, 59, 0.6),
            0 0 40px rgba(255, 193, 7, 0.3);
          animation: iconPulse 1.5s ease-in-out infinite;
          border: 2px solid rgba(255, 255, 255, 0.3);
        ">!</div>
        <h2 style="
          margin: 0; 
          color: #ff6b6b; 
          font-size: 26px; 
          font-weight: 900;
          text-shadow: 
            0 0 15px rgba(255, 107, 107, 0.8),
            0 0 25px rgba(255, 107, 107, 0.5);
          letter-spacing: 2px;
          text-transform: uppercase;
        ">KHÔNG ĐỦ XU!</h2>
      </div>
      
      <div style="margin-bottom: 20px; font-size: 16px;">
        <div style="
          margin-bottom: 12px; 
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        ">
          <span style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">SỐ XU HIỆN TẠI: </span>
          <span style="
            color: #ffeb3b; 
            font-weight: bold; 
            font-size: 20px;
            text-shadow: 0 0 10px rgba(255, 235, 59, 0.6);
          ">${userCoins} XU</span>
        </div>
        <div style="
          margin-bottom: 12px; 
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        ">
          <span style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">YÊU CẦU TỐI THIỂU: </span>
          <span style="
            color: #ffeb3b; 
            font-weight: bold; 
            font-size: 20px;
            text-shadow: 0 0 10px rgba(255, 235, 59, 0.6);
          ">1 XU</span>
        </div>
      </div>
      
      <div onclick="window.open('https://t.me/congnghemoi668', '_blank')" style="
        margin-bottom: 25px; 
        font-size: 14px; 
        color: #64b5f6;
        padding: 10px 15px;
        background: rgba(100, 181, 246, 0.1);
        border-radius: 4px;
        border: 1px solid rgba(100, 181, 246, 0.3);
        text-shadow: 0 0 10px rgba(100, 181, 246, 0.5);
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s ease;
      " onmouseover="
        this.style.backgroundColor='rgba(100, 181, 246, 0.2)';
        this.style.borderColor='rgba(100, 181, 246, 0.5)';
        this.style.transform='scale(1.02)';
      " onmouseout="
        this.style.backgroundColor='rgba(100, 181, 246, 0.1)';
        this.style.borderColor='rgba(100, 181, 246, 0.3)';
        this.style.transform='scale(1)';
      ">
        » LIÊN HỆ ADMIN ĐỂ NẠP XU «
      </div>
      
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: linear-gradient(45deg, #ff6b6b, #ee5a24);
        border: none;
        border-radius: 12px;
        padding: 14px 35px;
        color: white;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 
          0 0 20px rgba(255, 107, 107, 0.4),
          0 4px 15px rgba(0, 0, 0, 0.3);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-family: 'Courier New', monospace;
      " onmouseover="
        this.style.transform='translateY(-2px)';
        this.style.boxShadow='0 0 30px rgba(255, 107, 107, 0.6), 0 6px 20px rgba(0, 0, 0, 0.4)';
      " onmouseout="
        this.style.transform='translateY(0)';
        this.style.boxShadow='0 0 20px rgba(255, 107, 107, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)';
      ">
        ĐÓNG
      </button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  };

  return (
    <div className="min-h-screen w-full bg-repeat bg-top" style={{ position: 'relative' }}>
      {/* Custom CSS for mobile layout */}
      <style>
        {`
          @media (max-width: 390px) {
            .mobile-user-section {
              width: 35% !important;
            }
            .mobile-trick-section {
              width: 65% !important;
              align-items: flex-start !important;
            }
            .mobile-avatar {
              height: 10rem !important;
            }
            .mobile-trick-button {
              transform: scale(0.9) !important;
              margin-left: 1rem !important;
              padding-left: 1.5rem !important;
              padding-right: 1.5rem !important;
            }
            .mobile-trick-text {
              font-size: 0.75rem !important;
              line-height: 1 !important;
            }
            .mobile-input-section {
              transform: scale(0.85) !important;
              margin-left: 0.5rem !important;
            }
            .mobile-start-button {
              transform: scale(0.85) !important;
            }
            .mobile-spin-modes {
              transform: scale(0.85) !important;
              margin-left: -0.5rem !important;
            }
          }
        `}
      </style>

      {/* Top bar (div-based header) - chỉ cho mobile */}
      {window.innerWidth <= 430 && (
        <div className="max-w-[440px] mx-auto px-3 pt-4">
          {/* Back button aligned left */}
          {/* Centered logo */}
          <div className=" flex justify-center">
            <SiteBrand />
          </div>
          <div className="flex justify-start ml-5 ">
            <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/NH'))} className="w-12 h-10 mt-2" aria-label="Quay lại">
              <img src="/assets/back.png" alt="Back" className="w-full h-full object-contain" />
            </button>
          </div>
          {/* Two big divs in a row */}
          <div className="mt-6 flex items-start justify-between">
            {/* Left: avatar + name + user actions in one container */}
            <div className="flex flex-col items-center w-1/4 mobile-user-section">
              <img src={avatar} alt="avatar" className="w-24 h-32 rounded-xl object-cover mobile-avatar" />
              <div className="text-white font-extrabold text-xl tracking-wide text-center">{userName}</div>
              
              {/* User actions - coins, contact, logout stacked vertically */}
              <div className="flex flex-col items-center gap-2 mt-3">
                {/* Coins with image background */}
                <div
                  className="w-32 h-7 bg-no-repeat bg-contain flex items-center justify-center text-white text-xs font-semibold drop-shadow"
                  style={{ backgroundImage: "url('/assets/count-coins.png')" }}
                >
                  Số xu: {userCoins.toLocaleString('vi-VN')}
                </div>
                {/* Contact admin with image background */}
                <button
                  className="w-32 h-7 bg-no-repeat bg-contain flex items-center justify-center text-white text-xs font-semibold drop-shadow"
                  style={{ backgroundImage: "url('/assets/contact-admin.png')" }}
                  onClick={() => window.open('https://t.me/congnghemoi668', '_blank')}
                >
                  Liên hệ Admin
                </button>
                {/* Logout button with image background */}
                <button
                  className="w-32 h-7 bg-center bg-no-repeat bg-contain flex items-center justify-center text-white text-xs font-extrabold drop-shadow"
                  style={{ backgroundImage: "url('/assets/logout-btn.png')" }}
                  onClick={() => setIsShowLogout(true)}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
            {/* Right: Trick quay system + input + spin modes */}
            <div className="flex flex-col items-end w-3/4 gap-3 mobile-trick-section">
              {/* Hệ thống trick quay button */}
              <button className="relative group overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-cyan-400 rounded-lg px-6 py-3 hover:scale-105 transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] mobile-trick-button">
                {/* Animated border effect - constantly running */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-cyan-400 opacity-80 animate-spin" style={{animationDuration: '3s'}}></div>
                <div className="absolute inset-[3px] bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-md"></div>
                
                {/* Pulsing inner glow */}
                <div className="absolute inset-0 rounded-lg bg-cyan-400/20 animate-pulse"></div>
                
                {/* Glowing text with stronger effects */}
                <span className="relative z-10 text-cyan-300 font-black text-base tracking-widest group-hover:text-white transition-all duration-500 drop-shadow-[0_0_20px_rgba(34,211,238,1)] group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] mobile-trick-text">
                  HỆ THỐNG TRICK QUAY
                </span>
                
                {/* Moving scanning lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-100 animate-pulse" style={{animationDuration: '1.5s'}}></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-100 animate-pulse" style={{animationDuration: '1.5s', animationDelay: '0.75s'}}></div>
                
                {/* Animated corner accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400 opacity-100 animate-ping" style={{animationDuration: '2s'}}></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400 opacity-100 animate-ping" style={{animationDuration: '2s', animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400 opacity-100 animate-ping" style={{animationDuration: '2s', animationDelay: '1s'}}></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400 opacity-100 animate-ping" style={{animationDuration: '2s', animationDelay: '1.5s'}}></div>
                
                {/* Matrix-style falling dots */}
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="absolute top-0 left-1/4 w-1 h-1 bg-cyan-400 animate-bounce opacity-60" style={{animationDuration: '3s', animationDelay: '0s'}}></div>
                  <div className="absolute top-0 left-3/4 w-1 h-1 bg-cyan-400 animate-bounce opacity-60" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
                  <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 animate-bounce opacity-60" style={{animationDuration: '3s', animationDelay: '2s'}}></div>
                </div>
              </button>

              {/* Nhập số điểm + Start */}
              <div className="flex justify-center items-center gap-1">
                <div className="w-40 rounded-xl overflow-hidden shadow-md mobile-input-section">
                  <div 
                    className="w-full h-[100px] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center"
                    style={{ backgroundImage: "url('/assets/nhapsodiem.gif')" }}
                  >
                    <div className="text-white text-sm font-bold mb-2 drop-shadow-lg">NHẬP SỐ ĐIỂM</div>
                    <input 
                      className="w-20 h-8 text-center rounded-md bg-black/40 border border-cyan-500/50 text-white font-bold" 
                      placeholder="..." 
                      type="number" 
                      value={points} 
                      onChange={(e)=>setPoints(e.target.value)}
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>
                <button className="w-24 rounded-xl overflow-hidden shadow-md mobile-start-button" onClick={handleStart} disabled={isSpinning}>
                  <img src="/assets/start.gif" alt="START" className="w-full h-[90px] object-contain bg-transparent" />
                </button>
              </div>

              {/* Spin modes */}
              <div 
                className="w-72 h-36 rounded-xl bg-no-repeat bg-cover bg-center flex items-center justify-center ml-4 mobile-spin-modes"
                style={{ backgroundImage: "url('/assets/bg-round-suggest.gif')" }}
              >
                <div className="flex flex-col gap-1 w-64">
                  <button className="rounded-lg border border-cyan-600/40 bg-black/30 p-2 text-center text-white">
                    <div className="text-xs opacity-80">QUAY MỒI THỦ CÔNG</div>
                    <div className="text-cyan-300 text-xs">{manualValues.rounds} vòng - min {manualValues.minBet}</div>
                  </button>
                  <button className="rounded-lg border border-cyan-600/40 bg-black/30 p-2 text-center text-white">
                    <div className="text-xs opacity-80">QUAY AUTO</div>
                    <div className="text-cyan-300 text-xs">{autoValues.rounds} vòng - min {autoValues.minBet}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className={window.innerWidth <= 430 ? "max-w-[440px] mx-auto pt-4" : "w-full h-screen flex"}>
        {/* Mobile Layout */}
        {window.innerWidth <= 430 ? (
          <div className="min-h-screen w-full bg-repeat bg-top" style={{ position: 'relative' }}>
            {/* Lucky circle */}
            <section className="relative">
              <div className="relative w-full h-[280px] flex items-center justify-center rounded-xl overflow-visible">
                {/* ring gif backdrop */}
                <img src="/assets/phantichchitiet.gif" alt="Lucky" className="absolute inset-0 w-full h-full object-contain" />
                  {/* top-left ear: hall avatar */}
                  <div className={`absolute w-14 h-14 rounded-full overflow-hidden bg-black/40 ${styles.hallAvatarResponsive}`}>
                    <img src={hallAvatar} alt="hall" className="w-full h-full object-cover" onError={(e)=>{ (e.currentTarget as HTMLImageElement).src='/assets/casino/PG.png'; }} />
                  </div>
                {/* top-right ear: percent */}
                <div className={styles.percentCircle}>
                  {winPercent}%
                </div>
                {/* center game image - circular */}
                <img src={gameImg} alt="game" className="relative z-[1] w-28 h-28 rounded-full object-cover border-2 border-white/70 shadow-[0_0_12px_rgba(0,0,0,.6)]" />
                {/* title pill */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 min-w-[12rem] px-4 py-2 rounded-full flex items-center justify-center bg-black/75 border border-cyan-400/50">
                  <span className="text-cyan-300 text-sm font-extrabold tracking-widest uppercase drop-shadow">{gameTitle}</span>
                </div>
              </div>
            </section>

            {/* Top row: Bigwin + Nhận số vòng quay */}
            <section className="mt-5 grid grid-cols-2 gap-3">
              <button 
                className="col-span-1 rounded-xl overflow-hidden shadow-md"
                onClick={handle3WinClick}
              >
                <img src="/assets/3-win.gif" alt="BIG WIN" className="w-full h-[110px] object-cover" />
              </button>
              {showGifButton ? (
                <button 
                  className="col-span-1 rounded-xl overflow-hidden shadow-md"
                  onClick={handleGifButtonClick}
                >
                  <img src="/assets/sovongquay.gif" alt="Nhận số vòng quay" className="w-full h-[116px] object-cover" />
                </button>
              ) : (
                <div className="col-span-1 rounded-xl border border-emerald-600/40 bg-black/30 text-center text-white flex flex-col items-center justify-center h-[116px]">
                  <div className="text-xs">SỐ VÒNG</div>
                  <div className="text-2xl font-extrabold mb-2">{currentRounds}</div>
                  <div className="text-xs">ĐẾM NGƯỢC</div>
                  <div className="text-pink-400 font-bold">
                    {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2,'0')}
                  </div>
                </div>
              )}
            </section>

            {/* Winners */}
            <section className="mt-6 mb-12">
                <style>
                    {`
                    @keyframes scroll {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                    }
                    `}
                </style>

                <div 
                    className="w-full max-w-[400px] mx-auto h-64 rounded-xl bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center relative"
                    style={{ backgroundImage: "url('/assets/wintool.gif')" }}
                >
                    {/* Số người online */}
                    <div 
                    className="absolute right-4 text-white font-extrabold" 
                    style={{ top: '0.3rem', fontSize: '1rem', lineHeight: '2rem' }}
                    >
                    {randomMemberCount || Math.floor(Math.random() * 201) + 300}
                    </div>

                    {/* Danh sách winners */}
                    <div className="space-y-2 w-full px-8 h-36 overflow-hidden gap-2">
                    <div 
                        className="space-y-2"
                        style={{
                        animation: 'scroll 28s linear infinite',
                        }}
                    >
                        {winners.map((w, i) => (
                        <div key={i} className="text-white text-sm text-left">
                            <span className="text-amber-300 font-bold">{w.user}***</span> - thắng {w.amount} VND {w.game}
                        </div>
                        ))}

                        {/* Duplicate để loop mượt */}
                        {winners.map((w, i) => (
                        <div key={`duplicate-${i}`} className="text-white text-sm text-left">
                            <span className="text-amber-300 font-bold">{w.user}***</span> - thắng {w.amount} VND {w.game}
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
            </section>

            {/* Chat */}
            {/* <section className="mt-6">
              <ChatBox user={userName} />
            </section> */}
          </div>
        ) : (
          /* PC Layout - 2 div tổng với flex ngang */
          <>
            {/* Back button - PC only, positioned freely */}
            <button 
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/NH'))} 
              className="fixed top-6 left-16 z-50 w-20 h-16 hover:scale-105 transition-transform duration-200"
              aria-label="Quay lại"
            >
              <img src="/assets/back.png" alt="Back" className="w-full h-full object-contain" />
            </button>

            {/* Div tổng 1 - Left side */}
            <div className="flex-1 flex flex-col gap-6 items-center pt-4 ml-40">

              {/* phantichchitiet */}
              <div className="relative w-full h-[600px] flex items-center justify-center rounded-xl overflow-visible">
                <img src="/assets/phantichchitiet.gif" alt="Lucky" className="absolute inset-0 w-full h-full object-contain" />
                {/* top-left ear: hall avatar */}
                <div className={`absolute w-16 h-16 rounded-full overflow-hidden bg-black/40 ${styles.hallAvatarResponsive}`}>
                  <img src={hallAvatar} alt="hall" className="w-full h-full object-cover" onError={(e)=>{ (e.currentTarget as HTMLImageElement).src='/assets/casino/PG.png'; }} />
                </div>
                {/* top-right ear: percent */}
                <div className={styles.percentCircle}>
                  {winPercent}%
                </div>
                {/* center game image - circular */}
                <img src={gameImg} alt="game" className="relative z-[1] w-32 h-32 rounded-full object-cover border-2 border-white/70 shadow-[0_0_12px_rgba(0,0,0,.6)]" />
                {/* title pill */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 min-w-[14rem] px-5 py-2 rounded-full flex items-center justify-center bg-black/75 border border-cyan-400/50">
                  <span className="text-cyan-300 text-lg font-extrabold tracking-widest uppercase drop-shadow">{gameTitle}</span>
                </div>
              </div>

              {/* Bigwin + Nhận số vòng quay */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  className="col-span-1 rounded-xl overflow-hidden shadow-md"
                  onClick={handle3WinClick}
                >
                  <img src="/assets/3-win.gif" alt="BIG WIN" className="w-full h-[140px] object-cover" />
                </button>
                {showGifButton ? (
                  <button 
                    className="col-span-1 rounded-xl overflow-hidden shadow-md"
                    onClick={handleGifButtonClick}
                  >
                    <img src="/assets/sovongquay.gif" alt="Nhận số vòng quay" className="w-full h-[140px] object-cover" />
                  </button>
                ) : (
                  <div className="col-span-1 rounded-xl border border-emerald-600/40 bg-black/30 text-center text-white flex flex-col items-center justify-center h-[140px]">
                    <div className="text-sm">SỐ VÒNG</div>
                    <div className="text-3xl font-extrabold mb-2">{currentRounds}</div>
                    <div className="text-sm">ĐẾM NGƯỢC</div>
                    <div className="text-pink-400 font-bold text-lg">
                      {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2,'0')}
                    </div>
                  </div>
                )}
              </div>

              {/* Hệ thống trick quay button */}
              <div className="flex justify-center">
                <button className="relative group overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-cyan-400 rounded-lg px-10 py-5 hover:scale-105 transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)]">
                  {/* Animated border effect - constantly running */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-cyan-400 opacity-80 animate-spin" style={{animationDuration: '3s'}}></div>
                  <div className="absolute inset-[3px] bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-md"></div>
                  
                  {/* Pulsing inner glow */}
                  <div className="absolute inset-0 rounded-lg bg-cyan-400/20 animate-pulse"></div>
                  
                  {/* Glowing text with stronger effects */}
                  <span className="relative z-10 text-cyan-300 font-black text-xl tracking-widest group-hover:text-white transition-all duration-500 drop-shadow-[0_0_20px_rgba(34,211,238,1)] group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
                    HỆ THỐNG TRICK QUAY
                  </span>
                  
                  {/* Moving scanning lines */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-100 animate-pulse" style={{animationDuration: '1.5s'}}></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-100 animate-pulse" style={{animationDuration: '1.5s', animationDelay: '0.75s'}}></div>
                  
                  {/* Animated corner accents */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400 opacity-100 animate-ping" style={{animationDuration: '2s'}}></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400 opacity-100 animate-ping" style={{animationDuration: '2s', animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400 opacity-100 animate-ping" style={{animationDuration: '2s', animationDelay: '1s'}}></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400 opacity-100 animate-ping" style={{animationDuration: '2s', animationDelay: '1.5s'}}></div>
                  
                  {/* Matrix-style falling dots */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div className="absolute top-0 left-1/4 w-1 h-1 bg-cyan-400 animate-bounce opacity-60" style={{animationDuration: '3s', animationDelay: '0s'}}></div>
                    <div className="absolute top-0 left-3/4 w-1 h-1 bg-cyan-400 animate-bounce opacity-60" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 animate-bounce opacity-60" style={{animationDuration: '3s', animationDelay: '2s'}}></div>
                  </div>
                </button>
              </div>

              {/* Nhập số điểm + Start */}
              <div className="flex justify-center items-center gap-3">
                <div className="w-48 rounded-xl overflow-hidden shadow-md">
                  <div 
                    className="w-full h-[130px] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center"
                    style={{ backgroundImage: "url('/assets/nhapsodiem.gif')" }}
                  >
                    <div className="text-white text-lg font-bold mb-2 drop-shadow-lg">NHẬP SỐ ĐIỂM</div>
                    <input 
                      className="w-24 h-10 text-center rounded-md bg-black/40 border border-cyan-500/50 text-white font-bold" 
                      placeholder="..." 
                      type="number" 
                      value={points} 
                      onChange={(e)=>setPoints(e.target.value)}
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>
                <button className="w-32 rounded-xl overflow-hidden shadow-md" onClick={handleStart} disabled={isSpinning}>
                  <img src="/assets/start.gif" alt="START" className="w-full h-[110px] object-contain bg-transparent" />
                </button>
              </div>

              {/* Spin modes */}
              <div 
                className="w-96 h-56 rounded-xl bg-no-repeat bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url('/assets/bg-round-suggest.gif')" }}
              >
                <div className="flex flex-col gap-3 w-80">
                  <button className="rounded-lg border border-cyan-600/40 bg-black/30 p-4 text-center text-white">
                    <div className="text-lg opacity-80">QUAY MỒI THỦ CÔNG</div>
                    <div className="text-cyan-300 text-lg">{manualValues.rounds} vòng - min {manualValues.minBet}</div>
                  </button>
                  <button className="rounded-lg border border-cyan-600/40 bg-black/30 p-4 text-center text-white">
                    <div className="text-lg opacity-80">QUAY AUTO</div>
                    <div className="text-cyan-300 text-lg">{autoValues.rounds} vòng - min {autoValues.minBet}</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Div tổng 2 - Right side */}
            <div className="flex-1 flex flex-col gap-6 items-start mt-16 ml-16">
              {/* User info, coins, contact, logout - dùng lại từ mobile */}
              <div className="flex items-start gap-4 w-full mb-4">
                {/* Left: avatar + name theo hàng dọc */}
                <div className="flex flex-col items-center gap-2">
                  <img src={avatar} alt="avatar" className="w-28 h-32 rounded-xl object-cover" />
                  <div className="text-white font-extrabold text-xl tracking-wide text-center">{userName}</div>
                </div>
                {/* Right: coins + contact (row) + logout below; all grouped */}
                <div className="flex flex-col items-start mt-6">
                  <div className="flex items-center gap-2">
                    {/* Coins with image background */}
                    <div
                      className="w-40 h-9 bg-no-repeat bg-contain flex items-center justify-center text-white text-sm font-semibold drop-shadow"
                      style={{ backgroundImage: "url('/assets/count-coins.png')" }}
                    >
                      Số xu: {userCoins.toLocaleString('vi-VN')}
                    </div>
                    {/* Contact admin with image background */}
                    <button
                      className="w-40 h-9 bg-no-repeat bg-contain flex items-center justify-center text-white text-sm font-semibold drop-shadow"
                      style={{ backgroundImage: "url('/assets/contact-admin.png')" }}
                      onClick={() => window.open('https://t.me/congnghemoi668', '_blank')}
                    >
                      Liên hệ Admin
                    </button>
                  </div>
                  {/* Logout button with image background */}
                  <button
                    className="w-[17rem] mt-3 h-10 bg-center bg-no-repeat bg-contain flex items-center justify-center text-white text-sm font-extrabold drop-shadow"
                    style={{ backgroundImage: "url('/assets/logout-btn.png')" }}
                    onClick={() => setIsShowLogout(true)}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>

              {/* Winners */}
              <div 
                className="w-full max-w-[508px] mt-4 mb-12 h-72 rounded-xl bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center relative"
                style={{ backgroundImage: "url('/assets/wintool.gif')" }}
              >
                <style>
                  {`
                  @keyframes scroll {
                      0% { transform: translateY(0); }
                      100% { transform: translateY(-50%); }
                  }
                  `}
                </style>
                {/* Số người online */}
                <div 
                  className="absolute right-12 text-[#f0c400] font-extrabold" 
                  style={{ top: '0rem', fontSize: '1.2rem', lineHeight: '2.5rem' }}
                >
                  {randomMemberCount || Math.floor(Math.random() * 201) + 300}
                </div>

                {/* Danh sách winners */}
                <div className="space-y-3 w-full px-10 h-44 overflow-hidden gap-3">
                  <div 
                    className="space-y-3"
                    style={{
                      animation: 'scroll 28s linear infinite',
                    }}
                  >
                    {winners.map((w, i) => (
                      <div key={i} className="text-white text-lg text-left">
                        <span className="text-amber-300 font-bold">{w.user}***</span> - thắng {w.amount} VND {w.game}
                      </div>
                    ))}

                    {/* Duplicate để loop mượt */}
                    {winners.map((w, i) => (
                      <div key={`duplicate-${i}`} className="text-white text-lg text-left">
                        <span className="text-amber-300 font-bold">{w.user}***</span> - thắng {w.amount} VND {w.game}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat */}
              {/* <div className="w-full max-w-[508px]">
                <ChatBox user={userName} />
              </div> */}
            </div>
          </>
        )}
      </main>
      
      <ModalConfirmLogout
        isShowLogout={isShowLogout}
        setIsShowLogout={() => {
          setIsShowLogout(false);
        }}
      />
    </div>
  );
};

export default TableGameNew;


