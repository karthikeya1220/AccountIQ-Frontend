/**
 * Rate Limiter
 * 
 * Prevents brute force attacks by limiting login attempts
 * - Max 5 attempts per email per 5 minutes
 * - Blocks further attempts with cooldown timer
 */

interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private maxAttempts = 5;
  private windowMs = 5 * 60 * 1000; // 5 minutes
  private blockDurationMs = 15 * 60 * 1000; // 15 minutes

  /**
   * Check if email is rate limited
   */
  isLimited(email: string): boolean {
    const entry = this.attempts.get(email);
    if (!entry) return false;

    const now = Date.now();
    
    // Check if still blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return true;
    }

    // Check if window expired
    if (now - entry.lastAttempt > this.windowMs) {
      this.attempts.delete(email);
      return false;
    }

    return entry.attempts >= this.maxAttempts;
  }

  /**
   * Get remaining cooldown time in seconds
   */
  getRemainingCooldown(email: string): number {
    const entry = this.attempts.get(email);
    if (!entry || !entry.blockedUntil) return 0;

    const remaining = entry.blockedUntil - Date.now();
    return Math.ceil(remaining / 1000);
  }

  /**
   * Record a failed attempt
   */
  recordAttempt(email: string): void {
    const now = Date.now();
    const entry = this.attempts.get(email);

    if (!entry) {
      this.attempts.set(email, {
        attempts: 1,
        lastAttempt: now,
      });
      return;
    }

    // Reset if window expired
    if (now - entry.lastAttempt > this.windowMs) {
      this.attempts.set(email, {
        attempts: 1,
        lastAttempt: now,
      });
      return;
    }

    entry.attempts++;
    entry.lastAttempt = now;

    // Block if max attempts exceeded
    if (entry.attempts >= this.maxAttempts) {
      entry.blockedUntil = now + this.blockDurationMs;
    }
  }

  /**
   * Reset attempts for email
   */
  reset(email: string): void {
    this.attempts.delete(email);
  }

  /**
   * Clear all attempts (for testing/admin)
   */
  clear(): void {
    this.attempts.clear();
  }

  /**
   * Get attempts for email (for debugging)
   */
  getAttempts(email: string): RateLimitEntry | undefined {
    return this.attempts.get(email);
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// For server-side rate limiting, use Redis or database
// This is a basic client-side implementation for reference
