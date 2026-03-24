import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../utils/form-utils';
import { Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { FacebookPostService } from '../../services/facebook-post.service';

@Component({
  selector: 'facebook-form',
  imports: [ReactiveFormsModule],
  templateUrl: './facebook-form.html',
})
export class FacebookForm implements OnInit {

  // variable para guardar los post del localstorage
  posts: Post[] = [];

  // Se inyecta FormBuilder para crear el formulario reactivo
  fb = inject(FormBuilder);
  router = inject(Router);
  facebookPostService = inject(FacebookPostService);

  // Referencia a la clase de utilidades del formulario
  // Se usa para acceder a validaciones y métodos auxiliares
  formUtils = FormUtils;

  // Array donde se guardan los tags que va añadiendo el usuario
  tagsList: string[] = [];

  // Guarda la imagen de perfil convertida a base64
  userImageBase64: string = '';
  previewUserImage: string = '';
  selectedUserImageName: string = '';

  // Guarda el archivo del post en base64
  postMediaBase64: string = '';

  // Guarda el tipo de archivo: image o video
  previewPostMedia: string = '';
  selectedPostMediaName: string = '';
  postMediaType: 'image' | 'video' | '' = '';




  postToEdit = input<Post | null>(null);



  // Definición del formulario reactivo principal
  myForm = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern(FormUtils.userNamePattern)]],
    userAcount: ['', [Validators.required, Validators.pattern(FormUtils.nameAcountPattern)]],
    userImage: ['', Validators.required],
    postMedia: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(150)]],
    tags: this.fb.control<string[]>([], [Validators.required]),
    verified: [false]
  })

  ngOnInit(): void {
    // leemos posts preesxisgtentes del local storage
    // Busca en localStorage el post guardado desde el formulario
    const savedPosts = localStorage.getItem('generatedPost') || "[]";
    this.posts = JSON.parse(savedPosts);
    console.log(this.posts);

  }

  // Agregar nuevo tag
  addTag(event?: KeyboardEvent) {
    event?.preventDefault();

    let newTag = '';

    // Si ya existe ese tag, no se crea otro
    if (this.tagsList.includes(newTag.toLowerCase())) {
      return;
    }

    // Si no existe el tag, se pone en minúsculas
    this.tagsList.push(newTag.toLowerCase());

    // Actualiza el campo tags con la lista actual de etiquetas
    this.myForm.get('tags')?.setValue(this.tagsList);
    // Marca el campo como tocado para que se muestren los errores si los hay
    this.myForm.get('tags')?.markAsTouched();
    // Vuelve a comprobar si el campo cumple las validaciones
    this.myForm.get('tags')?.updateValueAndValidity();

  }

  removeTag(tag: string): void {
    // Elimina de la lista el tag seleccionado
    this.tagsList = this.tagsList.filter(t => t !== tag);

    // Actualiza el campo tags con la lista actual de etiquetas
    this.myForm.get('tags')?.setValue(this.tagsList);
    // Marca el campo como tocado para que se muestren los errores si los hay
    this.myForm.get('tags')?.markAsTouched();
    // Vuelve a comprobar si el campo cumple las validaciones
    this.myForm.get('tags')?.updateValueAndValidity();
  }

  addTagFromButton(input: HTMLInputElement): void {
    // Guarda el texto escrito en el input quitando los espacios al principio y al final
    const value = input.value.trim();

    // Si el campo está vacío, no hace nada
    if (!value) return;

    // Si ese tag ya existe en la lista, no lo vuelve a añadir
    if (this.tagsList.includes(value.toLowerCase())) return;

    // Añade el nuevo tag a la lista en minúsculas
    this.tagsList.push(value.toLowerCase());

    // Actualiza el campo tags con la lista actual de etiquetas
    this.myForm.get('tags')?.setValue(this.tagsList);
    // Marca el campo como tocado para que se muestren los errores si los hay
    this.myForm.get('tags')?.markAsTouched();
    // Vuelve a comprobar si el campo cumple las validaciones
    this.myForm.get('tags')?.updateValueAndValidity();

    input.value = '';
  }

  // Convierte un archivo de imagen en una cadena base64
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Lee el archivo como una URL en base64
      reader.readAsDataURL(file);

      // Si todo sale bien, devuelve el resultado
      reader.onload = () => resolve(reader.result as string);

      // Si hay un error, lo devuelve
      reader.onerror = error => reject(error);
    });
  }

  // Se ejecuta cuando el usuario selecciona la imagen de perfil
  async onUserImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    // Si no hay archivo, no hace nada
    if (!file) {
      this.previewUserImage = '';
      this.selectedUserImageName = '';
      this.userImageBase64 = '';
      this.myForm.get('userImage')?.setValue('');
      return;
    }

    // Para mostrar la imagen
    this.previewUserImage = URL.createObjectURL(file);

    // Para enseñar el nombre y tamaño
    this.selectedUserImageName = `${file.name} [${this.formatFileSize(file.size)}]`;

    // Para guardar en el formulario
    this.myForm.get('userImage')?.setValue(file.name);

    // Para guardar la imagen en base64
    this.userImageBase64 = await this.fileToBase64(file);

  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Guarda la imagen o vídeo del post en base64
  async onPostMediaSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    // Si no hay archivo, se detiene
    if (!file) {
      this.previewPostMedia = '';
      this.selectedPostMediaName = '';
      this.postMediaBase64 = '';
      this.postMediaType = '';
      this.myForm.get('postMedia')?.setValue('');
      return;
    }

    if (this.previewPostMedia) {
      URL.revokeObjectURL(this.previewPostMedia);
    }

    // Para mostrar la imagen
    this.previewPostMedia = URL.createObjectURL(file);

    // Para enseñar el nombre y tamaño
    this.selectedPostMediaName = `${file.name} [${this.formatFileSize(file.size)}]`;

    // Guarda si es imagen o vídeo
    if (file.type.startsWith('image/')) {
      this.postMediaType = 'image';
    } else if (file.type.startsWith('video/')) {
      this.postMediaType = 'video';
    } else {
      this.postMediaType = '';
    }

    // Marca el campo como completado
    this.myForm.get('postMedia')?.setValue(file.name);

    // Convierte el archivo a base64
    this.postMediaBase64 = await this.fileToBase64(file);
  }

  // Descarga el objeto como archivo JSON
  downloadJson(data: any): void {
    // Convierte el objeto a texto JSON
    const json = JSON.stringify(data, null, 2);

    // Crea un archivo JSON
    const blob = new Blob([json], { type: 'application/json' });

    // Crea una URL temporal
    const url = window.URL.createObjectURL(blob);

    // Crea un enlace temporal para descargar
    const a = document.createElement('a');
    a.href = url;
    a.download = 'post.json';
    a.click();

    // Libera la URL
    window.URL.revokeObjectURL(url);
  }

  getRandomLikes() {
    return Math.floor(Math.random() * 5000) + 300;
  }

  getRandomComments() {
    return Math.floor(Math.random() * 6) + 2;
  }

  getRandomShareds() {
    return Math.floor(Math.random() * 30) + 10;
  }

  getPostId(): number {
    const savedPosts = localStorage.getItem('generatedPost');

    if (!savedPosts) return 1;

    const posts: Post[] = JSON.parse(savedPosts);

    if (posts.length === 0 ) return 1;

    const maxId = Math.max(...posts.map(post => post.id));

    return maxId + 1;

  }

  // Se ejecuta al enviar el formulario
  onSubmit() {
    event?.preventDefault()

    // Marca todos los campos como tocados
    this.myForm.markAllAsTouched();

    // Guarda los tags actuales dentro del formulario
    this.myForm.get('tags')?.setValue(this.tagsList);

    // Revisa otra vez las validaciones de tags
    this.myForm.get('tags')?.updateValueAndValidity();

    // Si el formulario no es válido, se detiene
    if (this.myForm.invalid) return;

    // Guarda los valores del formulario
    const formValue = this.myForm.value;

    // Crea el JSON final
    const jsonData: Post = {
        id: this.getPostId(),
        author: {
          name: formValue.userName || 'Anónimo',
          username: formValue.userAcount || 'Anónimo',
          verified: formValue.verified || false,
          avatar: this.userImageBase64
        },
        created_at: new Date(),
        time_created: "2 h",
        visibility: "public",
        text: formValue.description || 'No tengo nada que decir',
        tags: this.tagsList,
        theme: "General",
        media: {
          type: this.postMediaType,
          file_base64: this.postMediaBase64
        },
        likes: this.getRandomLikes(),
        numComments: this.getRandomComments(),
        numShared: this.getRandomShareds(),
        comments: [
          {
            author: 'Cristina Otero',
            text: 'Qué sitio tan bonito, transmite una paz increíble 🌿✨',
            likes: 2,
            avatar: this.userImageBase64
          }
        ]
    };

    // Añadimos el post al array de posts del local sotorage
    // this.posts.push(jsonData);

    // Guarda el post en localStorage
    // localStorage.setItem('generatedPost', JSON.stringify(this.posts));

    // Redirige a la pantalla del post
    // this.router.navigate(['/facebook-post']);

    this.facebookPostService.addPost(jsonData);
    this.router.navigate(['/facebook-post']);

  }

}
