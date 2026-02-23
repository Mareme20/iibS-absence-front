import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustifierDialog } from './justifier-dialog';

describe('JustifierDialog', () => {
  let component: JustifierDialog;
  let fixture: ComponentFixture<JustifierDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustifierDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustifierDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
