import { Component } from '@angular/core';
import { FacebookForm } from '../../components/facebook-form/facebook-form';
import { SelectPost } from "../../components/select-post/select-post";
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-form-page',
  imports: [FacebookForm, SelectPost],
  templateUrl: './form-page.html',
})
export class FormPage {

  // Guarda el post que el usuario ha seleccionado
  selectedPost: Post | null = null;

  // Asigna a selectedPost el post en el que se hizo clic
  onPostSelected(post: Post | null): void {
    this.selectedPost = post;
  }

}
