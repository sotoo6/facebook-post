import { Routes } from '@angular/router';
import { DesktopFacebookPost } from './components/desktop-facebook-post/desktop-facebook-post';
import { FacebookForm } from './pages/facebook-form/facebook-form';

export const routes: Routes = [
  {
    path: 'desktop-post',
    component: DesktopFacebookPost,
    title: 'Facebook Desktop Post'
  },
  {
    path: 'facebook-form',
    component: FacebookForm,
    title: 'Facebook Form'
  },
  {
    path: '**',
    redirectTo: 'desktop-post'
  }
];
