import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'facebook-post',
  imports: [],
  templateUrl: './desktop-facebook-post.html',
})
export class DesktopFacebookPost {


  // Se inyecta HttpClient para leer el archivo JSON
  constructor(private http: HttpClient) { }

  // Aquí guardaremos el post ya preparado para la plantilla
  data: any = {
    author: {},
    time_created: '',
    visibility: '',
    text: '',
    media: {},
    stats: {
      reactions: {}
    },
    comments: []
  };

  ngOnInit(): void {
    // Busca en localStorage el post guardado desde el formulario
    const savedPost = localStorage.getItem('generatedPost');

    // Si existe, lo convierte de texto a objeto
    if (savedPost) {
      const parsedData = JSON.parse(savedPost);

      // Como el JSON viene dentro de "post", cogemos solo esa parte
      this.data = parsedData.post;
    }
  }
}

