import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DesktopFacebookPost } from "../../components/desktop-facebook-post/desktop-facebook-post";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-post-page',
  imports: [DesktopFacebookPost],
  templateUrl: './post-page.html',
})
export class PostPage {

  router = inject(Router)
  postData: any = null;

  // Cuando se abre la pantalla, carga el post guardado
  ngOnInit(): void {
    const savedPost = localStorage.getItem('generatedPost');

    // Si hay datos guardados, los convierte de texto a objeto
    if (savedPost) {
      this.postData = JSON.parse(savedPost);
    }
  }

  rebootPost() {
    // Borra el localStorage
    localStorage.removeItem("generatedPost");

    // Redirige a la pantalla del post
    this.router.navigate(['/facebook-form']);
  }
}
