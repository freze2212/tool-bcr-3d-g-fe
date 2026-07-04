import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./css/main.login.css";
import Register from "../register/Register";
import CyberModal, {
  CyberInputField,
  CyberSubmitButton,
  CyberModalFooter,
} from "../../components/CyberModal/CyberModal";
import { IconUser, IconLock } from "../../components/CyberModal/CyberIcons";

const Login: React.FC = () => {
  const Cookies = require("js-cookie");
  const navagate = useNavigate();

  const [isShowLoginForm, setIsShowLoginForm] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // Kiểm tra token khi component mount
  useEffect(() => {
    const token = Cookies.get("access_token");
    const userInfo = localStorage.getItem("user_info");
    
    // Nếu đã có token và user info, redirect ngay
    if (token && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user.role === "SUPERADMIN" || user.role === "ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/homeNH";
        }
      } catch (e) {
        // Nếu parse lỗi, clear và ở lại trang login
        Cookies.remove("access_token");
        localStorage.removeItem("user_info");
      }
    }
  }, []);

  // Function handle download app đơn giản
  const handleDownloadApp = () => {
    const userAgent = navigator.userAgent || navigator.vendor || '';
    
    if (/android/i.test(userAgent)) {
      // Android - mở Google Play
      window.open('https://play.google.com/store/apps/details?id=your.app.id', '_blank');
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      // iOS - mở App Store
      window.open('https://apps.apple.com/app/idYOUR_APP_ID', '_blank');
    } else {
      // Thiết bị khác - hiển thị thông báo
      Swal.fire({
        icon: 'info',
        title: 'Thông báo',
        text: 'Vui lòng sử dụng thiết bị Android hoặc iOS để tải ứng dụng.',
        customClass: {
          popup: "custom-swal",
          title: "custom-title",
          htmlContainer: "custom-text",
        },
      });
    }
  };

  // Handle Enter key press in input fields
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    // Prevent default form submission
    if (e) {
      e.preventDefault();
    }

    const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if (userName.trim() === "" || password.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Lỗi đăng nhập",
        text: "Vui lòng điền đầy đủ thông tin",
        customClass: {
          popup: "custom-swal",
          title: "custom-title",
          htmlContainer: "custom-text",
        },
      });
      return;
    } else if (userName.trim() != "" || password.trim() != "") {
      try {
        Swal.fire({
          title: "Đang xử lý...",
          text: "Vui lòng đợi giây lát",
          customClass: {
            popup: "custom-swal",
            title: "custom-title",
            htmlContainer: "custom-text",
          },
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Chờ 3 giây
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await axios
          .post(`${process.env.REACT_APP_URL_API}/auth/login`, {
            username: userName,
            password,
          })
          .then((data) => {
            // Persist session info before navigating so route guards see it immediately
            localStorage.setItem(
              "user_info",
              JSON.stringify({
                userName: data.data.user.username,
                coins: data.data.user.coins,
                role: data.data.user.role,
                id: data.data.user._id,
              })
            );

            // Only set secure cookie on HTTPS; in dev (http) secure cookies are ignored
            const isSecure = window.location.protocol === "https:";
            Cookies.set("access_token", data.data.access_token, {
              expires: 1 / 24,
              secure: isSecure,
              sameSite: "Strict",
            });

            // Đóng tất cả modals ngay lập tức
            setIsShowLoginForm(false);
            setIsLogin(false);
            setIsRegister(false);
            
            if ((data.status === 201 && data.data.user.role === "SUPERADMIN") || data.data.user.role === "ADMIN") {
              // Hiện thông báo đẹp và tự động redirect sau 0.5 giây
              Swal.fire({
                html: `
                  <div style="text-align: center; padding: 20px;">
                    <div style="
                      width: 80px; 
                      height: 80px; 
                      background: linear-gradient(135deg, #10b981, #059669);
                      border-radius: 50%; 
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      margin: 0 auto 20px;
                      box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
                      animation: successPulse 1s ease-in-out infinite;
                    ">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <h2 style="
                      color: #10b981; 
                      font-size: 24px; 
                      font-weight: bold; 
                      margin: 0 0 10px 0;
                      text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
                    ">Đăng nhập thành công!</h2>
                    <p style="
                      color: rgba(255, 255, 255, 0.9); 
                      font-size: 16px; 
                      margin: 0 0 15px 0;
                    ">Chào mừng Admin trở lại!</p>
                    <div style="
                      width: 100%; 
                      height: 4px; 
                      background: rgba(16, 185, 129, 0.2); 
                      border-radius: 2px; 
                      overflow: hidden;
                    ">
                      <div style="
                        width: 100%; 
                        height: 100%; 
                        background: linear-gradient(90deg, #10b981, #059669); 
                        border-radius: 2px;
                        animation: loadingBar 0.5s ease-out;
                      "></div>
                    </div>
                  </div>
                  <style>
                    @keyframes successPulse {
                      0%, 100% { transform: scale(1); }
                      50% { transform: scale(1.05); }
                    }
                    @keyframes loadingBar {
                      0% { width: 0%; }
                      100% { width: 100%; }
                    }
                  </style>
                `,
                customClass: {
                  popup: "bg-custom-image",
                },
                timer: 500,
                showConfirmButton: false,
                allowOutsideClick: false,
              });
              // Tự động redirect sau 0.5 giây
              setTimeout(() => {
                window.location.href = "/admin";
              }, 500);
            } else {
              // Hiện thông báo đẹp và tự động redirect sau 0.5 giây
              Swal.fire({
                html: `
                  <div style="text-align: center; padding: 20px;">
                    <div style="
                      width: 80px; 
                      height: 80px; 
                      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                      border-radius: 50%; 
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      margin: 0 auto 20px;
                      box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
                      animation: successPulse 1s ease-in-out infinite;
                    ">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <h2 style="
                      color: #3b82f6; 
                      font-size: 24px; 
                      font-weight: bold; 
                      margin: 0 0 10px 0;
                      text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
                    ">Đăng nhập thành công!</h2>
                    <p style="
                      color: rgba(255, 255, 255, 0.9); 
                      font-size: 16px; 
                      margin: 0 0 15px 0;
                    ">Đang chuyển hướng...</p>
                    <div style="
                      width: 100%; 
                      height: 4px; 
                      background: rgba(59, 130, 246, 0.2); 
                      border-radius: 2px; 
                      overflow: hidden;
                    ">
                      <div style="
                        width: 100%; 
                        height: 100%; 
                        background: linear-gradient(90deg, #3b82f6, #1d4ed8); 
                        border-radius: 2px;
                        animation: loadingBar 0.5s ease-out;
                      "></div>
                    </div>
                  </div>
                  <style>
                    @keyframes successPulse {
                      0%, 100% { transform: scale(1); }
                      50% { transform: scale(1.05); }
                    }
                    @keyframes loadingBar {
                      0% { width: 0%; }
                      100% { width: 100%; }
                    }
                  </style>
                `,
                customClass: {
                  popup: "bg-custom-image",
                },
                timer: 500,
                showConfirmButton: false,
                allowOutsideClick: false,
              });
              
              // Tự động redirect sau 0.5 giây
              setTimeout(() => {
                window.location.href = "/homeNH";
              }, 500);
            }
          })
          .catch((err) => {
            if (err.status === 401) {
              Swal.fire({
                icon: "error",
                title: "Lỗi đăng nhập",
                text: "Tài khoản/mật khẩu không chính xác!",
                customClass: {
                  popup: "custom-swal",
                  title: "custom-title",
                  htmlContainer: "custom-text",
                },
              });
            }
          });
      } catch (error) {
        return error;
      }
    }
  };

  return (
    <div className="login-page ">
      <div className="bgLogin"></div>
      <CyberModal
        isOpen={isShowLoginForm || isLogin}
        onClose={() => {
          setIsShowLoginForm(false);
          setIsLogin(false);
        }}
        title="ĐĂNG NHẬP"
        subtitle="ĐĂNG NHẬP TÀI KHOẢN CỦA BẠN"
      >
        <form onSubmit={handleLogin}>
          <CyberInputField icon={<IconUser />}>
            <input
              type="text"
              className="cyber-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tên tài khoản"
              maxLength={16}
              minLength={4}
              autoComplete="off"
              required
            />
          </CyberInputField>

          <CyberInputField icon={<IconLock />}>
            <input
              type="password"
              className="cyber-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mật khẩu"
              maxLength={16}
              minLength={4}
              autoComplete="off"
              required
            />
          </CyberInputField>

          <CyberSubmitButton label="ĐĂNG NHẬP NGAY" />
        </form>

        <CyberModalFooter
          text="CHƯA CÓ TÀI KHOẢN?"
          linkText="ĐĂNG KÝ NGAY"
          onLinkClick={() => {
            setIsShowLoginForm(false);
            setIsLogin(false);
            setIsRegister(true);
          }}
        />
      </CyberModal>

      <Register
        isRegister={isRegister}
        setIsShowLogin={() => setIsLogin(true)}
        setIsRegister={() => setIsRegister(false)}
      />

      <div className="index-page_wrapper">
        <div id="bg-canvas">
          <canvas
            className="particles-js-canvas-el"
            width="1366"
            height="641"
          ></canvas>
        </div>
        <div className="logo">
          <img
            src="/assets/logo-login.png"
            width={300}
            height={600}
            alt="logo"
            className="logo_main"
            onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="wrapper-content">
            <div className="group-btn">
              <div className="top-row">
                <div
                  className="btn-item btn-login"
                  onClick={() => {
                    setIsShowLoginForm(true);
                  }}
                ></div>
                <div
                  className="btn-item btn-register"
                  onClick={() => {
                    setIsRegister(true);
                  }}
                ></div>
              </div>
              <div
                className="btn-item btn-download"
                onClick={handleDownloadApp}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
