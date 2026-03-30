import { effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../models/post.model';

// Carga los posts desde localStorage
const loadFromLocalStorage = (): Post[] => {
  const postFromLocalStorage = localStorage.getItem('generatedPost') ?? '[]';
  return JSON.parse(postFromLocalStorage);
};

@Injectable({ providedIn: 'root' })
export class FacebookPostService {

  router = inject(Router);

  // Guarda el historial de posts en una signal
  postHistory = signal<Post[]>(loadFromLocalStorage());

  // Cada vez que cambia postHistory, se guarda automáticamente en localStorage
  guardarPost = effect(() => {
    const historyString = JSON.stringify(this.postHistory());
    localStorage.setItem('generatedPost', historyString);
  });

  selectedPost: Post | null = null;

  setSelectedPost(post: Post): void {
    this.selectedPost = post;
  }

  getSelectedPost(): Post | null {
    return this.selectedPost;
  }

  // Añade un nuevo post
  addPost(post: Post): void {
    this.postHistory.update(posts => [...posts, post]);
  }

  // Devuelve los posts actuales
  getPost(): Post[] {
    return this.postHistory();
  }

  // Actualiza un post existente buscando por id
  updatePost(updatedPost: Post): void {
    this.postHistory.update(posts =>
      posts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
    // ✅ Actualiza también el post seleccionado
    this.selectedPost = updatedPost;
  }
}
