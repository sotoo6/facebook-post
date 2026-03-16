import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-desktop-facebook-post',
  imports: [JsonPipe],
  templateUrl: './desktop-facebook-post.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopFacebookPost {

  data: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('/data.json').subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        this.data = respuesta.post;
      },
      error: (err) => {
        console.error('Error cargando el JSON:', err);
      }
    });


  }
}

