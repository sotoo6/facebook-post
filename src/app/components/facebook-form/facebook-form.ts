import { Component, effect, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../utils/form-utils';
import { Router, RouterLink } from '@angular/router';
import { Post } from '../../models/post.model';
import { FacebookPostService } from '../../services/facebook-post.service';
import { GeminiService } from '../../services/gemini.service';

const NOMBRES_RANDOM = ['Juan Pérez', 'Maria García', 'Carlos Ruiz', 'Ana López', 'Roberto G.'];
const AVATARES_RANDOM = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/46.jpg',
  'https://randomuser.me/api/portraits/women/24.jpg',
  'https://randomuser.me/api/portraits/men/1.jpg'
];

@Component({
  selector: 'facebook-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './facebook-form.html',
})
export class FacebookForm implements OnInit {

  // Se inyecta FormBuilder para crear el formulario reactivo
  fb = inject(FormBuilder);
  // Se inyecta Router para poder navegar entre páginas
  router = inject(Router);
  // Se inyecta el servicio que gestiona los posts guardados
  facebookPostService = inject(FacebookPostService);

  // Referencia a la clase de utilidades del formulario
  // Se usa para acceder a validaciones y métodos auxiliares
  formUtils = FormUtils;
  // Input que recibe un post si se quiere editar desde otro componente
  postToEdit = input<Post | null>(null);
  // Array donde se guardan los posts cargados desde localStorage
  posts: Post[] = [];
  // Array donde se almacenan los tags que añade el usuario
  tagsList: string[] = [];

  // Guarda la imagen de perfil en base64 para usarla o guardarla
  userImageBase64: string = '';
  // Guarda la URL temporal para mostrar la vista previa de la imagen de perfil
  previewUserImage: string = '';
  // Guarda el nombre y tamaño del archivo de imagen de perfil
  selectedUserImageName: string = '';

  // Guarda el archivo multimedia del post en base64
  postMediaBase64: string = '';
  // Guarda la URL temporal para mostrar la vista previa del archivo del post
  previewPostMedia: string = '';
  // Guarda el nombre y tamaño del archivo multimedia del post
  selectedPostMediaName: string = '';
  // Indica si el archivo del post es una imagen, un vídeo o ninguno
  postMediaType: 'image' | 'video' | '' = '';

  // Evento que avisa que el post esta listo
  @Output() postCreado = new EventEmitter<any>();

  cargando: boolean = false;

  constructor(private geminiService: GeminiService) {
    // Se ejecuta cuando cambia el postToEdit()
    effect(() => {
      // Guarda el post recibido
      const post = this.postToEdit();

      // Si no hay post, es que se va a crear uno nuevo
      if (!post) {
        // Resetea todos los valores del formulario
        this.myForm.reset({
          userName: '',
          userAcount: '',
          userImage: '',
          postMedia: '',
          description: '',
          tags: [],
          verified: false
        });

        // Reseteamos todos los valores de tag, imagen y media
        this.tagsList = [];
        this.userImageBase64 = '';
        this.previewUserImage = '';
        this.selectedUserImageName = '';
        this.postMediaBase64 = '';
        this.previewPostMedia = '';
        this.selectedPostMediaName = '';
        this.postMediaType = '';

        return;
      }

      // Si hya post, copia sus tags
      this.tagsList = [...post.tags];

      // Rellena los campos del formulario con datos del post enviado
      this.myForm.patchValue({
        userName: post.author.name,
        userAcount: post.author.username,
        userImage: post.author.avatar ? 'Imagen cargada' : '',
        postMedia: post.media?.file_base64 ? 'Archivo cargado' : '',
        description: post.text,
        verified: post.author.verified,
        tags: post.tags
      });


      // Guarda la imagen de perfil en base64
      this.userImageBase64 = post.author.avatar ?? '';
      // Muestra la vista previa de la imagen de perfil
      this.previewUserImage = post.author.avatar ?? '';
      // Muestra un texto indicando que la imagen de perfil ya está cargada
      this.selectedUserImageName = post.author.avatar ? 'Imagen cargada' : '';

      // Guarda el archivo multimedia del post en base64
      this.postMediaBase64 = post.media?.file_base64 ?? '';
      // Muestra la vista previa del archivo multimedia
      this.previewPostMedia = post.media?.file_base64 ?? '';
      // Muestra un texto indicando que el archivo multimedia ya está cargado
      this.selectedPostMediaName = post.media?.file_base64 ? 'Archivo cargado' : '';

     // Detecta si el archivo del post es una imagen o un vídeo
      if (post.media?.type.startsWith('image')) {
        this.postMediaType = 'image';
      } else if (post.media?.type.startsWith('video')) {
        this.postMediaType = 'video';
      } else {
        this.postMediaType = '';
      }

    });
  }

  printLocalStorageSizes(): void {
  const savedPosts = localStorage.getItem('generatedPost');

  if (!savedPosts) {
    console.log('No hay posts guardados en localStorage');
    return;
  }

  console.log('Tamaño total de generatedPost:', savedPosts.length);

  const posts: Post[] = JSON.parse(savedPosts);

  posts.forEach((post, i) => {
    console.log(`Post ${i}`);
    console.log('post entero:', JSON.stringify(post).length);

    if (post.author) {
      console.log('author:', JSON.stringify(post.author).length);
    }

    if (post.media) {
      console.log('media:', JSON.stringify(post.media).length);
    }

    if (post.comments) {
      console.log('comments:', JSON.stringify(post.comments).length);
    }
  });
}

  // Definición del formulario reactivo principal
  myForm = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern(FormUtils.userNamePattern)]],
    userAcount: ['', [Validators.required, Validators.pattern(FormUtils.nameAcountPattern)]],
    userImage: ['', Validators.required],
    postMedia: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(150)]],
    tags: this.fb.control<string[]>([], [Validators.required]),
    verified: [false],
  })

  ngOnInit(): void {
    // leemos posts preesxisgtentes del local storage
    // Busca en localStorage el post guardado desde el formulario
    const savedPosts = localStorage.getItem('generatedPost') || "[]";
    this.posts = JSON.parse(savedPosts);
    console.log(this.posts);
    this.printLocalStorageSizes();

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
    // Obtiene el input de tipo file que lanzó el evento
    const input = event.target as HTMLInputElement;
    // Guarda el primer archivo seleccionado
    const file = input.files?.[0];

    // Si no hay archivo seleccionado, limpia los datos y termina
    if (!file) {
      this.previewUserImage = '';
      this.selectedUserImageName = '';
      this.userImageBase64 = '';
      this.myForm.get('userImage')?.setValue('');
      return;
    }

    // Crea URL temporal para mostrar la vista previa de la img
    this.previewUserImage = URL.createObjectURL(file);

    // Guarda el nombre del archivo y su tamaño
    this.selectedUserImageName = `${file.name} [${this.formatFileSize(file.size)}]`;

    // Marca el camop como completado con el nombre del archivo
    this.myForm.get('userImage')?.setValue(file.name);

    // Guarda la imagen en base64
    this.userImageBase64 = await this.fileToBase64(file);

  }

  // Convierte el tamaño de un archivo a texto mas legible
  formatFileSize(bytes: number): string {
    // Si pesa menos de 1 KB, lo muestra en bytes
    if (bytes < 1024) return `${bytes} B`;
    // Si pesa menos de 1 MB, lo muestra en KB
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    // Si pesa mas de 1 MB, lo muestra en MB
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Se ejecuta cuando el usuario selecciona una imagen/video para el post
  async onPostMediaSelected(event: Event): Promise<void> {
    // Guarda el input de tipo file que lanzo el evento
    const input = event.target as HTMLInputElement;
    // Guarda el primer archivo seleccionado
    const file = input.files?.[0];

    // Si no hay archivo seleccionado, limpia los datos y termina
    if (!file) {
      this.previewPostMedia = '';
      this.selectedPostMediaName = '';
      this.postMediaBase64 = '';
      this.postMediaType = '';
      this.myForm.get('postMedia')?.setValue('');
      return;
    }

    // Si ya había una vista previa anterior, libera su URL temporal
    if (this.previewPostMedia) {
      URL.revokeObjectURL(this.previewPostMedia);
    }

    // Crea una URL temporal para mostrar la vista previa del archivo
    this.previewPostMedia = URL.createObjectURL(file);

    // Guarda el nombre del archivo junto con su tamaño
    this.selectedPostMediaName = `${file.name} [${this.formatFileSize(file.size)}]`;

    // Comprueba si el archivo es una imagen o un vídeo y guarda su tipo
    if (file.type.startsWith('image/')) {
      this.postMediaType = 'image';
    } else if (file.type.startsWith('video/')) {
      this.postMediaType = 'video';
    } else {
      this.postMediaType = '';
    }

    // Marca el campo del formulario como completado con el nombre del archivo
    this.myForm.get('postMedia')?.setValue(file.name);

    // Convierte el archivo a base64 para poder guardarlo o usarlo después
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

  getRandomShareds() {
    return Math.floor(Math.random() * 30) + 10;
  }

  // Calcula el id que tendrá el siguiente post
  getPostId(): number {
    // Busca en localStorage los posts guardados
    const savedPosts = localStorage.getItem('generatedPost');

    // Si no hay ningún post guardado, el primer id será 1
    if (!savedPosts) return 1;

    // Convierte el texto JSON en un array de posts
    const posts: Post[] = JSON.parse(savedPosts);

    // Si el array está vacío, el primer id será 1
    if (posts.length === 0 ) return 1;

    // Busca el id más alto de todos los posts guardados
    const maxId = Math.max(...posts.map(post => post.id));

    // Devuelve el siguiente id disponible
    return maxId + 1;
  }

  // Se ejecuta al enviar el formulario
  async onSubmit() {
    event?.preventDefault()

    // Marca todos los campos como tocados
    this.myForm.markAllAsTouched();
    // Guarda los tags actuales dentro del formulario
    this.myForm.get('tags')?.setValue(this.tagsList);
    // Revisa otra vez las validaciones de tags
    this.myForm.get('tags')?.updateValueAndValidity();

    // Si el formulario no es válido, se detiene
    if (this.myForm.invalid) return;

    // Servicio de Gemini inicio
    this.cargando = true; // Activamos estado de carga
    let comentariosIA: string[] = []

    try {
      // LLamamos al servicio usando los tags de tagsList
      // Si no hay tags, le pasamos la descripcion del post como alternativa
      const contexto = this.tagsList.length > 0 ? this.tagsList : [this.myForm.value.description || 'general'];

      comentariosIA = await this.geminiService.generarComentarios(contexto);

    } catch (error) {
      console.error("Error obteniendo comentarios de Gemini", error);
      // Comentario por defecto si falla la IA
      comentariosIA = ['¡Qué buen post!'];

    } finally {
      this.cargando = false;
    }

    // Servicio de Gemini fin

    // Guarda los valores del formulario
    const formValue = this.myForm.value;

    const editingPost = this.postToEdit();

    // Crea el JSON final
    const jsonData: Post = {
      id: editingPost ? editingPost.id : this.getPostId(),
      author: {
        name: formValue.userName || 'Anónimo',
        username: formValue.userAcount || 'Anónimo',
        verified: formValue.verified || false,
        avatar: this.userImageBase64
      },
      created_at: editingPost ? editingPost.created_at : new Date(),
      time_created: editingPost ? editingPost.time_created : '2 h',
      visibility: 'public',
      text: formValue.description || 'No tengo nada que decir',
      tags: this.tagsList,
      theme: 'General',
      media: {
        type: this.postMediaType,
        file_base64: this.postMediaBase64
      },
      likes: editingPost ? editingPost.likes : this.getRandomLikes(),
      numComments: comentariosIA.length,
      numShared: editingPost ? editingPost.numShared : this.getRandomShareds(),
      comments: comentariosIA.map( textoDeIA => ({
        author: NOMBRES_RANDOM[Math.floor(Math.random() * NOMBRES_RANDOM.length)],
        text: textoDeIA,
        avatar: AVATARES_RANDOM[Math.floor(Math.random() * AVATARES_RANDOM.length)],
      })

        )
    };

    // Añadimos el post al array de posts del local sotorage
    // this.posts.push(jsonData);

    // Guarda el post en localStorage
    // localStorage.setItem('generatedPost', JSON.stringify(this.posts));

    // Redirige a la pantalla del post
    // this.router.navigate(['/facebook-post']);

    // Si se ha editado se actualiza, sino se agrega
    if (editingPost) {
      this.facebookPostService.updatePost(jsonData);
    } else {
      this.facebookPostService.addPost(jsonData);
    }

    // Redirigimos al post
    this.router.navigate(['/facebook-post']);

  }

}
