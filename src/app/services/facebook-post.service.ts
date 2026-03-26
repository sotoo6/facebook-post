// import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../models/post.model';

// Carga los post en localStorage
const loadFromLocalStorage = (): Post[] => {
  const postFromLocalStorage = localStorage.getItem('generatedPost') ?? '[]';
  return JSON.parse(postFromLocalStorage);
}

@Injectable({providedIn: 'root'})
export class FacebookPostService {

  router = inject(Router);

  // Guarda el "historial" de posts del localStorage
  postHistory = signal<Post[]>(loadFromLocalStorage())

  // Cada vez que cambia postHistory, se vuelve a guardar en localStorage
  guardarPost = effect(() => {
    const historyString = JSON.stringify(this.postHistory());
    localStorage.setItem('generatedPost', historyString);
  });

  // Añade un nuevo post al array de posts
  addPost(post: Post): void {
    this.postHistory.update(posts => [...posts, post]);
  }

  // Devuelve el array de post almacenados
  getPost(): Post[] {
    return this.postHistory();
  }



}

