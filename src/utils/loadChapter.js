// loadChapter.js Placeholder for loading chapter JSON
export const loadChapter = async (version, book, chapter) => {
  try {
    // Example: import(`../../originals/${version}/${book}/chapter${chapter}.json`)
    return { verses: [] }; // Mock data
  } catch (error) {
    console.error("Error loading chapter:", error);
    return { verses: [] };
  }
};

// loadChapter.js 03.12.2025
// const loadChapter = async (ver, book, chapter) => {
//   // ... fetch logic
//   const data = await res.json();
//   return data.map((verse) => ({
//     v: verse.v,
//     words: verse.w.map((w) => ({
//       word: w.w, // з "w" -> "word"
//       strong: w.s, // з "s" -> "strong"
//     })),
//   }));
// };
// export default loadChapter;
