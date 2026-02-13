import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements AfterViewInit {

  ngAfterViewInit() {

    this.createAccessChart();
    this.createAccessTypeChart();
    this.createDeviceStatusChart();

  }

  // 1️⃣ GRAFICA PRINCIPAL
  createAccessChart() {

    const ctx = document.getElementById('accessChart') as any;

    new Chart(ctx, {

      type: 'line',

      data: {

        labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],

        datasets: [{

          label: 'Accesos',

          data: [120, 190, 300, 250, 220, 310, 400],

          borderColor: '#3b82f6',

          backgroundColor: 'rgba(59,130,246,0.2)',

          tension: 0.4,

          fill: true

        }]

      },

      options: {

        responsive: true,

        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          }
        },

        scales: {

          x: {
            ticks: { color: 'white' }
          },

          y: {
            ticks: { color: 'white' }
          }

        }

      }

    });

  }


  // 2️⃣ TIPOS DE ACCESO
  createAccessTypeChart() {

    const ctx = document.getElementById('accessTypeChart') as any;

    new Chart(ctx, {

      type: 'doughnut',

      data: {

        labels: ['QR', 'Reconocimiento Facial', 'App', 'Código'],

        datasets: [{

          data: [45, 25, 20, 10],

          backgroundColor: [

            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444'

          ]

        }]

      },

      options: {

        responsive: true,

        plugins: {

          legend: {

            labels: {

              color: 'white'

            }

          }

        }

      }

    });

  }


  // 3️⃣ ESTADO DISPOSITIVOS
  createDeviceStatusChart() {

    const ctx = document.getElementById('deviceStatusChart') as any;

    new Chart(ctx, {

      type: 'bar',

      data: {

        labels: ['Online', 'Offline'],

        datasets: [{

          label: 'Dispositivos',

          data: [320, 22],

          backgroundColor: [

            '#10b981',
            '#ef4444'

          ]

        }]

      },

      options: {

        responsive: true,

        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          }
        },

        scales: {

          x: {
            ticks: { color: 'white' }
          },

          y: {
            ticks: { color: 'white' }
          }

        }

      }

    });

  }

}
