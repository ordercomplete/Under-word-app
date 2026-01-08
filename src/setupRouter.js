// Створити файл src/setupRouter.js
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();
export { HistoryRouter };
