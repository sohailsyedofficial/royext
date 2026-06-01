import React, { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 24,
            background: "#120f1c",
            color: "#fff",
            fontFamily: "monospace",
            overflow: "auto",
            height: "100vh",
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ color: "#ff4d4f" }}>👑 RoyExt Runtime Exception caught:</h2>
          <p style={{ color: "#ff7875", fontWeight: "bold", fontSize: 16 }}>
            {this.state.error?.toString()}
          </p>
          <h3>Stack Trace:</h3>
          <pre style={{ background: "#1f1b2e", padding: 16, borderRadius: 8, overflowX: "auto" }}>
            {this.state.error?.stack}
          </pre>
          {this.state.errorInfo && (
            <>
              <h3>Component Tree Stack:</h3>
              <pre style={{ background: "#1f1b2e", padding: 16, borderRadius: 8, overflowX: "auto" }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
