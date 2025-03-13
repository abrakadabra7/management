export interface Task {
  id?: string;
  project: string;
  item_number: string;
  description: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  created_at?: string;
  status?: 'active' | 'completed';
} 