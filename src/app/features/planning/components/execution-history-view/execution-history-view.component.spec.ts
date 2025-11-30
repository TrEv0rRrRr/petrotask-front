import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionHistoryViewComponent } from './execution-history-view.component';

describe('ExecutionHistoryViewComponent', () => {
  let component: ExecutionHistoryViewComponent;
  let fixture: ComponentFixture<ExecutionHistoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionHistoryViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutionHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
