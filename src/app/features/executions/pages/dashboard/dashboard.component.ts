import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { DateNavigatorComponent } from '../../../../shared/components/date-navigator/date-navigator.component';
import { Columns } from '../../../../shared/components/table/table.models';
import { ActivityService } from 'src/app/features/planning/services/activity.service';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

interface TeamPerformance {
  name: string;
  completedTasks: number;
  efficiency: number;
  trend: number;
}

interface Incident {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  timestamp: Date;
  location: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    TableComponent,
    DateNavigatorComponent,
    TranslateModule,
    TranslatePipe
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('resourceChart') resourceChartRef!: ElementRef;
  private resourceChart: Chart | null = null;
  private activityService = inject(ActivityService);
  // Key metrics
  activeShipments = 0;
  shipmentTrend = 0;
  onTimeDelivery = 0;
  deliveryTrend = 0;
  resourceUtilization = 0;
  utilizationTrend = 0;

  // Chart data
  selectedTimePeriod = 'week';
  loadingIncidents = false;

  // Team performance data
  teamPerformance: TeamPerformance[] = [];

  // Recent incidents
  recentIncidents: Incident[] = [];
  incidentColumns: Columns[] = [
    {
      header: { key: 'description', label: 'Description' },
      cell: 'description',
      type: 'text',
      sortable: true,
      hide: { label: 'Description', visible: true }
    },
    {
      header: { key: 'severity', label: 'Severity' },
      cell: 'severity',
      type: 'status',
      sortable: true,
      hide: { label: 'Severity', visible: true }
    },
    {
      header: { key: 'status', label: 'Status' },
      cell: 'status',
      type: 'status',
      sortable: true,
      hide: { label: 'Status', visible: true }
    },
    {
      header: { key: 'location', label: 'Location' },
      cell: 'location',
      type: 'text',
      sortable: true,
      hide: { label: 'Location', visible: true }
    }
  ];

  constructor() {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    this.initResourceChart();
  }

  private loadDashboardData() {
    // Simulate loading data
    setTimeout(() => {
      // Key metrics
      this.activityService.getAllActivities().subscribe((activities) => {
        this.activeShipments = activities.length;
      });
      this.shipmentTrend = 12;
      this.onTimeDelivery = 94;
      this.deliveryTrend = 2;
      this.resourceUtilization = 87;
      this.utilizationTrend = -1;

      // Team performance
      this.teamPerformance = [
        {
          name: 'Warehouse Team',
          completedTasks: 245,
          efficiency: 92,
          trend: 5
        },
        {
          name: 'Transport Team',
          completedTasks: 189,
          efficiency: 88,
          trend: -2
        },
        {
          name: 'Operations Team',
          completedTasks: 312,
          efficiency: 95,
          trend: 8
        }
      ];

      // Recent incidents
      this.recentIncidents = [
        {
          id: '1',
          description: 'Delay in shipment processing',
          severity: 'medium',
          status: 'in-progress',
          timestamp: new Date(),
          location: 'Main Warehouse'
        },
        {
          id: '2',
          description: 'Vehicle maintenance required',
          severity: 'high',
          status: 'open',
          timestamp: new Date(),
          location: 'Transport Hub'
        },
        {
          id: '3',
          description: 'Inventory discrepancy',
          severity: 'low',
          status: 'resolved',
          timestamp: new Date(),
          location: 'Storage Area B'
        }
      ];
    }, 1000);
  }

  private initResourceChart() {
    const ctx = this.resourceChartRef.nativeElement.getContext('2d');

    this.resourceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Resource Usage',
            data: [65, 72, 68, 75, 82, 70, 85],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  viewAllIncidents() {
    // Implement navigation to incidents page
    console.log('View all incidents');
  }

  onIncidentSelect(incident: Incident) {
    // Handle incident selection
    console.log('Selected incident:', incident);
  }
}
