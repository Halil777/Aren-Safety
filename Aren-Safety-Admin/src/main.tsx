import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ErrorBoundary } from "react-error-boundary"

import App from "./App"
import "antd/dist/reset.css"
import "./index.css"
import { AppProviders } from "@/app/providers/app-providers"

const container = document.getElementById("root")

if (!container) {
  throw new Error("Root element not found")
}

createRoot(container).render(
  <StrictMode>
    <AppProviders>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center text-sm text-muted-foreground">
            <p>Something went wrong.</p>
            <pre className="max-w-lg overflow-auto rounded-md bg-muted p-4 text-left text-xs text-foreground/80">
              {error.message}
            </pre>
            <button
              type="button"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm"
              onClick={resetErrorBoundary}
            >
              Try again
            </button>
          </div>
        )}
      >
        <App />
      </ErrorBoundary>
    </AppProviders>
  </StrictMode>,
)
