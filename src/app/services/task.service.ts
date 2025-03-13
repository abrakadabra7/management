import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private supabaseService: SupabaseService) {}

  async getAllTasks() {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Görevler yüklenirken Supabase hatası:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Görevler yüklenirken hata:', error);
      throw error;
    }
  }

  async createTask(task: Omit<Task, 'id' | 'created_at'>) {
    try {
      const now = new Date().toISOString();
      const taskWithTime = {
        ...task,
        start_time: now,
        created_at: now
      };

      const { data, error } = await this.supabaseService
        .getClient()
        .from('tasks')
        .insert([taskWithTime])
        .select()
        .single();

      if (error) {
        console.error('Görev oluşturulurken Supabase hatası:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Görev oluşturulurken hata:', error);
      throw error;
    }
  }

  async updateTask(id: string, task: Partial<Task>) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('tasks')
        .update(task)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Görev güncellenirken Supabase hatası:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Görev güncellenirken hata:', error);
      throw error;
    }
  }

  async deleteTask(id: string) {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Görev silinirken Supabase hatası:', error);
        throw error;
      }
    } catch (error) {
      console.error('Görev silinirken hata:', error);
      throw error;
    }
  }
} 