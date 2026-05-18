import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { supabase } from "./integrations/supabase/client";
import "./styles.css";

const router = getRouter();

// Refresh the Supabase auth session whenever the app comes back to the
// foreground (e.g. user switches away and back). Without this, the session
// can appear stale after the device has been idle and cause silent failures
// on Supabase queries.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    supabase.auth.getSession();
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
