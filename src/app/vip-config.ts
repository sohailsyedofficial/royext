export const ONLINE_VALIDATION = true;
export const VALIDATION_API_URL = "https://royext.sohailsyed.com/verify.php";

// Dynamic Scripts API
export const SCRIPTS_API_URL = "https://royext.sohailsyed.com/scripts_api.php";
export const SCRIPTS_CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

export interface VIPScript {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  downloadUrl: string;
  download_count?: number;
  created_at?: number;
  updated_at?: number;
}

// Static fallback — used only when the server is unreachable
export const VIP_SCRIPTS_FALLBACK: VIPScript[] = [];
