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

  postSelected = output<Post>();

  savedPosts: Post[] = [];
  selectedPost: Post | null = null;

  ngOnInit(): void {
    this.savedPosts = this.facebookPostService.getPost();

    if (this.savedPosts.length > 0) {
      this.selectedPost = this.savedPosts[0];
    }
  }

  selectPost(post: Post): void {
    this.selectedPost = post;
    this.postSelected.emit(post);
  }

}
