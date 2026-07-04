import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const percentInRange = () => {
  // Random 12-30%
  const v = Math.floor(Math.random() * 19) + 12;
  return Math.min(30, Math.max(12, v));
};

const WintoolForward: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 430
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 430);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Avatar image of the current game (already stored by ProgressBar/TableGame)
  const titleImg =
    localStorage.getItem("title_img") || "/assets/NH/TABLE/avt_mb.png";

  // 3 ảnh theo thứ tự: bigwin, megawin, super-win
  const itemImgs = [
    "/assets/bigwin.gif",
    "/assets/megawin.gif", 
    "/assets/super-win.gif"
  ];

  // Generate three random percentages 12-30%, sorted DESC (top largest)
  const percents = useMemo(() => {
    const arr = [percentInRange(), percentInRange(), percentInRange()];
    return arr.sort((a, b) => b - a);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        paddingBottom: 40,
      }}
    >
      {/* Header with back button and logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 18,
          paddingBottom: 48,
          position: "relative",
        }}
      >
        {/* Back button (left of logo) */}
        <button
          aria-label="Back"
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            left: isMobile ? "20px" : "50%",
            transform: isMobile ? "none" : "translateX(-50%)",
            marginLeft: isMobile ? 0 : -540, // Cách logo gấp 3 lần cho PC
            width: isMobile ? 48 : 60,
            height: isMobile ? 48 : 60,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 10,
            top: isMobile ? "8px" : "auto",
          }}
          title="Back"
        >
          <img
            src="/assets/back.png"
            alt="Back"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </button>

        {/* Logo */}
        <img
          src="/assets/logo.png"
          alt="logo"
          style={{
            width: isMobile ? "68%" : "320px", // Logo to lên xíu (260px → 320px)
            height: "auto",
            filter: "drop-shadow(0 0 10px rgba(0,0,0,0.6))",
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/assets/logo-2.png";
          }}
        />
      </div>

      {/* Center avatar (game icon from table page) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 12,
          marginBottom: 68,
        }}
      >
        <img
          src={titleImg}
          alt="Game Avatar"
          style={{
            width: 180,
            height: 180,
            objectFit: "cover",
            borderRadius: "50%",
            border: "4px solid rgba(0,174,239,0.25)",
            boxShadow: "0 0 18px rgba(0,174,239,0.25)",
            background: "rgba(0,0,0,0.2)",
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/assets/NH/TABLE/avt_mb.png";
          }}
        />
      </div>

      {/* Three items with image + percent (largest to smallest) */}
      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
          padding: "6px 10px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 48,
        }}
      >
        {percents.map((p, i) => {
          const img = itemImgs[i];
          return (
            <div
              key={i}
              style={{
                width: "100%",
                position: "relative",
              }}
            >
              {/* Ảnh chiếm hết width */}
              <img
                src={img}
                alt={`Item ${i + 1}`}
                style={{ 
                  width: "100%", 
                  height: 116, 
                  objectFit: "cover",
                  margin:"10px 0",
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/assets/nohu.gif";
                }}
              />

              {/* Số % đè lên nửa bên phải */}
              <div
                style={{
                  position: "absolute",
                  right: 35,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: 26,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  paddingRight: "20px",
                }}
              >
                {p}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WintoolForward;