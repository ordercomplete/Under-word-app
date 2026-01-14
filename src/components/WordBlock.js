// components/WordBlock.js
import React, { memo } from "react";

const WordBlock = memo(
  ({
    block,
    displayVersions,
    renderWord,
    getStrongCode,
    isOriginalVersion,
  }) => (
    <div className="word-block">
      <div className="version-row">
        {displayVersions.map((version) => {
          const wordData = block.versions[version];
          const strongCode = wordData?.word
            ? getStrongCode(wordData.word, version)
            : block.strong;

          return (
            <div
              key={`${block.id}-${version}`}
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
  )
);
