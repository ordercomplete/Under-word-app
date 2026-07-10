// src/components/AllVersesInline.js - 10.07.2026
// Суцільний потік слів розділу: стандартні word-block в одному flex-wrap
import React, { useMemo, useRef, useState, useCallback } from "react";
import { getValue } from "../utils/jsonAdapter";
import { logger } from "../utils/logger";
import translationUtils from "../utils/translationUtils";
import "../styles/Interlinear.css";

// ==================== ХЕЛПЕРИ ====================
const getWordsFromVerse = (verseData) =>
  verseData
    ? getValue(verseData, "words") || getValue(verseData, "ws") || []
    : [];

const getWordText = (word) =>
  word ? getValue(word, "word") || getValue(word, "w") || null : null;

const getStrongCode = (word, version = null) => {
  if (!word) return null;
  let strong = getValue(word, "strong") || getValue(word, "s") || null;
  if (version === "THOT" && strong && strong.startsWith("G")) {
    strong = "H" + strong.substring(1);
  }
  return strong;
};

const getLemma = (word) =>
  word ? getValue(word, "lemma") || getValue(word, "l") || null : null;

const getMorph = (word) =>
  word ? getValue(word, "morph") || getValue(word, "m") || null : null;

const getDictCode = (word) => (word ? getValue(word, "dict") || null : null);

const isOriginalVersion = (version) =>
  translationUtils.isOriginalInitials(version);

// ==================== ВИРІВНЮВАННЯ ====================
const alignWordsAdvanced = (
  originalVerse,
  translationVerse,
  originalVersion,
  translationCode,
) => {
  const aligned = [];
  const origWords = getWordsFromVerse(originalVerse);
  const transWords = getWordsFromVerse(translationVerse);

  if (origWords.length === 0 || transWords.length === 0) return aligned;

  const translationMap = new Map();
  transWords.forEach((transWord, index) => {
    const strong = getStrongCode(transWord, translationCode);
    if (strong) {
      if (!translationMap.has(strong)) translationMap.set(strong, []);
      translationMap.get(strong).push({ word: transWord, index });
    }
  });

  for (let i = 0; i < origWords.length; i++) {
    const origWord = origWords[i];
    const origStrong = getStrongCode(origWord, originalVersion);
    const origMorph = getMorph(origWord);

    let matchedWord = null;

    if (origStrong && translationMap.has(origStrong)) {
      const candidates = translationMap.get(origStrong);
      for (let j = 0; j < candidates.length; j++) {
        const candidate = candidates[j];
        if (!origMorph || getMorph(candidate.word) === origMorph) {
          matchedWord = candidate.word;
          candidates.splice(j, 1);
          if (candidates.length === 0) translationMap.delete(origStrong);
          break;
        }
      }
      if (!matchedWord && candidates.length > 0) {
        matchedWord = candidates[0].word;
        candidates.shift();
        if (candidates.length === 0) translationMap.delete(origStrong);
      }
    }

    aligned.push({
      original: origWord,
      translation: matchedWord,
      alignedBy: matchedWord ? "strong" : "none",
    });
  }

  return aligned;
};

// ==================== ОСНОВНИЙ КОМПОНЕНТ ====================
const AllVersesInline = ({ verseNumbers, pairs, chapterData, onWordClick }) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAboveCursor, setIsAboveCursor] = useState(false);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  // Набір displayVersions — з pairs
  const displayVersions = useMemo(() => {
    const versions = [];
    const seen = new Set();
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (pair.original && !seen.has(pair.original)) {
        seen.add(pair.original);
        versions.push(pair.original);
      }
      if (pair.translations) {
        for (let j = 0; j < pair.translations.length; j++) {
          const trans = pair.translations[j];
          if (!seen.has(trans)) {
            seen.add(trans);
            versions.push(trans);
          }
        }
      }
    }
    return versions;
  }, [pairs]);

  // Збираємо всі wordBlocks з усіх віршів послідовно
  // Об'єднуємо blocks з різних пар за індексом слова (wi), щоб кожен block
  // містив ВСІ версії (LXX, UTT, THOT, UBT тощо) в одному word-block
  const allBlocks = useMemo(() => {
    if (!pairs || pairs.length === 0 || !chapterData || !verseNumbers)
      return [];

    const result = [];

    for (let vi = 0; vi < verseNumbers.length; vi++) {
      const verseNum = verseNumbers[vi];

      // Для кожного вірша: зібрати дані всіх пар
      // pairVerseData = [{ original, origWords, translationAlignments }]
      const pairVerseData = [];

      for (let pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
        const pair = pairs[pairIndex];
        if (!pair.original) continue;

        let origVerse = null;
        const origData = chapterData[pair.original];
        if (Array.isArray(origData)) {
          origVerse = origData.find(
            (v) => parseInt(v.verse || v.v) === verseNum,
          );
        }
        if (!origVerse) continue;
        const origWords = getWordsFromVerse(origVerse);

        const translationAlignments = {};
        if (pair.translations && pair.translations.length > 0) {
          for (let ti = 0; ti < pair.translations.length; ti++) {
            const transCode = pair.translations[ti];
            const key = `${pair.original}-${transCode}`;
            if (translationAlignments[key]) continue;

            let transVerse = null;
            const transData = chapterData[transCode];
            if (Array.isArray(transData)) {
              transVerse = transData.find(
                (v) => parseInt(v.verse || v.v) === verseNum,
              );
            }
            if (!transVerse) continue;

            translationAlignments[key] = alignWordsAdvanced(
              origVerse,
              transVerse,
              pair.original,
              transCode,
            );
          }
        }

        pairVerseData.push({
          original: pair.original,
          translations: pair.translations || [],
          origWords,
          translationAlignments,
        });
      }

      if (pairVerseData.length === 0) continue;

      // Визначити максимальну кількість слів серед усіх оригіналів
      const maxWordCount = Math.max(
        ...pairVerseData.map((pvd) => pvd.origWords.length),
      );

      // Створити blocks, об'єднуючи дані з усіх пар за індексом слова
      for (let wi = 0; wi < maxWordCount; wi++) {
        const block = {
          id: `${verseNum}-${wi}`,
          verseNum,
          strong: null,
          versions: {},
        };

        for (const pvd of pairVerseData) {
          if (wi < pvd.origWords.length) {
            const origWord = pvd.origWords[wi];
            if (!block.strong) {
              block.strong = getStrongCode(origWord, pvd.original);
            }

            // Оригінал
            block.versions[pvd.original] = {
              text: getWordText(origWord),
              word: origWord,
              isOriginal: true,
              version: pvd.original,
            };

            // Переклади для цієї пари
            for (const [key, aligned] of Object.entries(
              pvd.translationAlignments,
            )) {
              const transCode = key.replace(`${pvd.original}-`, "");
              if (wi < aligned.length) {
                const item = aligned[wi];
                block.versions[transCode] = {
                  text: item.translation ? getWordText(item.translation) : null,
                  word: item.translation,
                  isOriginal: false,
                  version: transCode,
                  alignedBy: item.alignedBy,
                };
              }
            }
          }
        }

        result.push(block);
      }
    }

    return result;
  }, [pairs, verseNumbers, chapterData]);

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsAboveCursor(e.clientY < window.innerHeight / 2);
  }, []);

  const handleWordClick = useCallback(
    (wordData, version, strongCode, isOrig) => {
      if (wordData?.word && onWordClick) {
        onWordClick({
          word: {
            word: getWordText(wordData.word),
            strong: strongCode,
            lemma: getLemma(wordData.word),
            morph: getMorph(wordData.word),
            dict: getDictCode(wordData.word),
          },
          origVer: version,
          lang: strongCode?.startsWith("H") ? "he" : "gr",
          isOriginal: isOrig,
        });
      }
    },
    [onWordClick],
  );

  return (
    <div
      className="interlinear-verse"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      {/* Заголовки версій — один раз на початку */}
      {/* {displayVersions.length > 0 && (
        <div className="verse-headers verse-row">
          {displayVersions.map((version, index) => (
            <div
              key={`header-${version}-${index}`}
              className={`verse-header ${
                isOriginalVersion(version)
                  ? "original-header"
                  : "translation-header"
              }`}
              style={{ unicodeBidi: version === "THOT" ? "embed" : "normal" }}
            >
              <span className="word-span">[{version}]</span>
            </div>
          ))}
        </div>
      )} */}

      <div className="verse-content" data-chapter-flow="true">
        {displayVersions.length > 0 && (
          <div className="verse-headers verse-row">
            {displayVersions.map((version, index) => (
              <div
                key={`header-${version}-${index}`}
                className={`verse-header ${
                  isOriginalVersion(version)
                    ? "original-header"
                    : "translation-header"
                }`}
                style={{ unicodeBidi: version === "THOT" ? "embed" : "normal" }}
              >
                <span className="word-span">[{version}]</span>
              </div>
            ))}
          </div>
        )}
        {allBlocks.map((block, idx) => {
          // Показуємо номер вірша тільки якщо це перший блок нового вірша
          const showVerseNumber =
            idx === 0 || block.verseNum !== allBlocks[idx - 1].verseNum;

          return (
            <React.Fragment key={block.id}>
              {showVerseNumber && (
                <span className="verse-number-inline">{block.verseNum}</span>
              )}
              <div className="word-block">
                <div className="version-row">
                  {displayVersions.map((version) => {
                    const wordData = block.versions[version];
                    const strongCode = wordData?.word
                      ? getStrongCode(wordData.word, version)
                      : block.strong;
                    const isOrig = isOriginalVersion(version);
                    const dictCode = wordData?.word
                      ? getDictCode(wordData.word)
                      : null;
                    const textDirection =
                      strongCode && strongCode.startsWith("H") ? "rtl" : "ltr";

                    return (
                      <div
                        key={`${block.id}-${version}`}
                        className={`word-version ${
                          isOrig ? "original-version" : "translation-version"
                        }`}
                      >
                        {!wordData || wordData.text === null ? (
                          <span
                            className="word empty-word"
                            title="Відсутній відповідник"
                          >
                            ~
                          </span>
                        ) : (
                          <span
                            className={`word ${
                              isOrig ? "original-word" : "translation-word"
                            } ${wordData.word ? "clickable" : ""}`}
                            onClick={() =>
                              handleWordClick(
                                wordData,
                                version,
                                strongCode,
                                isOrig,
                              )
                            }
                            onMouseEnter={() =>
                              wordData.word &&
                              setHoveredWord({
                                ...wordData,
                                strong: strongCode,
                                version,
                                isOriginal: isOrig,
                                dictCode,
                              })
                            }
                            onMouseLeave={() => setHoveredWord(null)}
                            title={
                              dictCode
                                ? `Словник: ${dictCode}`
                                : strongCode
                                  ? `Strong: ${strongCode}`
                                  : version
                            }
                            style={{
                              direction: textDirection,
                              unicodeBidi: "embed",
                            }}
                          >
                            {wordData.text}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Tooltip */}
      {hoveredWord && hoveredWord.word && (
        <div
          ref={tooltipRef}
          className="floating-tooltip"
          style={{
            left: `${mousePos.x + 10}px`,
            top: isAboveCursor
              ? `${mousePos.y + 20}px`
              : `${mousePos.y - 120}px`,
          }}
        >
          <div className="tooltip-header">
            {hoveredWord.dictCode ? (
              <>
                <strong className="dict-code">{hoveredWord.dictCode}</strong>
                <span className="version-badge">[{hoveredWord.version}]</span>
                <span className="badge bg-success ms-2">uk</span>
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
            {hoveredWord.dictCode && (
              <div className="word-dict">
                <small>Словник: {hoveredWord.dictCode}</small>
              </div>
            )}
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
            <small>Клік для словника</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AllVersesInline);
