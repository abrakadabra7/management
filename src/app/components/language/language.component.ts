import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit, OnDestroy {
  currentLang: Language = 'tr';
  private langSubscription: Subscription | undefined;

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    // Dil değişikliklerini takip et
    this.langSubscription = this.languageService.currentLang$.subscribe(
      lang => this.currentLang = lang
    );
  }

  ngOnDestroy() {
    // Bellek sızıntısını önlemek için subscription'ı temizle
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  toggleLanguage() {
    // Mevcut dilin tersini seç
    const newLang: Language = this.currentLang === 'tr' ? 'en' : 'tr';
    this.languageService.setLanguage(newLang);
  }
} 