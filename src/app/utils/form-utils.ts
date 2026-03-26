import { FormGroup, ValidationErrors } from "@angular/forms";

async function sleep() {
  return new Promise( resolve => {
    setTimeout(() => {
      resolve(true)
    }, 2500)
  })
}

export class FormUtils {

  // Expresiones regulares
  static userNamePattern = '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]{3,50}$'
  static nameAcountPattern = '^[a-zA-Z0-9._]{3,25}$'

  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'pattern':
          return `Error de patrón`

        case 'maxlength':
          return 'Supera el número de caracteres (150)';

        case 'minTags':
          return 'Debe haber mínimo 3 tags para poder crear la publicación';


        default:
          return `Error de validacion no controlado ${key}`
      }
    }

    return 'Error de validación desconocido';
  }

  static isValidName(form: FormGroup, fieldName: string): boolean {
    const control = form.get(fieldName);
    if (!control) return false;

    return !!control.errors && control.touched;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean {
    const control = form.get(fieldName);
    if (!control) return false;

    return !!control.errors && control.touched;
  }

  static isValidDescription(form: FormGroup, fieldName: string): boolean {
    const control = form.get(fieldName);
    if (!control) return false;

    return !!control.errors && control.touched;
  }

}
