/**
 * Security Suite - Client-side Authentication & Session Service
 * Communicates with server endpoints (/api/auth/*) using cryptographically
 * secure session tokens with zero exposure of credentials in client bundles.
 */

export interface AuthUser {
  displayName: string;
  role: "VIP_MEMBER" | "GUEST";
  isVip: boolean;
  expiresAt?: number;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  remainingAttempts?: number;
  lockedUntil?: number;
}

export interface SecurityAuditData {
  securityProtocol: string;
  passwordAlgorithm: string;
  timingAttackProtection: string;
  rateLimiting: string;
  sessionEncryption: string;
  activeSessionsCount: number;
  xssProtection: string;
  timestamp: string;
}

const TOKEN_KEY = "voyage_auth_token";
const USER_KEY = "voyage_auth_user";

class AuthService {
  private currentToken: string | null = null;
  private currentUser: AuthUser | null = null;

  constructor() {
    this.currentToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch {
        this.currentUser = null;
      }
    }
  }

  public getStoredToken(): string | null {
    if (!this.currentToken) {
      this.currentToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    }
    return this.currentToken;
  }

  public getStoredUser(): AuthUser | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored);
        } catch {
          this.currentUser = null;
        }
      }
    }
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getStoredToken() && this.getStoredUser()?.isVip);
  }

  public async login(
    usernameCandidate: string,
    passwordCandidate: string,
    rememberMe: boolean = true
  ): Promise<LoginResult> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameCandidate.trim(),
          password: passwordCandidate,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || "Authentication failed. Please verify credentials.",
          remainingAttempts: data.remainingAttempts,
          lockedUntil: data.lockedUntil,
        };
      }

      this.currentToken = data.token;
      this.currentUser = data.user;

      const storage = rememberMe ? localStorage : sessionStorage;
      // Clear opposite storage
      if (rememberMe) {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }

      storage.setItem(TOKEN_KEY, data.token);
      storage.setItem(USER_KEY, JSON.stringify(data.user));

      return {
        success: true,
        user: data.user,
      };
    } catch (err: any) {
      return {
        success: false,
        error: "Network security handshake failed. Please check connection and try again.",
      };
    }
  }

  public async verifySession(): Promise<AuthUser | null> {
    const token = this.getStoredToken();
    if (!token) {
      this.clearLocalSession();
      return null;
    }

    try {
      const response = await fetch("/api/auth/session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.clearLocalSession();
        return null;
      }

      const data = await response.json();
      if (data.valid && data.user) {
        this.currentUser = data.user;
        const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
        storage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      } else {
        this.clearLocalSession();
        return null;
      }
    } catch {
      // In offline or transient network conditions, preserve session if still within expiration
      const cached = this.getStoredUser();
      if (cached && cached.expiresAt && cached.expiresAt > Date.now()) {
        return cached;
      }
      return null;
    }
  }

  public async logout(): Promise<void> {
    const token = this.getStoredToken();
    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // Network error during logout ignored
      }
    }
    this.clearLocalSession();
  }

  public clearLocalSession(): void {
    this.currentToken = null;
    this.currentUser = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    // Also remove legacy key if present
    localStorage.removeItem("voyage_vip_auth");
  }

  public async getSecurityAudit(): Promise<SecurityAuditData | null> {
    try {
      const res = await fetch("/api/auth/security-audit");
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
