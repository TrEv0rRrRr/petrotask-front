import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';
import { MenuService } from '../../services/menu.service';
import { of } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let menuServiceSpy: jasmine.SpyObj<MenuService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MenuService', ['getMenuItems']);
    spy.getMenuItems.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
      providers: [{ provide: MenuService, useValue: spy }]
    }).compileComponents();

    menuServiceSpy = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
