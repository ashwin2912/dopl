import config from "../config/env.js";

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  "error-codes"?: string[];
}

class CaptchaService {
  private readonly RECAPTCHA_VERIFY_URL =
    "https://www.google.com/recaptcha/api/siteverify";
  private readonly MIN_SCORE = 0.5; // Threshold: 0.0 = bot, 1.0 = human

  /**
   * Verify a reCAPTCHA v3 token
   * Returns true if the token is valid and the score is above threshold
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      console.log("[CAPTCHA] Verifying token...");

      const response = await fetch(this.RECAPTCHA_VERIFY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: config.recaptchaSecretKey,
          response: token,
        }),
      });

      const data = (await response.json()) as RecaptchaResponse;

      console.log("[CAPTCHA] Verification result:", {
        success: data.success,
        score: data.score,
        action: data.action,
        errors: data["error-codes"],
      });

      if (!data.success) {
        console.error("[CAPTCHA] Verification failed:", data["error-codes"]);
        return false;
      }

      if (data.score < this.MIN_SCORE) {
        console.warn(
          `[CAPTCHA] Score too low: ${data.score} (min: ${this.MIN_SCORE})`,
        );
        return false;
      }

      console.log(`[CAPTCHA] Verification passed! Score: ${data.score}`);
      return true;
    } catch (error) {
      console.error("[CAPTCHA] Error verifying token:", error);
      // Fail closed: reject on error to prevent abuse
      return false;
    }
  }
}

export default new CaptchaService();
