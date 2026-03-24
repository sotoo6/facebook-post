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

  selectedPost: Post | null = null;

  onPostSelected(post: Post): void {
    this.selectedPost = post;
  }
}
