import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Filters } from './shared/components/filters/filters';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Filters],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('habitabia-fronted');
}
