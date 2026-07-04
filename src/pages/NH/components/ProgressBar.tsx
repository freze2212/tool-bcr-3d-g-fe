import React, { useState, useEffect } from 'react';
import './ProgressBar.css';
import { useNavigate } from 'react-router-dom';

interface ProgressBarProps {
  percentage: number;
  title: string;
  imageUrl: string;
  id: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, title, imageUrl, id }) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const isHighWinRate = percentage > 85;
  const navigate = useNavigate();

  const getUserCoins = (): number => {
    const userInfoRaw = localStorage.getItem('user_info');
    if (userInfoRaw) {
      try {
        const userInfo = JSON.parse(userInfoRaw);
        return userInfo?.coins || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  };

  const showInsufficientXuModal = () => {
    const userCoins = getUserCoins();

    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: #040d18;
      border: 1px solid #00f2ff;
      border-radius: 8px;
      padding: 28px;
      text-align: center;
      color: white;
      max-width: 380px;
      width: 90%;
      box-shadow: 0 0 24px rgba(0, 242, 255, 0.25);
      font-family: 'Segoe UI', sans-serif;
    `;

    modalContent.innerHTML = `
      <h2 style="margin: 0 0 16px; color: #ff6b6b; font-size: 20px; text-transform: uppercase;">Không đủ xu!</h2>
      <p style="margin: 0 0 8px; font-size: 15px;">Số xu hiện tại: <strong style="color:#ffeb3b">${userCoins}</strong></p>
      <p style="margin: 0 0 20px; font-size: 15px;">Yêu cầu tối thiểu: <strong style="color:#ffeb3b">1 xu</strong></p>
      <div onclick="window.open('https://t.me/congnghemoi668', '_blank')" style="
        margin-bottom: 16px; font-size: 13px; color: #00f2ff; cursor: pointer;
      ">Liên hệ admin để nạp xu</div>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: linear-gradient(90deg, #00f2ff, #c800ff);
        border: none; border-radius: 6px; padding: 10px 28px;
        color: #000; font-weight: 700; cursor: pointer; font-size: 14px;
      ">Đóng</button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  };

  const handleClick = () => {
    const userCoins = getUserCoins();
    if (userCoins < 1) {
      showInsufficientXuModal();
      return;
    }

    localStorage.setItem('title_img', imageUrl);
    localStorage.setItem('title_text', title);
    localStorage.setItem('win_percent', percentage.toString());
    navigate(`/NH/table/${id}`);
  };

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const from = 0;
    const to = percentage;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayPercentage(Math.floor(from + (to - from) * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [percentage]);

  const multiplier = Math.max(100, Math.round(displayPercentage * 200)).toLocaleString();
  const statusText = isHighWinRate ? 'CHẠY' : 'CHỜ';

  return (
    <div className="slot-game-card" onClick={handleClick}>
      <div className="slot-game-card-border-outer" />
      <div className="slot-game-card-border-inner" />
      <div className="slot-game-card-bracket slot-game-card-bracket--tl" />
      <div className="slot-game-card-bracket slot-game-card-bracket--br" />
      <div className="slot-game-card-dots">
        <span /><span /><span />
      </div>

      <div className="slot-game-card-image-wrap">
        <img src={imageUrl} alt={title} loading="lazy" />
        <span className="slot-game-card-badge">{multiplier}x</span>
      </div>

      <h3 className="slot-game-card-title">{title}</h3>

      <div className="slot-game-card-status">
        <span className="slot-game-card-status-corner slot-game-card-status-corner--tl" />
        <span className="slot-game-card-status-corner slot-game-card-status-corner--br" />
        <span className={`slot-game-card-status-text ${isHighWinRate ? 'is-run' : ''}`}>
          {statusText}
        </span>
      </div>

      <div className="slot-game-card-progress">
        <div
          className="slot-game-card-progress-fill"
          style={{ width: `${displayPercentage}%` }}
        />
      </div>

      <p className="slot-game-card-percent">{displayPercentage}%...</p>
    </div>
  );
};

export default ProgressBar;
