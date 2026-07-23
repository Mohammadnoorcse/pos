import React from "react";
import { FONTS } from "../constants";

export function useGoogleFonts() {
  React.useEffect(() => {
    if (document.getElementById(FONTS.IMPORT_ID)) return;
    const link = document.createElement("link");
    link.id = FONTS.IMPORT_ID;
    link.rel = "stylesheet";
    link.href = FONTS.IMPORT_URL;
    document.head.appendChild(link);
  }, []);
}