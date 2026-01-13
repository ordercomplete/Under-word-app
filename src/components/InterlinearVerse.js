// src/components/InterlinearVerse.js - ОНОВЛЕНА ВЕРСІЯ 12.01.2026
import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import "../styles/Interlinear.css";
import { jsonAdapter, getValue } from "../utils/jsonAdapter";

const InterlinearVerse = ({
  verseNum,
  pairs,
  chapterData,
  onWordClick,
  isFirstInChapter = false,
}) => {
  // console.log(`[InterlinearVerse ${verseNum}] Пари:`, pairs);

  const [hoveredWord, setHoveredWord] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState(0);
  const [isAboveCursor, setIsAboveCursor] = useState(false);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);
  const verseBlockRef = useRef(null);

  // ==================== БАЗОВІ ФУНКЦІЇ ====================

  const getWordText = useCallback((word) => {
    if (!word) return null;
    return getValue(word, "word") || getValue(word, "w") || null;
  }, []);

  const getStrongCode = useCallback((word, version = null) => {
    if (!word) return null;

    let strong = getValue(word, "strong") || getValue(word, "s") || null;

    // Корекція для THOT: якщо код починається з G, змінити на H
    if (version === "THOT" && strong && strong.startsWith("G")) {
      strong = "H" + strong.substring(1);
    }

    return strong;
  }, []);

  const getLemma = useCallback((word) => {
    if (!word) return null;
    return getValue(word, "lemma") || getValue(word, "l") || null;
  }, []);

  const getMorph = useCallback((word) => {
    if (!word) return null;
    return getValue(word, "morph") || getValue(word, "m") || null;
  }, []);

  const getWordsFromVerse = useCallback((verseData) => {
    if (!verseData) return [];
    return getValue(verseData, "words") || getValue(verseData, "ws") || [];
  }, []);

  // ==================== ОНОВЛЕНА ФУНКЦІЯ СПІВСТАВЛЕННЯ ====================

  const alignWordsAdvanced = useCallback(
    (originalVerse, translationVerse, originalVersion, translationCode) => {
      console.log(`🔍 Вирівнювання: ${originalVersion} → ${translationCode}`);

      const aligned = [];
      const origWords = getWordsFromVerse(originalVerse);
      const transWords = getWordsFromVerse(translationVerse);

      // Створюємо мапу перекладів для швидкого пошуку за Strong кодом
      const translationMap = new Map();

      // Групуємо переклади за Strong кодом
      transWords.forEach((transWord, index) => {
        const strong = getStrongCode(transWord, translationCode);
        if (strong) {
          if (!translationMap.has(strong)) {
            translationMap.set(strong, []);
          }
          translationMap.get(strong).push({ word: transWord, index });
        }
      });

      origWords.forEach((origWord, origIndex) => {
        const origStrong = getStrongCode(origWord, originalVersion);
        const origMorph = getMorph(origWord);

        let matchedWord = null;
        let matchedIndex = -1;

        if (origStrong && translationMap.has(origStrong)) {
          // Знайшли слова з таким самим Strong кодом
          const candidates = translationMap.get(origStrong);

          // Спробуємо знайти за морфологією
          for (const candidate of candidates) {
            if (!origMorph || getMorph(candidate.word) === origMorph) {
              matchedWord = candidate.word;
              matchedIndex = candidate.index;
              break;
            }
          }

          // Якщо не знайшли за морфологією, беремо перше
          if (!matchedWord && candidates.length > 0) {
            matchedWord = candidates[0].word;
            matchedIndex = candidates[0].index;
          }

          // Видаляємо використаного кандидата з мапи
          if (matchedIndex !== -1) {
            const updatedCandidates = candidates.filter(
              (c) => c.index !== matchedIndex
            );
            if (updatedCandidates.length > 0) {
              translationMap.set(origStrong, updatedCandidates);
            } else {
              translationMap.delete(origStrong);
            }
          }
        }

        if (matchedWord) {
          // console.log(`✅ Співставлено за Strong: ${origStrong}`, {
          //   оригінал: getWordText(origWord),
          //   переклад: getWordText(matchedWord),
          // });

          aligned.push({
            original: origWord,
            translation: matchedWord,
            alignedBy: "strong",
          });
        } else {
          // Якщо не знайдено за Strong - показуємо тире
          // console.log(`❌ Немає відповідника за Strong: ${origStrong}`);
          aligned.push({
            original: origWord,
            translation: null,
            alignedBy: "none",
          });
        }
      });

      return aligned;
    },
    [getWordText, getStrongCode, getMorph, getWordsFromVerse]
  );
  // ==================== ОТРИМАННЯ ДАНИХ ====================

  // Адаптація даних
  const adaptedData = useMemo(() => {
    const result = {};
    if (!chapterData) return result;

    Object.keys(chapterData).forEach((key) => {
      const data = chapterData[key];
      const adapted = jsonAdapter(data);

      if (Array.isArray(adapted)) {
        result[key] = adapted.filter(
          (item) => item && typeof item === "object"
        );
      } else {
        result[key] = [];
      }
    });

    return result;
  }, [chapterData]);

  const getVerseData = useCallback(
    (version, verseNumber) => {
      if (!adaptedData[version]) return null;
      const verse = adaptedData[version].find((v) => {
        const vNum = v.verse || v.v;
        return parseInt(vNum) === parseInt(verseNumber);
      });
      return verse;
    },
    [adaptedData]
  );

  // ==================== СТВОРЕННЯ БЛОКІВ СЛІВ ====================

  const createVerseBlocks = useMemo(() => {
    if (!pairs || pairs.length === 0 || !chapterData) {
      console.log(`📭 Немає пар або даних для вірша ${verseNum}`);
      return [];
    }

    console.log(`🔧 Створення блоків для вірша ${verseNum}`, {
      пар: pairs.length,
      дані: Object.keys(chapterData),
    });

    const wordBlocks = [];
    const processedTranslations = new Set();

    // Обробляємо кожну пару
    pairs.forEach((pair, pairIndex) => {
      console.log(`🔄 Обробка пари ${pairIndex}:`, {
        оригінал: pair.original,
        переклади: pair.translations,
        заповіт: pair.testament,
      });

      if (!pair.original) {
        console.log(`⚠️ Пара ${pairIndex} не має оригіналу`);
        return;
      }

      const origVerse = getVerseData(pair.original, verseNum);
      if (!origVerse) {
        console.log(
          `❌ Оригінал ${pair.original} не знайдено для вірша ${verseNum}`
        );
        return;
      }

      // Обробляємо оригінал
      const origWords = getWordsFromVerse(origVerse);

      // Створюємо початкові блоки з оригіналу
      origWords.forEach((origWord, wordIndex) => {
        const blockId = `${verseNum}-${wordIndex}`;

        if (!wordBlocks[wordIndex]) {
          wordBlocks[wordIndex] = {
            id: blockId,
            strong: getStrongCode(origWord, pair.original),
            versions: {},
            position: wordIndex,
          };
        }

        // Зберігаємо оригінал
        wordBlocks[wordIndex].versions[pair.original] = {
          text: getWordText(origWord),
          word: origWord,
          isOriginal: true,
          version: pair.original,
        };
      });

      // Обробляємо переклади для цієї пари
      if (pair.translations && pair.translations.length > 0) {
        pair.translations.forEach((transCode) => {
          // Перевіряємо, чи вже обробляли цей переклад
          const translationKey = `${pair.original}-${transCode}`;
          if (processedTranslations.has(translationKey)) {
            console.log(
              `⏭️ Переклад ${transCode} вже оброблено для ${pair.original}`
            );
            return;
          }

          const transVerse = getVerseData(transCode, verseNum);
          if (!transVerse) {
            console.log(`❌ Переклад ${transCode} не знайдено`);
            return;
          }

          // Виконуємо розширене вирівнювання
          const aligned = alignWordsAdvanced(
            origVerse,
            transVerse,
            pair.original,
            transCode
          );

          // Зберігаємо результати
          aligned.forEach((item, idx) => {
            if (!wordBlocks[idx]) {
              console.warn(`⚠️ Немає блоку для індексу ${idx}`);
              return;
            }

            wordBlocks[idx].versions[transCode] = {
              text: item.translation ? getWordText(item.translation) : null,
              word: item.translation,
              isOriginal: false,
              version: transCode,
              alignedBy: item.alignedBy,
            };
          });

          processedTranslations.add(translationKey);
        });
      }
    });

    // Фільтруємо порожні блоки та додаємо відсутні переклади
    const filteredBlocks = wordBlocks.filter(
      (block) => block && block.versions
    );

    console.log(
      `✅ Створено блоків: ${filteredBlocks.length} для вірша ${verseNum}`
    );
    return filteredBlocks;
  }, [
    pairs,
    verseNum,
    chapterData,
    getVerseData,
    getWordsFromVerse,
    getWordText,
    getStrongCode,
    alignWordsAdvanced,
  ]);

  // ==================== ОНОВЛЕННЯ ШИРИНИ ====================

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // ==================== ОБРОБНИКИ ПОДІЙ ====================

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsAboveCursor(e.clientY < window.innerHeight / 2);
  }, []);

  // В `handleWordClick` додаємо отримання словникового коду:
  const handleWordClick = useCallback(
    (word, version, strong, isOriginal) => {
      if (word && onWordClick) {
        // Отримуємо словниковий код з даних слова
        const dictCode = getValue(word, "dict") || null;

        onWordClick({
          word: {
            word: getWordText(word),
            strong: strong,
            lemma: getLemma(word),
            morph: getMorph(word),
            dict: dictCode, // ← ДОДАЄМО словниковий код
          },
          origVer: version,
          lang: strong?.startsWith("H") ? "he" : "gr",
        });
      }
    },
    [onWordClick, getWordText, getLemma, getMorph]
  );

  // Також додамо функцію для отримання словникового коду:
  const getDictCode = useCallback((word) => {
    if (!word) return null;
    return getValue(word, "dict") || null;
  }, []);

  // ==================== ВІДОБРАЖЕННЯ СЛІВ ====================

  const renderWord = useCallback(
    (wordData, version, strong, isOriginal) => {
      if (!wordData || wordData.text === null) {
        return (
          <div className="empty-word">
            <span
              key={`empty-${version}`}
              className="empty-word"
              title="Відсутній відповідник"
            >
              —
            </span>
          </div>
        );
      }

      // Отримуємо dict код
      const dictCode = getDictCode(wordData.word);

      // Визначення напрямку тексту
      const textDirection = strong && strong.startsWith("H") ? "rtl" : "ltr";

      // Текст для title (підказки при наведенні)
      const titleText = dictCode
        ? `Словник: ${dictCode} | Strong: ${strong || "немає"}`
        : strong
        ? `Strong: ${strong}`
        : version;

      return (
        <span
          key={`word-${version}`}
          className={`word ${
            isOriginal ? "original-word" : "translation-word"
          } ${wordData.word ? "clickable" : ""}`}
          onClick={() =>
            handleWordClick(wordData.word, version, strong, isOriginal)
          }
          onMouseEnter={() =>
            wordData.word &&
            setHoveredWord({
              ...wordData,
              strong,
              version,
              isOriginal,
              dictCode, // ← ДОДАЄМО dictCode
            })
          }
          onMouseLeave={() => setHoveredWord(null)}
          // title={strong ? `Strong: ${strong}` : version}
          // style={{ direction: textDirection, unicodeBidi: "embed" }}
          title={titleText} // ← ОНОВЛЮЄМО title
          style={{ direction: textDirection, unicodeBidi: "embed" }}
          data-dict={dictCode} // ← Додаємо атрибут для дебагу
        >
          {wordData.text}
        </span>
      );
    },
    [handleWordClick, getDictCode]
  );

  // ==================== ДОПОМІЖНІ ФУНКЦІЇ ====================

  const getDisplayVersions = useCallback(() => {
    const versions = [];

    pairs.forEach((pair) => {
      // Додаємо оригінал
      if (pair.original && !versions.includes(pair.original)) {
        versions.push(pair.original);
      }

      // Додаємо переклади
      if (pair.translations && pair.translations.length > 0) {
        pair.translations.forEach((trans) => {
          if (!versions.includes(trans)) {
            versions.push(trans);
          }
        });
      }
    });

    // console.log(`📋 Версії для відображення:`, versions);
    return versions;
  }, [pairs]);

  const isOriginalVersion = useCallback((version) => {
    return ["LXX", "THOT", "TR", "GNT"].includes(version.toUpperCase());
  }, []);

  // ==================== РЕНДЕРИНГ ====================

  if (!pairs || pairs.length === 0 || !chapterData) {
    return (
      <div className="interlinear-verse">
        <div className="verse-number">{verseNum}</div>
        <div className="words-grid text-muted">Дані для вірша відсутні</div>
      </div>
    );
  }

  const displayVersions = getDisplayVersions();
  const wordBlocks = createVerseBlocks;

  // console.log(`🎨 Рендеринг вірша ${verseNum}:`, {
  //   блоків: wordBlocks.length,
  //   версій: displayVersions.length,
  //   пари: pairs.length,
  // });

  return (
    <div
      className="interlinear-verse flex-layout"
      onMouseMove={handleMouseMove}
    >
      <div className="verse-content" data-verse={verseNum}>
        <div className="verse-number">{verseNum}</div>

        {/* ЗАГОЛОВКИ ТІЛЬКИ ДЛЯ ПЕРШОГО ВІРША РОЗДІЛУ */}
        {isFirstInChapter && (
          <div className="verse-headers verse-row">
            {displayVersions.map((version, index) => (
              <div
                key={`header-${version}-${index}`}
                className={`verse-header ${
                  isOriginalVersion(version)
                    ? "original-header"
                    : "translation-header"
                }`}
                style={{
                  direction: version === "THOT" ? "rtl" : "ltr",
                  unicodeBidi: version === "THOT" ? "embed" : "normal",
                }}
              >
                <span className="word">[{version}]</span>
              </div>
            ))}
          </div>
        )}

        {/* БЛОКИ СЛІВ */}
        {wordBlocks.map((block, blockIndex) => (
          <div key={block.id} className="word-block">
            <div className="version-row">
              {displayVersions.map((version, versionIndex) => {
                const wordData = block.versions[version];
                const strongCode = wordData?.word
                  ? getStrongCode(wordData.word, version)
                  : block.strong;

                return (
                  <div
                    key={`${block.id}-${version}-${versionIndex}`}
                    className={`word-version ${
                      isOriginalVersion(version)
                        ? "original-version"
                        : "translation-version"
                    }`}
                  >
                    {renderWord(
                      wordData,
                      version,
                      strongCode,
                      isOriginalVersion(version)
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ПЛАВАЮЧА ПІДКАЗКА */}
      {hoveredWord && hoveredWord.word && (
        <div
          ref={tooltipRef}
          className="floating-tooltip"
          style={{
            left: `${mousePos.x + 10}px`,
            top: isAboveCursor
              ? `${mousePos.y + 20}px`
              : `${mousePos.y - 120}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="tooltip-header">
            {hoveredWord.dictCode ? (
              <>
                <strong className="dict-code">{hoveredWord.dictCode}</strong>
                <span className="version-badge">[{hoveredWord.version}]</span>
                <span className="badge bg-success ms-2">UA</span>
              </>
            ) : (
              <>
                <strong className="strong-code">{hoveredWord.strong}</strong>
                <span className="version-badge">[{hoveredWord.version}]</span>
                {hoveredWord.isOriginal && (
                  <span className="badge bg-primary ms-2">Оригінал</span>
                )}
              </>
            )}
          </div>
          <div className="tooltip-body">
            <div className="word-text">{hoveredWord.text}</div>
            {hoveredWord.dictCode ? (
              <div className="word-dict">
                <small>Словник: {hoveredWord.dictCode}</small>
              </div>
            ) : null}
            {getLemma(hoveredWord.word) && (
              <div className="word-lemma">
                Лема: {getLemma(hoveredWord.word)}
              </div>
            )}
            {getMorph(hoveredWord.word) && (
              <div className="word-morph">
                Морф: {getMorph(hoveredWord.word)}
              </div>
            )}
          </div>
          <div className="tooltip-footer">
            <small>Клік для відкриття словника</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterlinearVerse;
