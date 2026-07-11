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

  // Функція для створення HTML таблиці
  const createTableHTML = (headers, rows) => {
    // Допоміжна функція для обробки markdown всередині комірок
    const processCell = (cell) => {
      return cell
        .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
        .replace(/\*(.*)\*/gim, "<em>$1</em>");
    };

    let table = '<table class="faq-table">\n';

    // Заголовок таблиці
    if (headers.length > 0) {
      table += "  <thead>\n    <tr>\n";
      table += headers
        .map((header) => `      <th>${processCell(header)}</th>`)
        .join("\n");
      table += "\n    </tr>\n  </thead>\n";
    }

    // Тіло таблиці
    if (rows.length > 0) {
      table += "  <tbody>\n";
      rows.forEach((row) => {
        table += "    <tr>\n";
        const cols = headers.length > 0 ? headers.length : row.length;
        for (let i = 0; i < cols && i < row.length; i++) {
          table += `      <td>${processCell(row[i] || "")}</td>\n`;
        }
        table += "    </tr>\n";
      });
      table += "  </tbody>\n";
    }

    table += "</table>";
    return table;
  };

  // Функція для парсингу markdown-таблиць
  const parseMarkdownTables = (markdown) => {
    if (!markdown) return "";

    const lines = markdown.split("\n");
    const processedLines = [];
    let inTable = false;
    let tableContent = [];
    let tableHeader = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Перевіряємо, чи це рядок таблиці
      if (trimmedLine.startsWith("|") && trimmedLine.endsWith("|")) {
        const cells = trimmedLine
          .split("|")
          .filter((cell) => cell.trim() !== "");

        // Перевіряємо, чи це роздільна лінія (наприклад, |---|---|)
        const isSeparator = cells.every((cell) => /^[-:]+$/.test(cell.trim()));

        if (isSeparator) {
          // Це роздільна лінія - таблиця розпочалась, перший рядок був заголовком
          inTable = true;
          continue;
        }

        if (!inTable) {
          // Це перший рядок таблиці (заголовок)
          tableHeader = cells.map((cell) => cell.trim());
          inTable = true;
          continue;
        }

        // Це рядок даних таблиці
        tableContent.push(cells.map((cell) => cell.trim()));
      } else {
        // Якщо ми були в межах таблиці і це не рядок таблиці
        if (inTable) {
          // Закінчуємо таблицю
          processedLines.push(createTableHTML(tableHeader, tableContent));
          tableContent = [];
          tableHeader = [];
          inTable = false;
        }
        processedLines.push(line);
      }
    }

    // Обробляємо таблицю, якщо вона була в кінці файлу або без наступного рядка
    if (inTable && (tableContent.length > 0 || tableHeader.length > 0)) {
      processedLines.push(createTableHTML(tableHeader, tableContent));
    }

    return processedLines.join("\n");
  };

  // Функція простого парсингу markdown в HTML
  const parseMarkdown = (markdown) => {
    if (!markdown) return "";

    let html = markdown;

    // Таблиці (повинні бути першими, перш ніж обробляти інші елементи)
    html = parseMarkdownTables(html);

    // Заголовки
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");

    // Горизонтальна лінія
    html = html.replace(/^---$/gim, "<hr>");

    // Посилання (додати перед обробкою жирного тексту)
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gim,
      '<a href="$2" class="faq-external-link" target="_blank" rel="noopener noreferrer">$1</a>',
    );

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
        if (
          paragraph.includes("<h") ||
          paragraph.includes("<ul") ||
          paragraph.includes("<table") ||
          paragraph.includes("<a")
        ) {
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
