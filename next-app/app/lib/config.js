// Shared API base for frontend. Computes from current host to avoid localhost issues on other devices.
export function getApiBase() {
  return 'https://api.serv-iptv.com';
}

export function getApiUrl() {
  return `${getApiBase()}/api`;
}

// For convenience, export constants (but use functions in components for dynamic resolution)
export const API_BASE = getApiBase();
export const API_URL = getApiUrl();
