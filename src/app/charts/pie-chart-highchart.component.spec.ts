import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartHighchartComponent } from './pie-chart-highchart.component';
import * as Highcharts from 'highcharts';
import { Component } from '@angular/core';
import { provideHighcharts } from 'highcharts-angular';

@Component({
  selector: 'host-component',
  template: `<app-pie-chart-highchart [data]="data"></app-pie-chart-highchart>`,
})
class HostComponent {
  data = [
    { year: 2000, winnerCount: 2 },
    { year: 2001, winnerCount: 3 },
  ];
}

describe('PieChartHighchartComponent', () => {
  let component: PieChartHighchartComponent;
  let fixture: ComponentFixture<PieChartHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartHighchartComponent],
      providers: [
        provideHighcharts({ instance: () => Promise.resolve(Highcharts) }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartHighchartComponent);
    component = fixture.componentInstance;
    component.data = [
      { year: 2000, winnerCount: 2 },
      { year: 2001, winnerCount: 3 },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a chart container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.pie-chart-wrapper')).toBeTruthy();
  });

  it('should update chart when data changes', () => {
    const spy = spyOn<any>(component, 'updateChart').and.callThrough();
    component.data = [
      { year: 2002, winnerCount: 5 },
      { year: 2003, winnerCount: 1 },
    ];
    component.ngOnChanges();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
