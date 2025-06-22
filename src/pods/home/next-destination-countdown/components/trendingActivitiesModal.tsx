"use client";

import React from "react";

interface Props {
  isOpen: boolean;
  toggle: () => void;
  activities: string;
}

export const TrendingModal = ({ isOpen, toggle, activities }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={toggle}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Actividades populares</h2>
          <button className="close-button" onClick={toggle}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <pre style={{ whiteSpace: "pre-wrap" }}>{activities}</pre>
        </div>
      </div>
    </div>
  );
};

// CSS styles for the modal
const styles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.modal-body {
  margin-top: 10px;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
`;

// Inject styles into the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
