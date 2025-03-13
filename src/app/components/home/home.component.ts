import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentTask: Task = {
    project: '',
    item_number: '',
    description: '',
    status: 'active'
  };

  tasks: Task[] = [];
  activeTask: Task | null = null;
  taskStartTime: Date | null = null;
  loading = false;
  error: string | null = null;
  elapsedTime: string = '00:00:00';
  private timerInterval: any;

  constructor(
    private taskService: TaskService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  translate(key: string): string {
    return this.languageService.translate(key);
  }

  private startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.taskStartTime) {
        const now = new Date();
        const diff = now.getTime() - this.taskStartTime.getTime();
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        this.elapsedTime = `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

  async loadTasks() {
    try {
      this.loading = true;
      this.error = null;
      this.tasks = await this.taskService.getAllTasks();
    } catch (error) {
      this.error = this.translate('load_error');
      console.error('Görevler yüklenirken hata:', error);
    } finally {
      this.loading = false;
    }
  }

  async startTask() {
    if (this.activeTask) {
      this.error = this.translate('task_exists_error');
      return;
    }

    if (!this.currentTask.project || !this.currentTask.description) {
      this.error = this.translate('required_fields_error');
      return;
    }

    try {
      this.loading = true;
      this.error = null;
      
      const newTask = await this.taskService.createTask({
        ...this.currentTask,
        status: 'active'
      });
      
      this.activeTask = newTask;
      this.taskStartTime = new Date();
      this.startTimer();
      await this.loadTasks();
      
      this.error = null;
    } catch (error) {
      this.error = this.translate('start_error');
      console.error('Görev başlatılırken hata:', error);
      this.activeTask = null;
      this.taskStartTime = null;
    } finally {
      this.loading = false;
    }
  }

  async endTask() {
    if (!this.activeTask || !this.taskStartTime) {
      this.error = this.translate('no_active_task_error');
      return;
    }

    try {
      this.loading = true;
      this.error = null;
      
      const endTime = new Date();
      const duration = (endTime.getTime() - this.taskStartTime.getTime()) / (1000 * 60 * 60);
      
      await this.taskService.updateTask(this.activeTask.id!, {
        end_time: endTime.toISOString(),
        duration: Number(duration.toFixed(2)),
        status: 'completed'
      });

      this.stopTimer();
      await this.loadTasks();
      
      this.activeTask = null;
      this.taskStartTime = null;
      this.elapsedTime = '00:00:00';
      this.currentTask = {
        project: '',
        item_number: '',
        description: '',
        status: 'active'
      };
      
      this.error = null;
    } catch (error) {
      this.error = this.translate('end_error');
      console.error('Görev sonlandırılırken hata:', error);
    } finally {
      this.loading = false;
    }
  }

  async deleteTask(taskId: string) {
    if (!confirm(this.translate('delete_confirmation'))) {
      return;
    }

    try {
      this.loading = true;
      this.error = null;
      
      await this.taskService.deleteTask(taskId);
      await this.loadTasks();
      
      this.error = null;
    } catch (error) {
      this.error = this.translate('delete_error');
      console.error('Görev silinirken hata:', error);
    } finally {
      this.loading = false;
    }
  }

  exportToExcel() {
    // Excel export işlemi burada yapılacak
  }
} 