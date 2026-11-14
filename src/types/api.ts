export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
  };
}

export interface Category {
  id: number;
  name: string;
  id_user: number;
  created_at?: string;
  updated_at?: string;
}

export interface NoteTask {
  id: number;
  id_note: number;
  title?: string;
  text?: string;
  is_completed?: boolean;
}

export interface ApiNote {
  id: number;
  title: string;
  description: string | null;
  background_path: string | null;
  status: boolean;
  id_categories: number | null;
  id_user: number;
  create_at: string; // YYYY-MM-DD
  update_at: string; // YYYY-MM-DD
  category: Category | null;
  tasks?: NoteTask[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
