import React from "react";

interface IProps {
  dataRound: any;
  countDown: number;
  shuffle: number | null;
}

const ScoreBoard: React.FC<IProps> = ({
  dataRound,
  countDown,
  shuffle = null,
}) => {
  return (
    <div>
      <div className="flex">
        <div className="w-1/2 px-2">
          <div className="box-winlose-percent">
            <p className="mt-3 mb-1 text-center text-white text-[2rem]">
              {" "}
              Tỷ lệ thắng{" "}
            </p>
            <h2
              className="percent-room text-center font-semibold text-white drop-shadow-[0_0_6px_#55abd3] text-[2rem]"
              id="winrate"
            >
              {Math.round(dataRound?.percentCurrent.Forecast || 0)}%
            </h2>
          </div>
        </div>
        <div className="w-1/2 px-2">
          <div className=" p-4 rounded">
            <p className="text-[4em] text-center font-semibold bg-gradient-to-b from-[#00aeef] via-[#66d9ff] to-[#00aeef] bg-clip-text text-transparent drop-shadow-[0_0_10px_#00aeef80]">
              Dự đoán
            </p>
            <div className="flex justify-center mt-2">
              {dataRound?.percentCurrent.Round === "P" ? (
                <img src="/assets/casino/symbol_p.png" alt="prediction" />
              ) : (
                <img src="/assets/casino/symbol_b.png" alt="prediction" />
              )}
              {/*  */}
            </div>
            <h3 className="text-center font-bold text-[20px]">
              {dataRound?.percentCurrent.Round === "P" ? "PLAYER" : "BANKER"}
            </h3>
            <p className="text-center">
              {shuffle !== 0
                ? "Đang xào bài vui lòng chờ...."
                : countDown === 0
                ? "Chờ kết quả trong giây lát..."
                : `Vòng tiếp theo sẽ bắt đầu sau ${countDown}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
