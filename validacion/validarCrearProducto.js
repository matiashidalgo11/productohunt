export default function validarCrearProducto(valores){

    let errores = {};

    //Validar nombre del usuario
    if(!valores.nombre){
        errores.nombre = "El nombre es obligatorio";
    }

    //Validar Empresa
    if(!valores.empresa){
        errores.empresa = "El nombre de la empresa es requerida";
    }

    //Validar Url
    if(!valores.url){
        errores.empresa = "La URL del producto es obligatorio";
    }else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "URL no valido";
    }

    //Validar descripcion.
    if(!valores.descripcion) {
        errores.descripcion = "Agrega descripcion del producto";
    }

    return errores;

}