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
  // Evento que envía al componente padre el post que se va a eliminar
  postDeleted = output<Post>();

  // Variable para permitir mostrar el modal
  mostrarModal = false;

  // Emite al componente padre el post actual cuando se selecciona
  postSeleccionado(): void {
    this.postSelected.emit(this.post());
  }

  // Variable en true para mostrar modal
  abrirModal(): void {
    this.mostrarModal = true;
  }

  // Variable en false para ocular modal
  cerrarModal(): void {
    this.mostrarModal = false;
  }

  // Confirmar eliminacion y ocular modal
  confirmarEliminacion(): void {
    this.postDeleted.emit(this.post());
    this.cerrarModal();
  }
}
