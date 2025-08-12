import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
// ...existing code...
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
// ...existing code...

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  title = 'outsera_test';
  isSmallScreen = false;
  isDarkTheme = false;

  private boundCheckScreen = this.checkScreen.bind(this);

  navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Lista de Filmes', path: '/movies' },
  ];

  ngOnInit() {
    this.checkScreen();
    window.addEventListener('resize', this.boundCheckScreen);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkTheme = true;
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundCheckScreen);
  }

  checkScreen() {
    this.isSmallScreen = window.innerWidth <= 1200;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.body.classList.add('theme-dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('theme-dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
