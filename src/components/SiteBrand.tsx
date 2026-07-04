import React from "react";

const SiteBrand: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`inline-flex items-center justify-center px-4 py-2 rounded-full border border-cyan-400/60 bg-black/50 shadow-[0_0_16px_rgba(0,242,255,0.35)] ${className}`}
  >
    <span className="text-cyan-300 font-extrabold tracking-[0.18em] text-base sm:text-xl uppercase whitespace-nowrap">
      MAO MAY MẮN
    </span>
  </div>
);

export default SiteBrand;
