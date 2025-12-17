// src/admin/FormatReports.js
import React, { useState, useEffect } from "react";
import { generateFormatReport, saveReportToStorage } from "../utils/testUtils";

const FormatReports = ({ lang }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    try {
      const savedReports = localStorage.getItem("formatReports");
      if (savedReports) {
        setReports(JSON.parse(savedReports));
      }
    } catch (error) {
      console.error("Помилка завантаження звітів:", error);
    }
  };

  const generateNewReport = async () => {
    setGenerating(true);
    try {
      const report = await generateFormatReport();
      saveReportToStorage(report);
      loadReports();
      alert("Звіт успішно згенеровано!");
    } catch (error) {
      alert(`Помилка генерації звіту: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const clearReports = () => {
    if (window.confirm("Видалити всі звіти?")) {
      localStorage.removeItem("formatReports");
      setReports([]);
    }
  };

  return (
    <div className="format-reports p-4">
      <h4>Звіти про формат JSON</h4>

      <div className="controls mb-4">
        <button
          className="btn btn-primary me-2"
          onClick={generateNewReport}
          disabled={generating}
        >
          {generating ? "Генерація..." : "Згенерувати новий звіт"}
        </button>
        <button className="btn btn-danger" onClick={clearReports}>
          Очистити звіти
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="alert alert-info">Немає збережених звітів</div>
      ) : (
        <div className="reports-list">
          {reports.map((report, index) => (
            <div key={report.id} className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">
                  Звіт #{reports.length - index} від{" "}
                  {new Date(report.timestamp).toLocaleString()}
                </h5>
              </div>
              <div className="card-body">
                <p>
                  <strong>Середовище:</strong> {report.environment}
                  <br />
                  <strong>URL:</strong> {report.baseUrl}
                  <br />
                  <strong>Файлів перевірено:</strong> {report.files.length}
                </p>

                <details>
                  <summary>Деталі по файлах</summary>
                  <div className="mt-3">
                    {report.files.map((file, i) => (
                      <div
                        key={i}
                        className="file-info mb-3 p-2 border rounded"
                      >
                        <strong>Файл:</strong> {file.file}
                        <br />
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <h6>Скорочений формат:</h6>
                            {file.compressed.success ? (
                              <>
                                Формат: {file.compressed.format}
                                <br />
                                Розмір: {file.compressed.size} байт
                                <br />
                                Ключі: {file.compressed.sampleKeys.join(", ")}
                              </>
                            ) : (
                              <span className="text-danger">
                                Помилка: {file.compressed.error}
                              </span>
                            )}
                          </div>

                          <div className="col-md-6">
                            <h6>Повний формат:</h6>
                            {file.full.success ? (
                              <>
                                Формат: {file.full.format}
                                <br />
                                Розмір: {file.full.size} байт
                                <br />
                                Ключі: {file.full.sampleKeys.join(", ")}
                              </>
                            ) : (
                              <span className="text-danger">
                                Помилка: {file.full.error}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormatReports;
