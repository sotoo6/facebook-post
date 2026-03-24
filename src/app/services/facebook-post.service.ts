// import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../models/post.model';

const loadFromLocalStorage = (): Post[] => {
  const postFromLocalStorage = localStorage.getItem('generatedPost') ?? '[]';
  const posts = JSON.parse(postFromLocalStorage);

  return posts;

}

@Injectable({providedIn: 'root'})
export class FacebookPostService {

  router = inject(Router);

  postHistory = signal<Post[]>(loadFromLocalStorage())

  guardarPost = effect(() => {
    const historyString = JSON.stringify(this.postHistory());
    localStorage.setItem('generatedPost', historyString);
  });

  addPost(post: Post): void {
    this.postHistory.update(posts => [...posts, post]);
  }

  getPost(): Post[] {
    return this.postHistory();
  }

}

