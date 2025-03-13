import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'tr' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<Language>('tr');
  currentLang$ = this.currentLang.asObservable();

  private translations = {
    tr: {
      // Navbar
      'home': 'Ana Sayfa',
      'language': 'Dil',
      
      // Form
      'new_task': 'Yeni Görev Ekle',
      'project_name': 'Proje Adı',
      'enter_project_name': 'Proje adını giriniz',
      'item_number': 'Madde Numarası',
      'enter_item_number': 'Madde numarasını giriniz',
      'task_description': 'Görev Açıklaması',
      'enter_task_description': 'Görev açıklamasını giriniz',
      'start_task': 'Göreve Başla',
      'task_in_progress': 'Görev Devam Ediyor',
      'end_task': 'Görevi Bitir',
      'export_excel': 'Excel\'e Aktar',
      
      // Active Task
      'active_task': 'Aktif Görev',
      
      // Tasks List
      'tasks': 'Görevler',
      'task_count': 'Görev',
      'completed': 'Tamamlandı',
      'active': 'Aktif',
      'no_tasks': 'Henüz görev bulunmuyor',
      
      // Messages
      'loading': 'Yükleniyor...',
      'delete_confirmation': 'Bu görevi silmek istediğinizden emin misiniz?',
      'task_exists_error': 'Zaten aktif bir görev var!',
      'required_fields_error': 'Lütfen proje ve görev açıklaması giriniz!',
      'load_error': 'Görevler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.',
      'start_error': 'Görev başlatılırken bir hata oluştu. Lütfen tekrar deneyin.',
      'end_error': 'Görev sonlandırılırken bir hata oluştu. Lütfen tekrar deneyin.',
      'delete_error': 'Görev silinirken bir hata oluştu. Lütfen tekrar deneyin.',
      'no_active_task_error': 'Aktif görev bulunamadı!'
    },
    en: {
      // Navbar
      'home': 'Home',
      'language': 'Language',
      
      // Form
      'new_task': 'Add New Task',
      'project_name': 'Project Name',
      'enter_project_name': 'Enter project name',
      'item_number': 'Item Number',
      'enter_item_number': 'Enter item number',
      'task_description': 'Task Description',
      'enter_task_description': 'Enter task description',
      'start_task': 'Start Task',
      'task_in_progress': 'Task in Progress',
      'end_task': 'End Task',
      'export_excel': 'Export to Excel',
      
      // Active Task
      'active_task': 'Active Task',
      
      // Tasks List
      'tasks': 'Tasks',
      'task_count': 'Tasks',
      'completed': 'Completed',
      'active': 'Active',
      'no_tasks': 'No tasks found',
      
      // Messages
      'loading': 'Loading...',
      'delete_confirmation': 'Are you sure you want to delete this task?',
      'task_exists_error': 'There is already an active task!',
      'required_fields_error': 'Please enter project name and task description!',
      'load_error': 'An error occurred while loading tasks. Please refresh the page.',
      'start_error': 'An error occurred while starting the task. Please try again.',
      'end_error': 'An error occurred while ending the task. Please try again.',
      'delete_error': 'An error occurred while deleting the task. Please try again.',
      'no_active_task_error': 'No active task found!'
    }
  };

  constructor() {
    // Tarayıcı dilini kontrol et
    const browserLang = navigator.language.split('-')[0] as Language;
    if (browserLang === 'en' || browserLang === 'tr') {
      this.currentLang.next(browserLang);
    }
  }

  setLanguage(lang: Language) {
    this.currentLang.next(lang);
  }

  translate(key: string): string {
    const currentLang = this.currentLang.value;
    return (this.translations[currentLang] as Record<string, string>)[key] || key;
  }
} 