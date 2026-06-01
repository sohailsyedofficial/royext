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
import App from "./App.tsx";
import { AppProvider } from "../store/AppContext.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import LoggerCore from "@App/app/logger/core.ts";
import { message } from "../store/global.ts";
import MessageWriter from "@App/app/logger/message_writer.ts";
import "@arco-design/web-react/dist/css/arco.css";
import "@App/locales/locales";
import "@App/index.css";
import "./index.css";
import registerEditor from "@App/pkg/utils/monaco-editor";
import { BrowserRouter, Route, Routes } from "react-router-dom";

registerEditor();

// 初始化日志组件
const loggerCore = new LoggerCore({
  writer: new MessageWriter(message),
  labels: { env: "install" },
});

loggerCore.logger().debug("install page start");

const MyApp = () => (
  <ErrorBoundary>
    <AppProvider>
      <MainLayout className="!tw-flex-col !tw-px-4 tw-box-border">
        <App />
      </MainLayout>
    </AppProvider>
  </ErrorBoundary>
);
const Root = (
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<MyApp />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  process.env.NODE_ENV === "development" ? <React.StrictMode>{Root}</React.StrictMode> : Root
);
