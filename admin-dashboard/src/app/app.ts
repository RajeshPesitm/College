import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar'; // <-- import this
import { RouterModule } from '@angular/router'; // ✅ Add this

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterModule,RouterOutlet], // ✅ This is crucial
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('admin-dashboard');
}

export class AppComponent {}