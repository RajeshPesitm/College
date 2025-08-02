import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  menuOpen = false;

  // Emit an event when a menu item is clicked to inform parent component
  @Output() pageSelected = new EventEmitter<string>();

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigate(page: string) {
    this.pageSelected.emit(page);
    this.menuOpen = false; // close menu after selection
  }
}