// src/contexts/NavigationContext.js
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { saveVisit, getLastVisit } from "../utils/visitHistory";

const NavigationContext = createContext(null);

const DEFAULT_REF = "GEN.1";
const DEFAULT_VERSIONS = [];

export const NavigationProvider = ({ children }) => {
  const [currentRef, setCurrentRef] = useState(DEFAULT_REF);
  const [versions, setVersions] = useState(DEFAULT_VERSIONS);
  const [initialized, setInitialized] = useState(false);

  // При монтуванні відновлюємо стан з localStorage
  useEffect(() => {
    const lastVisit = getLastVisit();
    if (lastVisit) {
      setCurrentRef(lastVisit.ref);
      setVersions(lastVisit.versions);
    }
    setInitialized(true);
  }, []);

  // Функція оновлення ref + збереження історії
  const updateRef = useCallback((newRef) => {
    setCurrentRef(newRef);
  }, []);

  // Функція оновлення versions + збереження історії
  const updateVersions = useCallback((newVersions) => {
    setVersions(newVersions);
  }, []);

  // Зберігаємо в історію при кожній зміні currentRef або versions (після ініціалізації)
  useEffect(() => {
    if (!initialized) return;
    saveVisit(currentRef, versions);
  }, [currentRef, versions, initialized]);

  const navigateToRef = useCallback((ref, versions) => {
    setCurrentRef(ref);
    setVersions(versions);
  }, []);

  const value = {
    currentRef,
    versions,
    updateRef,
    updateVersions,
    navigateToRef,
    initialized,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export default NavigationContext;
