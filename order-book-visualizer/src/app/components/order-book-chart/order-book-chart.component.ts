import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { OrderLevel } from '../../models/snapshot.model';

@Component({
  selector: 'app-order-book-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './order-book-chart.component.html',
  styleUrls: ['./order-book-chart.component.scss']
})
export class OrderBookChartComponent implements OnChanges {
  @Input() bids: OrderLevel[] = [];
  @Input() asks: OrderLevel[] = [];

  private previousMaxVolume = 1;

  ngOnChanges(changes: SimpleChanges): void {
    const currentMax = this.calculateMaxVolume();
    const threshold = 100;

    if (Math.abs(currentMax - this.previousMaxVolume) > threshold) {
      this.previousMaxVolume = currentMax;
    }
  }

  private calculateMaxVolume(): number {
    const bidVolumes = this.bids.map(b => b.volume);
    const askVolumes = this.asks.map(a => a.volume);
    return Math.max(...bidVolumes, ...askVolumes, 1);
  }

  get chartData(): ChartData<'bar'> {
    return {
      labels: this.asks.map(a => a.price.toFixed(4)),
      datasets: [
        {
          label: 'Bids',
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          data: this.bids.map(b => -b.volume),
        },
        {
          label: 'Asks',
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          data: this.asks.map(a => a.volume),
        }
      ]
    };
  }

  get chartOptions(): ChartOptions<'bar'> {
    return {
      responsive: true,
      animation: {
        duration: 400,
        easing: 'easeOutCubic'
      },
      indexAxis: 'y',
      scales: {
        x: {
          min: -this.previousMaxVolume,
          max: this.previousMaxVolume,
          stacked: true,
          title: {
            display: true,
            text: 'Volume'
          },
          ticks: {
            callback: (value) => Math.abs(Number(value)).toString()
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Price'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const volume = Math.abs(context.raw as number);
              return `${context.dataset.label}: ${volume}`;
            }
          }
        }
      }
    };
  }
}
