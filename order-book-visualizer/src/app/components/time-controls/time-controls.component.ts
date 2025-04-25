import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-time-controls',
  standalone: true,
  templateUrl: './time-controls.component.html',
  styleUrls: ['./time-controls.component.scss']
})
export class TimeControlsComponent {
  @Input() maxIndex = 0;
  @Input() currentIndex = 0;
  @Input() isPlaying = false;

  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() select = new EventEmitter<number>();
  @Output() toggleReplay = new EventEmitter<void>();

  onSliderChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    this.select.emit(value);
  }
}
