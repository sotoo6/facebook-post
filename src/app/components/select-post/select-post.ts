import { Component, inject, output } from '@angular/core';
import { PostCreated } from "../post-created/post-created";
import { Post } from '../../models/post.model';
import { FacebookPostService } from '../../services/facebook-post.service';

@Component({
  selector: 'select-post',
  imports: [PostCreated],
  templateUrl: './select-post.html',
})
export class SelectPost {

  facebookPostService = inject(FacebookPostService);

  // Evento que envia el post seleccionado
  postSelected = output<Post>();

  // Array de posts guardados
  savedPosts: Post[] = [];

  // Guarda el post seleccionado actualmente
  selectedPost: Post | null = null;

  ngOnInit(): void {
    // Carga los post desde el servicio
    this.savedPosts = this.facebookPostService.getPost();

    // Si hay post, selecciona el primero por defecto
    if (this.savedPosts.length > 0) {
      this.selectedPost = this.savedPosts[0];
    }
  }

  selectPost(post: Post): void {
    // Actualiza el post seleccionado
    this.selectedPost = post;
    // Envia el post seleccionado al componente padre
    this.postSelected.emit(post);
  }

}
