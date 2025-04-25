import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderBookService } from './services/order-book.service';
import { OrderBookSnapshot } from './models/snapshot.model';
import { OrderBookChartComponent } from './components/order-book-chart/order-book-chart.component';
import { TimeControlsComponent } from './components/time-controls/time-controls.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, OrderBookChartComponent, TimeControlsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private service = inject(OrderBookService);

  snapshots = signal<OrderBookSnapshot[]>([]);
  currentSnapshot = signal<OrderBookSnapshot | null>(null);
  loading = signal(true);

  currentIndex = 0;
  isPlaying = false;
  replayTimeout: any;

  get bids() {
    const snapshot = this.currentSnapshot();
    if (!snapshot) return [];
    return Array.from({ length: 10 }, (_, i) => ({
      price: snapshot[`Bid${i + 1}`],
      volume: snapshot[`Bid${i + 1}Size`]
    }));
  }

  get asks() {
    const snapshot = this.currentSnapshot();
    if (!snapshot) return [];
    return Array.from({ length: 10 }, (_, i) => ({
      price: snapshot[`Ask${i + 1}`],
      volume: snapshot[`Ask${i + 1}Size`]
    }));
  }

  ngOnInit() {
    this.service.loadSnapshots().subscribe((data) => {
      this.snapshots.set(data);
      this.currentSnapshot.set(data[0]);
      this.loading.set(false);
    });
  }

  onPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentSnapshot.set(this.snapshots()[this.currentIndex]);
    }
  }

  onNext() {
    if (this.currentIndex < this.snapshots().length - 1) {
      this.currentIndex++;
      this.currentSnapshot.set(this.snapshots()[this.currentIndex]);
    }
  }

  onSelect(index: number) {
    this.currentIndex = index;
    this.currentSnapshot.set(this.snapshots()[index]);
  }

  toggleReplay() {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.startReplay();
    } else {
      clearTimeout(this.replayTimeout);
    }
  }

  startReplay() {
    const snapshots = this.snapshots();
    const times = snapshots.map(s => new Date(`1970-01-01T${s.Time}Z`).getTime());

    const deltas = times.slice(1).map((t, i) => t - times[i]);
    const totalOriginal = deltas.reduce((a, b) => a + b, 0);

    const scaledDelays = deltas.map(d => (d / totalOriginal) * 30000);

    const replayStep = (index: number) => {
      if (index >= snapshots.length) {
        this.isPlaying = false;
        return;
      }
      this.currentIndex = index;
      this.currentSnapshot.set(snapshots[index]);

      if (index < scaledDelays.length) {
        this.replayTimeout = setTimeout(() => {
          replayStep(index + 1);
        }, scaledDelays[index]);
      }
    };

    replayStep(0);
  }
}
