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
    // Busca en localStorage el post guardado desde el formulario
    const savedPosts: Post[] = this.facebookPostService.getPost();

    const lastIndex = savedPosts.length - 1;

    if (lastIndex >=0 ){
      const savedPost = (savedPosts.length > 0) ? savedPosts[lastIndex] : null;
      console.log(savedPost);

      // Si existe, lo convierte de texto a objeto
      if (savedPost) {
        // Como el JSON viene dentro de "post", cogemos solo esa parte
        this.data = savedPost
      }
    }
  }
}

