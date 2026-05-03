declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export function fbEvent(event: string, data?: Record<string, any>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, data);
  }
}
