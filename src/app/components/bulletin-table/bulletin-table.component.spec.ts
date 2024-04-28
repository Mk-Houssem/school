import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinTableComponent } from './bulletin-table.component';

describe('BulletinTableComponent', () => {
  let component: BulletinTableComponent;
  let fixture: ComponentFixture<BulletinTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletinTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
