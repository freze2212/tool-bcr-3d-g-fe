import React from "react";
import CyberModal from "./CyberModal/CyberModal";
import "./CyberModal/CyberModal.css";

interface IProps {
  isShowLogout: boolean;
  setIsShowLogout: () => void;
}

const ModalConfirmLogout: React.FC<IProps> = ({
  isShowLogout,
  setIsShowLogout,
}) => {
  const Cookies = require("js-cookie");

  const handleLogout = () => {
    try {
      Cookies.remove("access_token");
    } catch (e) {}
    try {
      localStorage.removeItem("access_token");
    } catch (e) {}
    try {
      localStorage.removeItem("user_info");
    } catch (e) {}
    try {
      localStorage.removeItem("user_avatar");
    } catch (e) {}
    try {
      localStorage.removeItem("title_img");
    } catch (e) {}
    try {
      localStorage.removeItem("NH_PAGE");
    } catch (e) {}
    setIsShowLogout();
    window.location.href = "/login";
  };

  return (
    <CyberModal
      isOpen={isShowLogout}
      onClose={setIsShowLogout}
      title="ĐĂNG XUẤT"
      subtitle="XÁC NHẬN THAO TÁC"
    >
      <p className="cyber-modal-message">
        Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
      </p>

      <div className="cyber-action-row">
        <button
          type="button"
          className="cyber-btn-secondary"
          onClick={setIsShowLogout}
        >
          Hủy bỏ
        </button>
        <button
          type="button"
          className="cyber-btn-danger"
          onClick={handleLogout}
        >
          {">ĐĂNG XUẤT<"}
        </button>
      </div>
    </CyberModal>
  );
};

export default ModalConfirmLogout;
