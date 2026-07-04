import { useState } from "react";
import Header from "../../components/Header";
import ModalConfirmLogout from "../../components/ModalConfirmLogout";
import GameList from "../../components/GameList";

const HomePage = () => {
  const [isShowLogout, setIsShowLogout] = useState(false);

  return (
    <div>
      <Header setIsShowLogout={() => setIsShowLogout(true)} />
      <GameList />
      <ModalConfirmLogout
        isShowLogout={isShowLogout}
        setIsShowLogout={() => {
          setIsShowLogout(false);
        }}
      />
    </div>
  );
};

export default HomePage;
