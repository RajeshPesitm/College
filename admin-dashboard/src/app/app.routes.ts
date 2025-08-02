import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: MainContentComponent,
    title: 'Dashboard',
  },
  {
    path: 'students',
    component: MainContentComponent,
    title: 'Students',
  },
  // Add more later (faculties, timetable, etc.)
];