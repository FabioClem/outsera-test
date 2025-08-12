import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let originalInnerWidth: number;
  let originalLocalStorage: Storage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    originalInnerWidth = window.innerWidth;
    originalLocalStorage = window.localStorage;
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalInnerWidth,
    });
    window.localStorage.clear();
    document.body.classList.remove('theme-dark');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isSmallScreen true if width <= 1200', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 800,
    });
    component.checkScreen();
    expect(component.isSmallScreen).toBeTrue();
  });

  it('should set isSmallScreen false if width > 1200', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1300,
    });
    component.checkScreen();
    expect(component.isSmallScreen).toBeFalse();
  });

  it('should toggle theme and update body class/localStorage', () => {
    component.isDarkTheme = false;
    component.toggleTheme();
    expect(component.isDarkTheme).toBeTrue();
    expect(document.body.classList.contains('theme-dark')).toBeTrue();
    expect(window.localStorage.getItem('theme')).toBe('dark');
    component.toggleTheme();
    expect(component.isDarkTheme).toBeFalse();
    expect(document.body.classList.contains('theme-dark')).toBeFalse();
    expect(window.localStorage.getItem('theme')).toBe('light');
  });

  it('should set dark theme on ngOnInit if saved in localStorage', () => {
    window.localStorage.setItem('theme', 'dark');
    component.ngOnInit();
    expect(component.isDarkTheme).toBeTrue();
    expect(document.body.classList.contains('theme-dark')).toBeTrue();
  });

  it('should remove dark theme on ngOnInit if not saved', () => {
    window.localStorage.setItem('theme', 'light');
    component.ngOnInit();
    expect(component.isDarkTheme).toBeFalse();
    expect(document.body.classList.contains('theme-dark')).toBeFalse();
  });

  it('should open and close mobile menu', () => {
    component.isMobileMenuOpen = false;
    component.isMobileMenuOpen = true;
    expect(component.isMobileMenuOpen).toBeTrue();
    component.isMobileMenuOpen = false;
    expect(component.isMobileMenuOpen).toBeFalse();
  });

  it('should have navLinks for Dashboard and Lista de Filmes', () => {
    expect(
      component.navLinks.some(
        (l) => l.label === 'Dashboard' && l.path === '/dashboard'
      )
    ).toBeTrue();
    expect(
      component.navLinks.some(
        (l) => l.label === 'Lista de Filmes' && l.path === '/movies'
      )
    ).toBeTrue();
  });
});
