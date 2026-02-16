export interface UserProfile {
  role: "admin" | "user";
  theme: "light" | "dark";
  allowed_submenus: number[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  profile: UserProfile;
}

export interface Submenu {
  id: number;
  title: string;
  name?: string;
}

export interface Menu {
  id: number;
  title: string;
  name?: string;
  submenus: Submenu[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface ApiError {
  [key: string]: string | string[];
}