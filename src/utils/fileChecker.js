// src/utils/fileChecker.js
export const checkFileStructure = async () => {
  const structureReport = {
    timestamp: new Date().toISOString(),
    dataCompressed: {},
    dataOriginal: {},
    issues: [],
  };

  // Перевіряємо основні директорії
  const directories = [
    "/data_compressed/translations/utt/OldT/GEN/",
    "/data/translations/utt/OldT/GEN/",
    "/data_compressed/strongs/",
    "/data/strongs/",
  ];

  for (const dir of directories) {
    try {
      const response = await fetch(dir);
      structureReport[
        dir.includes("_compressed") ? "dataCompressed" : "dataOriginal"
      ][dir] = response.ok ? "exists" : "missing";

      if (!response.ok) {
        structureReport.issues.push(`Directory missing: ${dir}`);
      }
    } catch (error) {
      structureReport[
        dir.includes("_compressed") ? "dataCompressed" : "dataOriginal"
      ][dir] = "error: " + error.message;
      structureReport.issues.push(`Error accessing ${dir}: ${error.message}`);
    }
  }

  // Перевіряємо конкретні файли
  const files = [
    "/data_compressed/translations/utt/OldT/GEN/gen1_utt.json",
    "/data/translations/utt/OldT/GEN/gen1_utt.json",
    "/data_compressed/strongs/G746.json",
    "/data/strongs/G746.json",
  ];

  for (const file of files) {
    try {
      const response = await fetch(file);
      if (response.ok) {
        const size = response.headers.get("content-length");
        console.log(`✅ ${file} exists, size: ${size} bytes`);
      } else {
        console.log(`❌ ${file} missing, status: ${response.status}`);
        structureReport.issues.push(
          `File missing: ${file} (HTTP ${response.status})`
        );
      }
    } catch (error) {
      console.log(`❌ ${file} error: ${error.message}`);
      structureReport.issues.push(`File error: ${file} - ${error.message}`);
    }
  }

  return structureReport;
};
