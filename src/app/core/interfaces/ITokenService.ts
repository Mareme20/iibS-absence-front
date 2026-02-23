export interface ITokenService {
  setToken(token: string): void;
  removeToken(): void;
  getToken(): string | null;
}
