import React, { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 430;

const VideoBackground: React.FC = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const src = isMobile ? "/assets/mb.mp4" : "/assets/pc.mp4";

  return (
    <video
      key={src}
      autoPlay
      loop
      muted
      playsInline
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

export default VideoBackground;
