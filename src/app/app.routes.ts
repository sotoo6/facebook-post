import { Routes } from '@angular/router';
import { DesktopFacebookPost } from './components/desktop-facebook-post/desktop-facebook-post';

export const routes: Routes = [
  {
    path: 'desktop-post',
    component: DesktopFacebookPost,
    title: 'Facebook Desktop Post'
  },
  {
    path: '**',
    redirectTo: 'desktop-post'
  }
];
