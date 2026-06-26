import axios from "axios";

import { env } from "../config/env";

export const apiClient = axios.create({
  baseURL: env.WEB_API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json"
  }
});
