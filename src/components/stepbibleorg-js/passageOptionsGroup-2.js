import React, { useState, useEffect } from "react";
import "./PassageOptionsGroup.css"; // Імпорт стилів

const PassageOptionsGroup = () => {
  const [currentReference, setCurrentReference] = useState("Gen.1");
  const [versions, setVersions] = useState(["THOT", "LXX", "UkrOgienko"]);

  // Оновлення URL для соціальних мереж (динамічне)
  const shareUrl = `http://www.stepbible.org/?q=version=THOT@version=UkrOgienko@version=LXX@reference=${currentReference}&options=UVNGH&display=INTERLEAVED`;
  const shareText = encodeURIComponent(
    "Буття 1 | THOT | STEP | בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ"
  );
  const currentTime = new Date().getTime();

  // Обробники подій (заміна step.util)
  const handleSelectVersions = () => {
    // Логіка вибору перекладів
    console.log("Select Bible translations");
  };

  const handleSelectPassage = () => {
    // Логіка вибору нового уривка
    console.log("Select a new passage");
  };

  const handleSearchBible = () => {
    // Логіка пошуку
    console.log("Search the Bible");
  };

  return (
    <div className="passageOptionsGroup">
      <div className="pull-right">
        <span className="nextPreviousChapterGroup" style={{ display: "block" }}>
          <a
            className="previousChapter"
            href={`/?q=version=THOT@reference=${
              currentReference === "Gen.1" ? "Gen" : "Gen.1"
            }`}
            title="Відображає попередній розділ"
            style={{ display: "inline" }}
          >
            <i className="glyphicon glyphicon-arrow-left"></i>
          </a>
          <a
            className="nextChapter"
            href={`/?q=version=THOT@reference=${
              currentReference === "Gen.1" ? "Gen.2" : "Gen.1"
            }`}
            title="Відображає наступний розділ"
            style={{ display: "inline" }}
          >
            <i className="glyphicon glyphicon-arrow-right"></i>
          </a>
        </span>
        <span id="thumbsup" className="dropdown hidden-xs">
          <a
            className="dropdown-share"
            data-toggle="dropdown"
            title="Facebook, Tweet, X..."
          >
            <i className="glyphicon glyphicon-thumbs-up"></i>
          </a>
          <div className="dropdown-menu pull-right" role="menu">
            <ul>
              <li>
                <iframe
                  id="twitter-widget-1"
                  scrolling="no"
                  frameBorder="0"
                  allowTransparency="true"
                  allowFullScreen="true"
                  className="twitter-share-button twitter-share-button-rendered twitter-tweet-button"
                  title="X Post Button"
                  src={`https://platform.twitter.com/widgets/tweet_button.html?dnt=false&id=twitter-widget-1&lang=en&original_referer=https%3A%2F%2Fwww.stepbible.org%2F&size=m&text=${shareText}&time=${currentTime}&type=share&url=${encodeURIComponent(
                    shareUrl
                  )}&via=Tyndale_House`}
                  style={{
                    position: "static",
                    visibility: "visible",
                    width: "65px",
                    height: "20px",
                  }}
                  data-url={shareUrl}
                ></iframe>
              </li>
              <li>
                <fb:share-button
                  type="button_count"
                  href={shareUrl}
                  className="fb_iframe_widget"
                  fb-xfbml-state="rendered"
                  fb-iframe-plugin-query={`app_id=&container_width=0&href=${encodeURIComponent(
                    shareUrl
                  )}&locale=en_GB&sdk=joey&type=button_count`}
                >
                  <span
                    style={{
                      verticalAlign: "bottom",
                      width: "77px",
                      height: "20px",
                    }}
                  >
                    <iframe
                      name="fc959d15c1e105ee2"
                      width="1000px"
                      height="1000px"
                      data-testid="fb:share_button Facebook Social Plugin"
                      title="fb:share_button Facebook Social Plugin"
                      frameBorder="0"
                      allowTransparency="true"
                      allowFullScreen="true"
                      scrolling="no"
                      allow="encrypted-media"
                      src={`https://www.facebook.com/plugins/share_button.php?app_id=&channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46&container_width=0&href=${encodeURIComponent(
                        shareUrl
                      )}&locale=en_GB&sdk=joey&type=button_count`}
                      style={{
                        border: "none",
                        visibility: "visible",
                        width: "77px",
                        height: "20px",
                      }}
                      className=""
                    ></iframe>
                  </span>
                </fb:share-button>
              </li>
            </ul>
          </div>
        </span>
        <span className="hidden-xs">
          <a
            id="resizeButton"
            className="resizePanel"
            title="Increase size of panel"
            style={{ display: "inline" }}
          >
            <i
              className="glyphicon glyphicon-resize-full"
              style={{ display: "inline" }}
            ></i>
            <i
              className="glyphicon glyphicon-resize-small"
              style={{ display: "none" }}
            ></i>
          </a>
        </span>
        <span
          className="dropdown settingsDropdown"
          style={{ backgroundColor: "var(--clrBackground)" }}
        >
          <a
            className="dropdown-toggle showSettings"
            data-toggle="dropdown"
            title="Параметри"
          >
            <i className="glyphicon glyphicon-cog"></i>
          </a>
          <div
            className="dropdown-menu pull-right stepModalFgBg"
            role="menu"
            dir=""
          >
            <div>
              <h2>Переглядати разом, як</h2>
              <ul className="displayModes">
                <li role="presentation">
                  <a
                    href="javascript:void(0)"
                    data-value="INTERLEAVED"
                    title="Представляє обраного Біблій &amp; коментарями по одному рядку."
                  >
                    <span>Накладений вигляд</span>
                    <span
                      className="glyphicon glyphicon-ok pull-right active"
                      style={{
                        color: "var(--clrText)",
                        background: "var(--clrBackground)",
                      }}
                    ></span>
                  </a>
                </li>
                <li role="presentation" style={{ display: "none" }}>
                  <a
                    href="javascript:void(0)"
                    data-value="INTERLEAVED_COMPARE"
                    title="Цей параметр представляє вибраного Біблій і коментарями у поданні рядок за рядком і підкреслює текстової відмінності. Примітка: Слова в цьому поданні будуть заблоковані."
                  >
                    <span>Накладений вигляд з порівнянням</span>
                    <span
                      className="glyphicon glyphicon-ok pull-right"
                      style={{
                        color: "var(--clrText)",
                        background: "var(--clrBackground)",
                      }}
                    ></span>
                  </a>
                </li>
                <li role="presentation" style={{ display: "none" }}>
                  <a
                    href="javascript:void(0)"
                    data-value="INTERLINEAR"
                    title="Посилання слова з різними версіями і представляє вибраного тексту слово за словом."
                  >
                    <span>Міжрядковий уривок</span>
                    <span
                      className="glyphicon glyphicon-ok pull-right"
                      style={{
                        color: "var(--clrText)",
                        background: "var(--clrBackground)",
                      }}
                    ></span>
                  </a>
                </li>
                <li role="presentation">
                  <a
                    href="javascript:void(0)"
                    data-value="COLUMN"
                    title="Представляє обраного Біблій &amp; коментарями в таблиці, де кожен рядок представляє вірші і кожного стовпця представляє Біблії чи коментарі."
                  >
                    <span>Перегляд стовпцем</span>
                    <span
                      className="glyphicon glyphicon-ok pull-right"
                      style={{
                        color: "var(--clrText)",
                        background: "var(--clrBackground)",
                      }}
                    ></span>
                  </a>
                </li>
                <li role="presentation" style={{ display: "none" }}>
                  <a
                    href="javascript:void(0)"
                    data-value="COLUMN_COMPARE"
                    title="Цей параметр представляє вибраного Біблій і коментарями до таблиці і підкреслює текстової відмінності. Кожний рядок представляє вірші і кожного стовпця представляє Біблії чи коментарі. У цьому поданні застосовується лише до Біблії і коментарями однією мовою. Примітка: Слова в цьому поданні будуть заблоковані."
                  >
                    <span>Перегляд стовпцем з порівнянням</span>
                    <span
                      className="glyphicon glyphicon-ok pull-right"
                      style={{
                        color: "var(--clrText)",
                        background: "var(--clrBackground)",
                      }}
                    ></span>
                  </a>
                </li>
              </ul>
            </div>
            <span
              className="displayOptionsContainer panel-group"
              id="displayOptions-0"
            >
              <h2>Параметри відображення</h2>
              <ul className="passageOptions" role="presentation">
                <li className="passage" style={{ display: "none" }}>
                  <a
                    href="javascript:void(0)"
                    data-value="H"
                    data-selected="true"
                  >
                    <span>Заголовки</span>
                    <span
                      className="glyphicon glyphicon-ok pull-right"
                      style={{
                        color: "var(--clrText)",
                        background: "var(--clrBackground)",
                        visibility: "visible",
                      }}
                    ></span>
                  </a>
                </li>
                <li className="passage" style={{ display: "none" }}>
                  <a
                    href="javascript:void(0)"
                    data-value="V"
                    data-selected="true"
                  >
                    <span>Нумерація віршів</span>
                    <span
                      className="glyphicon glyphicon-ok pull-right"
                      style={{
                        color: "var(--clrText)",
                        background: "var(--clrBackground)",
                        visibility: "visible",
                      }}
                    ></span>
                  </a>
                </li>
                <li className="passage">
                  <a
                    href="javascript:void(0)"
                    data-value="X"
                    title="Verse reference displayed for each version"
                    data-selected="false"
                  >
                    <span>Version Reference</span>
                    <span
                      className="glyphicon glyphicon-ok pull-right"
                      style={{
                        color: "var(--clrText)",
                        background: "var(--clrBackground)",
                        visibility: "hidden",
                      }}
                    ></span>
                  </a>
                </li>
                <li className="passage">
                  <a
                    href="javascript:void(0)"
                    data-value="L"
                    data-selected="false"
                  >
                    <span>Вірші в окремих рядках</span>
                    <span
                      className="glyphicon glyphicon-ok pull-right"
                      style={{
                        color: "var(--clrText)",
                        background: "var(--clrBackground)",
                        visibility: "hidden",
                      }}
                    ></span>
                  </a>
                </li>
                <li className="passage" style={{ display: "none" }}>
                  <a
                    href="javascript:void(0)"
                    data-value="R"
                    data-selected="false"
                  >
                    <span>Слова Ісуса червоним кольором</span>
                    <span
                      className="glyphicon glyphicon-ok pull-right"
                      style={{
                        color: "var(--clrText)",
                        background: "var(--clrBackground)",
                        visibility: "hidden",
                      }}
                    ></span>
                  </a>
                </li>
                <li className="passage" style={{ display: "none" }}></li>
                <div className="panel panel-default stepModalFgBg">
                  <a
                    data-toggle="collapse"
                    className="menuGroup"
                    data-parent="#displayOptions-0"
                    data-target="#displayOptions-display_vocab_options0"
                    style={{ fontWeight: "bold", display: "none" }}
                  >
                    Варіанти синонімів<span className="caret"></span>
                  </a>
                  <div
                    className="panel-collapse collapse"
                    id="displayOptions-display_vocab_options0"
                  >
                    <div className="panel-body" role="presentation">
                      <li className="passage" style={{ display: "none" }}>
                        <a
                          href="javascript:void(0)"
                          data-value="E"
                          data-selected="false"
                        >
                          <span>Слова англійською мовою</span>
                          <span
                            className="glyphicon glyphicon-ok pull-right"
                            style={{
                              color: "var(--clrText)",
                              background: "var(--clrBackground)",
                              visibility: "hidden",
                            }}
                          ></span>
                        </a>
                      </li>
                      <li className="passage" style={{ display: "none" }}>
                        <a
                          href="javascript:void(0)"
                          data-value="A"
                          data-selected="false"
                        >
                          <span>Слова грецькою / єврейською мовами</span>
                          <span
                            className="glyphicon glyphicon-ok pull-right"
                            style={{
                              color: "var(--clrText)",
                              background: "var(--clrBackground)",
                              visibility: "hidden",
                            }}
                          ></span>
                        </a>
                      </li>
                      <li className="passage" style={{ display: "none" }}></li>
                      <li className="passage" style={{ display: "none" }}></li>
                      <li className="passage" style={{ display: "none" }}>
                        <a
                          href="javascript:void(0)"
                          data-value="T"
                          data-selected="false"
                        >
                          <span>Транслітерація</span>
                          <span
                            className="glyphicon glyphicon-ok pull-right"
                            style={{
                              color: "var(--clrText)",
                              background: "var(--clrBackground)",
                              visibility: "hidden",
                            }}
                          ></span>
                        </a>
                      </li>
                      <li className="passage" style={{ display: "none" }}>
                        <a
                          href="javascript:void(0)"
                          data-value="M"
                          data-selected="false"
                        >
                          <span>Граматика</span>
                          <span
                            className="glyphicon glyphicon-ok pull-right"
                            style={{
                              color: "var(--clrText)",
                              background: "var(--clrBackground)",
                              visibility: "hidden",
                            }}
                          ></span>
                        </a>
                      </li>
                    </div>
                  </div>
                </div>
                <li className="passage" style={{ display: "none" }}></li>
                <div className="panel panel-default stepModalFgBg">
                  <a
                    data-toggle="collapse"
                    className="menuGroup"
                    data-parent="#displayOptions-0"
                    data-target="#displayOptions-original_language_options0"
                    style={{ fontWeight: "bold" }}
                  >
                    Параметри мови оригіналу<span className="caret"></span>
                  </a>
                  <div
                    className="panel-collapse collapse"
                    id="displayOptions-original_language_options0"
                  >
                    <div className="panel-body" role="presentation">
                      <li className="passage">
                        <a
                          href="javascript:void(0)"
                          data-value="O"
                          data-selected="false"
                        >
                          <span>Перетворювати текст вихідного</span>
                          <span
                            className="glyphicon glyphicon-ok pull-right"
                            style={{
                              color: "var(--clrText)",
                              background: "var(--clrBackground)",
                              visibility: "hidden",
                            }}
                          ></span>
                        </a>
                      </li>
                      <li className="passage" style={{ display: "none" }}>
                        <a
                          href="javascript:void(0)"
                          data-value="D"
                          title="Використовуються 2 кольори, щоб допомогти відокремити різні частини єврейського слова."
                          data-selected="false"
                        >
                          <span>Кольоровий код для єврейської</span>
                          <span
                            className="glyphicon glyphicon-ok pull-right"
                            style={{
                              color: "var(--clrText)",
                              background: "var(--clrBackground)",
                              visibility: "hidden",
                            }}
                          ></span>
                        </a>
                      </li>
                      <li className="passage">
                        <a
                          href="javascript:void(0)"
                          data-value="G"
                          title="Відображає усі грецькі акценти у тексті"
                          data-selected="true"
                        >
                          <span>Грецькі акценти</span>
                          <span
                            className="glyphicon glyphicon-ok pull-right"
                            style={{
                              color: "var(--clrText)",
                              background: "var(--clrBackground)",
                              visibility: "visible",
                            }}
                          ></span>
                        </a>
                      </li>
                      <li className="passage">
                        <a
                          href="javascript:void(0)"
                          data-value="U"
                          title="Відображає усі єврейські голосні у тексті"
                          data-selected="true"
                        >
                          <span>Єврейські голосні</span>
                          <span
                            className="glyphicon glyphicon-ok pull-right"
                            style={{
                              color: "var(--clrText)",
                              background: "var(--clrBackground)",
                              visibility: "visible",
                            }}
                          ></span>
                        </a>
                      </li>
                      <li className="passage">
                        <a
                          href="javascript:void(0)"
                          data-value="P"
                          title="Також відображає акценти у тексті"
                          data-selected="false"
                        >
                          <span>…також відображати єврейські голосні</span>
                          <span
                            className="glyphicon glyphicon-ok pull-right"
                            style={{
                              color: "var(--clrText)",
                              background: "var(--clrBackground)",
                              visibility: "hidden",
                            }}
                          ></span>
                        </a>
                      </li>
                    </div>
                  </div>
                </div>
                <li className="passage">
                  <a
                    href="javascript:void(0)"
                    data-value="N"
                    data-selected="true"
                  >
                    <span>Примітки і паралельні місця</span>
                    <span
                      className="glyphicon glyphicon-ok pull-right"
                      style={{
                        color: "var(--clrText)",
                        background: "var(--clrBackground)",
                        visibility: "visible",
                      }}
                    ></span>
                  </a>
                </li>
                <li
                  className="noHighlight contextContainer"
                  style={{ display: "none" }}
                >
                  <span className="contextLabel" dir="ltr">
                    0 verse(s) обидві сторони
                  </span>
                </li>
              </ul>
            </span>
            <h2>Загальні параметри</h2>
            <ul>
              <li>
                <a href="javascript:void(0)" data-selected="true">
                  <span>Швидкий Лексикон</span>
                  <span
                    className="glyphicon glyphicon-ok pull-right"
                    style={{ visibility: "visible" }}
                  ></span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" data-selected="true">
                  <span>Словникового запасу вірш</span>
                  <span
                    className="glyphicon glyphicon-ok pull-right"
                    style={{ visibility: "visible" }}
                  ></span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" data-selected="true">
                  <span>Similar word</span>
                  <span
                    className="glyphicon glyphicon-ok pull-right"
                    style={{ visibility: "visible" }}
                  ></span>
                </a>
              </li>
              <li
                className="noHighlight contextContainer"
                style={{ display: "none" }}
              >
                <span className="contextLabel" dir="ltr">
                  0 verse(s) обидві сторони
                </span>
                <span className="btn-group pull-right">
                  <button className="btn btn-default btn-xs">
                    <span
                      className="glyphicon glyphicon-minus"
                      title="Менше контексту"
                    ></span>
                  </button>
                  <button className="btn btn-default btn-xs">
                    <span
                      className="glyphicon glyphicon-plus"
                      title="Більше контексту"
                    ></span>
                  </button>
                </span>
              </li>
              <li>
                Розмір шрифту
                <span className="pull-right btn-group">
                  <button
                    className="btn btn-default btn-sm largerFontSize"
                    type="button"
                    title="Font"
                  >
                    <span className="largerFont">A</span>
                  </button>
                </span>
              </li>
            </ul>
          </div>
        </span>
        <a className="openNewPanel hidden-xs" title="New panel">
          <i className="glyphicon glyphicon-plus"></i>
        </a>
        <a className="closeColumn disabled hidden-xs" title="Закрити">
          <i className="glyphicon glyphicon-remove"></i>
        </a>
      </div>
      <div
        className="resultsLabel pull-right"
        style={{ marginRight: "5px" }}
      ></div>
      <span className="argSummary argSumSpan">
        <button
          type="button"
          onClick={handleSelectVersions}
          title="Select Bible translations"
          className="select-version stepButtonTriangle"
        >
          {versions.join(", ")}
        </button>
        <span className="separator-version">&nbsp;</span>
        <button
          type="button"
          onClick={handleSelectPassage}
          title="Select a new passage"
          className="select-reference stepButtonTriangle"
        >
          Буття {currentReference.split(".")[1]}
        </button>
        <span className="separator-reference">&nbsp;</span>
        <button
          type="button"
          onClick={handleSearchBible}
          title="Search the Bible"
          className="select-search stepButtonTriangle"
        >
          <i
            style={{ fontSize: "10px" }}
            className="find glyphicon glyphicon-search"
          ></i>
          &nbsp;
        </button>
      </span>
    </div>
  );
};

export default PassageOptionsGroup;
