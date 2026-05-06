import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { AppComponent } from './app.component';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: any;
  let router: any;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    routerEventsSubject = new Subject();
    
    const mockRouter = {
      url: '/',
      events: routerEventsSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with showFooter as false', () => {
    fixture.detectChanges();
    expect(component.showFooter).toBeFalsy();
  });

  it('should hide footer on login route', () => {
    router.url = '/login';
    component.ngOnInit();
    expect(component.showFooter).toBeFalsy();
  });

  it('should hide footer on signup route', () => {
    router.url = '/signup';
    component.ngOnInit();
    expect(component.showFooter).toBeFalsy();
  });

  it('should hide footer on kyc route', () => {
    router.url = '/kyc';
    component.ngOnInit();
    expect(component.showFooter).toBeFalsy();
  });

  it('should hide footer on home route', () => {
    router.url = '/';
    component.ngOnInit();
    expect(component.showFooter).toBeFalsy();
  });

  it('should show footer on dashboard route', () => {
    router.url = '/dashboard/portfolio';
    component.ngOnInit();
    expect(component.showFooter).toBeTruthy();
  });

  it('should show footer on other routes', () => {
    router.url = '/pages/products/government-bonds';
    component.ngOnInit();
    expect(component.showFooter).toBeTruthy();
  });

  it('should update footer visibility on route change', (done) => {
    component.ngOnInit();
    
    // Simulate navigation to dashboard
    router.url = '/dashboard/portfolio';
    routerEventsSubject.next(new NavigationEnd(1, '/dashboard/portfolio', '/dashboard/portfolio'));
    
    setTimeout(() => {
      expect(component.showFooter).toBeTruthy();
      done();
    }, 100);
  });

  it('should hide footer on navigation to login', (done) => {
    component.ngOnInit();
    
    // Simulate navigation to login
    router.url = '/login';
    routerEventsSubject.next(new NavigationEnd(1, '/login', '/login'));
    
    setTimeout(() => {
      expect(component.showFooter).toBeFalsy();
      done();
    }, 100);
  });
});

