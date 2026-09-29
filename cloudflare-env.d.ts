declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    ACCESS_KEY_HASH?: string;
    BUCKET?: R2Bucket;
  }
}
