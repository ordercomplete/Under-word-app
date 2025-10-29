import React from "react";
import SyncIcon from "../elements/SyncIcon";
import "../styles/PassageOptionsGroup.css";

const PassageOptionsGroup = ({ lang }) => {
  return (
    <div className="passage-options">
      <span className="option-item">УБТ</span>
      <span className="option-item">LXX Буття 1:20</span>
      <span className="option-item icon-search">{lang.search}</span>
      <span className="option-item icon-settings">{lang.settings}</span>
      <SyncIcon />
      <span className="option-item icon-add-window">+</span>
      <span className="option-item icon-close-window">x</span>
    </div>
  );
};

export default PassageOptionsGroup;
