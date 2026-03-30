import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { FacebookPostService } from '../../services/facebook-post.service';

@Component({
  selector: 'facebook-post',
  imports: [],
  templateUrl: './desktop-facebook-post.html',
})
export class DesktopFacebookPost implements OnInit {

  facebookPostService = inject(FacebookPostService)

  // Se inyecta HttpClient para leer el archivo JSON
  constructor(private http: HttpClient) { }

  // Aquí guardaremos el post ya preparado para la plantilla
  data: Post = {
    id: 0,
    created_at: new Date(),
    tags: [],
    author: {
      name: '',
      username: '',
      verified: false,
      avatar: null
    },
    time_created: '',
    visibility: '',
    text: '',
    theme: '',
    media: null,
    likes: 0,
    numComments: 0,
    numShared: 0,
    comments: []
  };

  ngOnInit(): void {
    const selectedPost = this.facebookPostService.getSelectedPost();

    if (selectedPost) {
      this.data = selectedPost;
      return;
    }

    // Fallback: si no hay seleccionado, coge el último (para accesos directos a la ruta)
    const savedPosts = this.facebookPostService.getPost();
    if (savedPosts.length > 0) {
      this.data = savedPosts[savedPosts.length - 1];
    }
  }
}

