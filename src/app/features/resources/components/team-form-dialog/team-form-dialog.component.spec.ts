import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamFormDialogComponent } from './team-form-dialog.component';

describe('TeamFormDialogComponent', () => {
  let component: TeamFormDialogComponent;
  let fixture: ComponentFixture<TeamFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
