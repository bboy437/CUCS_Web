import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/pages' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
