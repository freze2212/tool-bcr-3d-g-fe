import React from "react";
import "./CyberModal.css";

interface CyberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const CyberModal: React.FC<CyberModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className={`cyber-modal-backdrop active`} onClick={onClose}>
      <div
        className="cyber-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cyber-modal-border-outer" />
        <div className="cyber-modal-border-inner" />
        <div className="cyber-modal-bracket cyber-modal-bracket--tl" />
        <div className="cyber-modal-bracket cyber-modal-bracket--br" />

        <button
          type="button"
          className="cyber-modal-close"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>

        <div className="cyber-modal-header">
          <h2 className="cyber-modal-title">
            <span className="cyber-modal-title-underscore">_</span>
            <span className="cyber-modal-title-text">{title}</span>
            <span className="cyber-modal-title-underscore">_</span>
          </h2>
          {subtitle && <p className="cyber-modal-subtitle">{subtitle}</p>}
        </div>

        <div className="cyber-modal-body">{children}</div>
      </div>
    </div>
  );
};

interface CyberInputFieldProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const CyberInputField: React.FC<CyberInputFieldProps> = ({
  icon,
  children,
}) => (
  <div className="cyber-input-group">
    <div className="cyber-input-wrap">
      <span className="cyber-input-icon">{icon}</span>
      {children}
    </div>
  </div>
);

interface CyberSubmitButtonProps {
  label: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

export const CyberSubmitButton: React.FC<CyberSubmitButtonProps> = ({
  label,
  type = "submit",
  onClick,
}) => (
  <button type={type} className="cyber-submit-btn" onClick={onClick}>
    {`>${label}<`}
  </button>
);

interface CyberModalFooterProps {
  text: string;
  linkText: string;
  onLinkClick: () => void;
}

export const CyberModalFooter: React.FC<CyberModalFooterProps> = ({
  text,
  linkText,
  onLinkClick,
}) => (
  <p className="cyber-modal-footer">
    {text}{" "}
    <span className="cyber-modal-footer-link" onClick={onLinkClick}>
      {linkText}
    </span>
  </p>
);

export default CyberModal;
