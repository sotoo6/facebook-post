import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';

@Component({
  selector: 'facebook-post',
  imports: [],
  templateUrl: './desktop-facebook-post.html',
})
export class DesktopFacebookPost implements OnInit {


  // Se inyecta HttpClient para leer el archivo JSON
  constructor(private http: HttpClient) { }

  // Aquí guardaremos el post ya preparado para la plantilla
  data: Post = {
    id: "",
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
    media: null,
    likes: 0,
    numComments: 0,
    numShared: 0,
    comments: []
  };

  ngOnInit(): void {
    // Busca en localStorage el post guardado desde el formulario
    const savedPosts = localStorage.getItem('generatedPost') || "";
    const savedPostsObject: Post[] = JSON.parse(savedPosts);
    const lastIndex = savedPostsObject.length - 1;

    if (lastIndex >=0 ){
      const savedPost = (savedPostsObject.length > 0) ? savedPostsObject[lastIndex] : null;
      console.log(savedPost);


      // Si existe, lo convierte de texto a objeto
      if (savedPost) {
        // Como el JSON viene dentro de "post", cogemos solo esa parte
        this.data = savedPost
      }
    }
  }
}

