import { useEffect, useState } from "react";

export default function useBrowserName() {
    const [browser, setBrowser] = useState("");
  
  useEffect(() => {
    let brow = "";
    if (
      navigator.userAgent.toLowerCase().indexOf("chrome") > -1 &&
      navigator.userAgent.toLowerCase().indexOf("safari") > -1
    ) {
      brow = "Chrome";
    }
    if (
      navigator.userAgent.toLowerCase().indexOf("safari") > -1 &&
      !(navigator.userAgent.toLowerCase().indexOf("chrome") > -1)
    ) {
      brow = "Safari";
    }
    if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
      brow = "Firefox";
    }
    if (navigator.userAgent.toLowerCase().indexOf("edg") > -1) {
      brow = "Edge";
    }
    setBrowser(brow);
  }, []);

  return browser;
}
