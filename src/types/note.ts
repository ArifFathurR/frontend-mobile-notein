export type NoteType = 'txt' | 'checklist';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  type: NoteType;
  title: string;
  content?: string;
  checklist?: ChecklistItem[];
  category: 'Personal' | 'Work' | 'Others';
  isDone?: boolean;
  time: string;
  date?: string;
}
