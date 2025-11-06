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
