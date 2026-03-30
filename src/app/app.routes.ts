import { Routes } from '@angular/router';
import { FormPage } from './pages/form-page/form-page';
import { PostPage } from './pages/post-page/post-page';
import { FormSelector } from './pages/form-selector/form-selector';

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
    path: 'form-selector',
    component: FormSelector,
    title: 'Form Selector'
  },
  {
    path: '**',
    redirectTo: 'facebook-form'
  }
];
