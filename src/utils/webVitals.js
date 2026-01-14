// utils/webVitals.js
import { getLCP, getFID, getCLS } from "web-vitals";

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getLCP(onPerfEntry);
    getFID(onPerfEntry);
    getCLS(onPerfEntry);
  }
};

// Використання в index.js:
import { reportWebVitals } from "./utils/webVitals";
reportWebVitals(console.log);
