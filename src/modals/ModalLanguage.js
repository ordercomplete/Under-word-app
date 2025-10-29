// import React from "react";
// import Modal from "react-modal";
// import { Button } from "react-bootstrap";

// const ModalLanguage = ({ isOpen, onRequestClose, lang }) => {
//   return (
//     <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
//       <h2>{lang.language}</h2>
//       <p>Language selection: Ukrainian, English, Russian</p>
//       <Button onClick={onRequestClose}>{lang.close}</Button>
//     </Modal>
//   );
// };

// export default ModalLanguage;

// import React from "react";
// import "../styles/ModalLanguage.css"; // створимо нижче

// const ModalLanguage = ({ isOpen, onClose, lang, onSelectLanguage }) => {
//   if (!isOpen) return null;

//   const languages = [
//     { code: "ua", name: "Українська", flag: "UA" },
//     { code: "en", name: "English", flag: "US" },
//     { code: "ru", name: "Русский", flag: "RU" },
//   ];

//   return (
//     <>
//       {/* Backdrop */}
//       <div className="modal-backdrop fade in" onClick={onClose}></div>

//       <div className="modal in" style={{ display: "block" }} tabIndex="-1">
//         <div className="modal-dialog">
//           <div className="modal-content stepModalFgBg">
//             {/* Header */}
//             <div className="modal-header">
//               <button
//                 type="button"
//                 className="close"
//                 onClick={onClose}
//                 style={{
//                   background: "var(--clrBackground)",
//                   color: "var(--clrText)",
//                   opacity: 0.9,
//                 }}
//               >
//                 ×
//               </button>
//               <h4 className="modal-title">{lang.language || "Мова"}</h4>
//             </div>

//             {/* Body */}
//             <div className="modal-body">
//               <div className="form-group">
//                 <label>{lang.select_language || "Оберіть мову"}</label>
//                 <div className="language-list">
//                   {languages.map((item) => (
//                     <button
//                       key={item.code}
//                       className="btn btn-language d-flex align-items-center w-100 mb-2"
//                       onClick={() => {
//                         onSelectLanguage(item.code);
//                         onClose();
//                       }}
//                     >
//                       <span className="flag">{item.flag}</span>
//                       <span className="ms-3">{item.name}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn cancelFeedback stepButton"
//                 onClick={onClose}
//               >
//                 {lang.close || "Закрити"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ModalLanguage;

import React from "react";
import "../styles/ModalLanguage.css";

const ModalLanguage = ({ isOpen, onRequestClose, lang, onSelectLanguage }) => {
  if (!isOpen) return null;

  const languages = [
    { code: "ua", name: "Українська", flag: "UA" },
    { code: "en", name: "English", flag: "US" },
    { code: "ru", name: "Русский", flag: "RU" },
  ];

  return (
    <>
      <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

      <div className="modal in" style={{ display: "block" }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content stepModalFgBg">
            <div className="modal-header">
              {/* <button
                type="button"
                className="close"
                onClick={onRequestClose}
                style={{
                  background: "var(--clrBackground)",
                  color: "var(--clrText)",
                  opacity: 0.9,
                }}
              >
                ×
              </button> */}
              <h4 className="modal-title">{lang.language || "Мова"}</h4>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>
                  {lang.select_language || "Оберіть мову інтерфейсу"}
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
                      <span className="ms-3">{item.name}</span>
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
