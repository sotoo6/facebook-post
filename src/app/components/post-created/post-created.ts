import { Component, input, output } from '@angular/core';
import { Post } from '../../models/post.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'post-created',
  imports: [DatePipe],
  templateUrl: './post-created.html',
})
export class PostCreated {

  post = input.required<Post>();
  postSelected = output<Post>();

  postSeleccionado(): void {
    this.postSelected.emit(this.post());
  }

}
