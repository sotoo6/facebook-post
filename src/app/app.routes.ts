import { Routes } from '@angular/router';
import { FormPage } from './pages/form-page/form-page';
import { PostPage } from './pages/post-page/post-page';

export const routes: Routes = [
  {
    path: 'facebook-form',
    component: FormPage,
    title: 'Facebook Form'
  },
  {
    path: 'facebook-post',
    component: PostPage,
    title: 'Facebook Post'
  },
  {
    path: '**',
    redirectTo: 'facebook-form'
  }
];
