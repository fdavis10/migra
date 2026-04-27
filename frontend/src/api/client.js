import axios from "axios";
import { LOCALE_STORAGE_KEY } from "@/content/languageOptions";

const baseURL = import.meta.env.VITE_API_BASE || "/api";

const client = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    const locale = raw === "en" ? "en" : "ru";
    config.params = { ...(config.params || {}), lang: locale };
  } catch {
    config.params = { ...(config.params || {}), lang: "ru" };
  }
  return config;
});

export default client;
