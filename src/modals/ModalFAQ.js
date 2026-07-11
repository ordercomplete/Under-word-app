import React, { useState, useEffect } from "react";
import "../styles/ModalFAQ.css";

const ModalFAQ = ({ isOpen, onRequestClose, lang }) => {
  const [articlesData, setArticlesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleContent, setArticleContent] = useState(null);

  // Завантаження списку статей
  useEffect(() => {
    if (isOpen && !articlesData) {
      setLoading(true);
      fetch("/data/FAQ/faq-articles.json")
        .then((response) => response.json())
        .then((data) => setArticlesData(data))
        .catch((err) => console.error("Error loading FAQ articles:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, articlesData]);

  // Завантаження контенту статті
  useEffect(() => {
    if (selectedArticle && selectedArticle.file) {
      fetch(`/data/FAQ/${selectedArticle.file}`)
        .then((response) => response.text())
        .then((text) => setArticleContent(text))
        .catch((err) => {
          console.error("Error loading article:", err);
          setArticleContent("Помилка завантаження статті");
        });
    }
  }, [selectedArticle]);

  // Скидання стану при закритті
  useEffect(() => {
    if (!isOpen) {
      setSelectedArticle(null);
      setArticleContent(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Функція простого парсингу markdown в HTML
  const parseMarkdown = (markdown) => {
    if (!markdown) return "";

    let html = markdown;

    // Заголовки
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");

    // Горизонтальна лінія
    html = html.replace(/^---$/gim, "<hr>");

    // Жирний текст
    html = html.replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>");

    // Курсив
    html = html.replace(/\*(.*)\*/gim, "<em>$1</em>");

    // Списки
    html = html.replace(/^\* (.*$)/gim, "<li>$1</li>");
    html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");

    // Обгорнуття <ul>
    html = html.replace(/(<li>.*<\/li>)/gis, "<ul>$1</ul>");

    // Параграфи
    html = html
      .split("\n\n")
      .map((paragraph) => {
        if (paragraph.includes("<h") || paragraph.includes("<ul")) {
          return paragraph;
        }
        return `<p>${paragraph}</p>`;
      })
      .join("");

    return html;
  };

  const handleArticleClick = (article) => {
    if (article.file) {
      setSelectedArticle(article);
    }
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
    setArticleContent(null);
  };

  const renderArticleList = () => (
    <div>
      {articlesData.categories.map((category) => (
        <div key={category.id}>
          <h6 className="faq-category-header">{category.title}</h6>
          <ul className="faq-article-list">
            {category.articles.map((article) => (
              <li
                key={article.id}
                className={`faq-article-item ${article.file ? "has-file" : "no-file"}`}
                onClick={() => handleArticleClick(article)}
                style={{
                  cursor: article.file ? "pointer" : "not-allowed",
                  opacity: article.file ? 1 : 0.6,
                }}
              >
                {article.title}
                {!article.file && (
                  <span className="faq-coming-soon">Очікується</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderArticleContent = () => (
    <div>
      <button className="faq-back-btn" onClick={handleBackToList}>
        ← Назад до списку статей
      </button>
      <div
        className="faq-article-content"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(articleContent) }}
      />
    </div>
  );

  return (
    <>
      <div
        className="faq-modal-overlay"
        onClick={onRequestClose}
        style={{ cursor: "pointer" }}
      />

      <div
        className="modal in"
        tabIndex="-1"
        style={{ display: "block" }}
        onClick={onRequestClose}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-scrollable"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content faq-modal-content">
            <div className="faq-modal-header">
              <h5 className="faq-modal-title">
                {selectedArticle
                  ? selectedArticle.title
                  : "FAQ — Довідкові статті"}
              </h5>
              <button
                className="faq-modal-close-btn"
                onClick={onRequestClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="faq-modal-body">
              {loading || !articlesData ? (
                <p className="text-center py-4">Завантаження...</p>
              ) : selectedArticle ? (
                renderArticleContent()
              ) : (
                renderArticleList()
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalFAQ;
