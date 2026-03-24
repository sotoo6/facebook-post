import { Component, input, output } from '@angular/core';
import { Post } from '../../models/post.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'post-created',
  imports: [DatePipe],
  templateUrl: './post-created.html',
})
export class PostCreated {

  // Input obligatorio que recibe el post que se va a mostrar
  post = input.required<Post>();

  // Evento que envía al componente padre el post seleccionado
  postSelected = output<Post>();

  // Emite al componente padre el post actual cuando se selecciona
  postSeleccionado(): void {
    this.postSelected.emit(this.post());
  }

}
