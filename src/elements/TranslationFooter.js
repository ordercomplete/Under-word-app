import React from "react";

const TranslationFooter = ({
  lang,
  filteredCount,
  totalCount,
  searchQuery,
  onSearchChange,
  onApply,
}) => {
  const featuresMap = {
    N: lang.notes || "Примітки",
    G: lang.grammar || "Граматика",
    V: lang.vocab || "Словник",
    I: lang.interlinear || "Міжрядковий",
    S: lang.septuagint || "Септуагінта",
    R: lang.red_letter || "Червоні слова",
  };

  return (
    <div className="modal-footer">
      <p style={{ margin: 0, fontSize: 12 }}>
        {lang.features || "Фічі"}: N={featuresMap.N} G={featuresMap.G} V=
        {featuresMap.V} I={featuresMap.I} S={featuresMap.S}
      </p>
      <span className="tagLine">
        {lang.showing || "Показ"} {filteredCount} {lang.of || "із"} {totalCount}
      </span>
      <input
        type="text"
        placeholder={lang.search || "Пошук"}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ fontSize: 14, height: 30, width: 150, marginLeft: 10 }}
      />
      <button className="btn btn-default btn-sm stepButton" onClick={onApply}>
        {lang.ok || "Гаразд"}
      </button>
    </div>
  );
};

export default TranslationFooter;
