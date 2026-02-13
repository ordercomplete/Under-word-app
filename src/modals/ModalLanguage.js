import React from "react";
import "../styles/ModalLanguage.css";

const ModalLanguage = ({ isOpen, onRequestClose, lang, onSelectLanguage }) => {
  if (!isOpen) return null;

  const languages = [
    { code: "uk", name: "Українська", flag: "UA" },
    { code: "en", name: "English", flag: "US" },
    { code: "ru", name: "Русский", flag: "RU" },
  ];

  // return (
  //   <>
  //     <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

  //     <div className="modal in" style={{ display: "block" }} tabIndex="-1">
  //       <div className="modal-dialog">
  //         <div className="modal-content stepModalFgBg">
  //           <div className="modal-header">
  //             <h4 className="modal-title">{lang.language || "Мова"}</h4>
  //           </div>

  //           <div className="modal-body">
  //             <div className="form-group">
  //               <label>
  //                 {lang.select_language || "Оберіть мову інтерфейсу"}
  //               </label>
  //               <div className="language-list mt-3">
  //                 {languages.map((item) => (
  //                   <button
  //                     key={item.code}
  //                     className="btn btn-language d-flex align-items-center w-100 mb-2"
  //                     onClick={() => {
  //                       onSelectLanguage(item.code);
  //                       onRequestClose();
  //                     }}
  //                   >
  //                     <span className="flag">{item.flag}</span>
  //                     <span className="ms-3">{item.name}</span>
  //                   </button>
  //                 ))}
  //               </div>
  //             </div>
  //           </div>

  //           <div className="modal-footer">
  //             <button
  //               type="button"
  //               className="btn cancelFeedback stepButton"
  //               onClick={onRequestClose}
  //             >
  //               {lang.close || "Закрити"}
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
  // src/modals/ModalLanguage.js - фрагмент для динамічних текстів (замінити існуючий return)
  return (
    <>
      <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

      <div className="modal in" style={{ display: "block" }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content stepModalFgBg">
            <div className="modal-header">
              <h4 className="modal-title">{lang.language || "Мова"}</h4>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>
                  {lang.select_interface_language || "Оберіть мову інтерфейсу"}
                </label>
                <div className="language-list mt-3">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      className="btn btn-language d-flex align-items-center w-100 mb-2"
                      onClick={() => {
                        onSelectLanguage(item.code);
                        onRequestClose();
                      }}
                    >
                      <span className="flag">{item.flag}</span>
                      <span className="ms-3">
                        {lang[`language_${item.code}`] || item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn cancelFeedback stepButton"
                onClick={onRequestClose}
              >
                {lang.close || "Закрити"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalLanguage;
