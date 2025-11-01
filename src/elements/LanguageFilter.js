import React from "react";

const LanguageFilter = ({ lang, languageFilter, onFilterChange }) => {
  const languageOptions = [
    { value: "_all", label: lang.all || "Всі" },
    { value: "en", label: lang.english || "англійська" },
    { value: "uk", label: lang.ukrainian || "Українська" },
    { value: "ru", label: lang.russian || "російська" },
    { value: "_ancient", label: lang.ancient || "Стародавня" },
  ];

  return (
    <>
      <span
        className="pull-left"
        style={{ fontSize: 13, marginTop: 9, fontWeight: "bold" }}
      >
        {lang.language || "Мова"}:&nbsp;
      </span>
      <div className="form-inline" style={{ marginTop: 8 }}>
        <div className="btn-group" data-toggle="buttons">
          {languageOptions.map((opt) => (
            <label
              key={opt.value}
              className={`btn btn-default btn-sm stepButton ${
                languageFilter === opt.value ? "stepPressedButton active" : ""
              }`}
            >
              <input
                type="radio"
                name="languageFilter"
                value={opt.value}
                checked={languageFilter === opt.value}
                onChange={() => onFilterChange(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
};

export default LanguageFilter;
