// import React from "react";
// import Modal from "react-modal";
// import { Button } from "react-bootstrap";

// const ModalFeedback = ({ isOpen, onRequestClose, lang }) => {
//   return (
//     <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
//       <h2>{lang.feedback}</h2>
//       <p>Feedback form placeholder</p>
//       <Button onClick={onRequestClose}>{lang.close}</Button>
//     </Modal>
//   );
// };

// export default ModalFeedback;

import React, { useState } from "react";
import "../styles/ModalFeedback.css";

const ModalFeedback = ({ isOpen, onRequestClose, lang }) => {
  const [formData, setFormData] = useState({
    email: "",
    summary: "",
    type: "Bug",
    description: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Заглушка: в реальності — POST на сервер
    console.log("Feedback submitted:", formData);
    alert(lang.feedback_sent || "Дякуємо за зворотний зв'язок!");
    onRequestClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

      <div className="modal in" style={{ display: "block" }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content stepModalFgBg">
            {/* Header */}
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={onRequestClose}
                style={{
                  background: "var(--clrBackground)",
                  color: "var(--clrText)",
                  opacity: 0.9,
                }}
              >
                X
              </button>
              <h4 className="modal-title" id="raiseSupportLabel">
                {lang.feedback || "Зворотний зв'язок"}
              </h4>
            </div>

            {/* Body */}
            <div className="modal-body">
              <form role="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="feedbackEmail">
                    {lang.email || "Електронна пошта"}
                    <span className="mandatory"> *</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="feedbackEmail"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@email.com"
                    maxLength="200"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="feedbackSummary">
                    {lang.summary || "Резюме"}
                    <span className="mandatory"> *</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="feedbackSummary"
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder={lang.summary || "Резюме"}
                    maxLength="150"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="feedbackType">{lang.type || "Тип"}</label>
                  <select
                    className="form-control"
                    id="feedbackType"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="Bug">{lang.bug || "Помилка"}</option>
                    <option value="Improvement">
                      {lang.improvement || "Поліпшення"}
                    </option>
                    <option value="New Feature">
                      {lang.new_feature || "Нова функція"}
                    </option>
                    <option value="Error found">
                      {lang.error_found || "Знайдено помилку"}
                    </option>
                    <option value="Need help">
                      {lang.need_help || "Потрібна допомога"}
                    </option>
                    <option value="Like to volunteer">
                      {lang.volunteer || "Хочу бути добровольцем"}
                    </option>
                    <option value="Just saying Hi">
                      {lang.just_hi || "Просто скажіть 'Привіт'"}
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="feedbackDescription">
                    {lang.message || "Ваше повідомлення"}
                    <span className="mandatory"> *</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="feedbackDescription"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={lang.your_message || "Ваше повідомлення"}
                    rows="4"
                    required
                  ></textarea>
                </div>

                <p className="help-block">
                  {lang.screenshot_info ||
                    "Ми будемо включати скріншот як частину вашого запиту підтримки."}
                </p>
              </form>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn cancelFeedback stepButton"
                onClick={onRequestClose}
              >
                {lang.close || "Закрити"}
              </button>
              <button
                type="submit"
                className="btn sendFeedback stepButton stepPressedButton"
                onClick={handleSubmit}
              >
                {lang.send_feedback || "Зворотний зв'язок"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalFeedback;
