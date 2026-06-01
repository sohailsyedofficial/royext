window.addEventListener("error", (event) => {
  if (event.message?.includes("ResizeObserver")) {
    return;
  }
  alert("Global Error: " + event.message + "\nStack: " + event.error?.stack);
});
window.addEventListener("unhandledrejection", (event) => {
  if (event.reason?.message?.includes("ResizeObserver") || event.reason?.includes?.("ResizeObserver")) {
    return;
  }
  alert("Promise Rejection: " + event.reason + "\nStack: " + event.reason?.stack);
});

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.tsx";
import Sider from "../components/layout/Sider.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";
import { AppProvider } from "../store/AppContext.tsx";
import "@arco-design/web-react/dist/css/arco.css";
import "@App/locales/locales";
import "@App/index.css";
import "./index.css";
import LoggerCore from "@App/app/logger/core.ts";
import { LoggerDAO } from "@App/app/repo/logger.ts";
import DBWriter from "@App/app/logger/db_writer.ts";
import registerEditor from "@App/pkg/utils/monaco-editor";
import migrate from "@App/app/migrate.ts";

migrate();

registerEditor();

// 初始化日志组件
const loggerCore = new LoggerCore({
  writer: new DBWriter(new LoggerDAO()),
  labels: { env: "options" },
});

loggerCore.logger().debug("options page start");

const Root = (
  <ErrorBoundary>
    <AppProvider>
      <HashRouter>
        <MainLayout className="!tw-flex-col" pageName="options">
          <Sider />
        </MainLayout>
      </HashRouter>
    </AppProvider>
  </ErrorBoundary>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  process.env.NODE_ENV === "development" ? <React.StrictMode>{Root}</React.StrictMode> : Root
);
