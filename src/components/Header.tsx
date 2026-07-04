import React, { useEffect, useState } from "react";
import { getUserProfile } from "../utilities/axios.utilities";

interface IProps {
  setIsShowLogout: () => void;
}

const Header: React.FC<IProps> = ({ setIsShowLogout }) => {
  const [isShowMobile, setShowMobile] = useState(false);

  let userInfoString = localStorage.getItem("user_info");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserProfile(data);
        localStorage.setItem("user_info", JSON.stringify({
          coins: data.coins,
          role: data.role,
          userName: data.username,
        }));
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile();
  }, []);


  return (
    <div className="w-full h-[80px]">
      <header className="menu-lobby py-3">
        <nav className="navbar navbar-expand-lg navbar-dark flex justify-center items-center">
          <a className="navbar-brand" href="/">
            <img className="!w-[260px]" src="/assets/logo.png" alt="logo" />
          </a>
          {/* <div className="menu">
            <div
              className={
                isShowMobile
                  ? "menu_wrapper menu_wrapper_active"
                  : "menu_wrapper"
              }
            >
              menu_wrapper_active
              <a href="/" className="menu-item btn-home">
                <p>Trang chủ</p>
              </a>
              <div className="menu-item btn-user flex items-center">
                <img
                  src="/assets/user-ico.png"
                  alt="pdjhjf"
                  className="w-[30px] h-[30px]"
                />
                <p>{userInfo?.userName}</p>
              </div>
              <div className="menu-item btn-credit2 btn-redeem flex items-center">
                <img
                  src="/assets/coins.png"
                  alt="pdjhjf"
                  className="w-[30px] h-[30px]"
                />
                <p>{userInfo?.coins}</p>
              </div>

              <div
                className="menu-item btn-logout flex items-center"
                onClick={setIsShowLogout}
              >
                <img
                  src="/assets/logout-ico.png"
                  alt="pdjhjf"
                  className="w-[30px] h-[30px]"
                />
                <p>Đăng xuất</p>
              </div>
            </div>
            {isShowMobile ? (
              <div
                className="menu-icon change"
                onClick={() => setShowMobile(false)}
              >
                <div className="bar1" />
                <div className="bar2" />
                <div className="bar3" />
              </div>
            ) : (
              <div className="menu-icon" onClick={() => setShowMobile(true)}>
                <div className="bar1" />
                <div className="bar2" />
                <div className="bar3" />
              </div>
            )} */}
          {/* </div> */}
        </nav>
      </header>
    </div>
  );
};

export default Header;
