import { webEnvSchema } from "@zone/shared";

const parsed = webEnvSchema.safeParse({
  WEB_API_BASE_URL:
    import.meta.env.VITE_WEB_API_BASE_URL ??
    import.meta.env.WEB_API_BASE_URL ??
    "http://localhost:4000/api",
  WEB_SOCKET_URL:
    import.meta.env.VITE_WEB_SOCKET_URL ??
    import.meta.env.WEB_SOCKET_URL ??
    "http://localhost:4000"
});

if (!parsed.success) {
  throw new Error(`Invalid web environment configuration: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
}

export const env = parsed.data;
