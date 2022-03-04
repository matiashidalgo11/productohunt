import React, {useContext, useState} from 'react'
import Layout from '../components/layout/Layout';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

//valiaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

//Firebase
import { FirebaseContext } from '../firebase';
import { collection, addDoc } from "firebase/firestore";

//Store
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

//Components
import Error404 from '../components/layout/404';

const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    urlImagen: '',
    url: '',
    descripcion: ''
}

export default function NuevoProducto() {
  
  //State de la imagen y url
  const [imagen, setImage] = useState(null);

  //State progreso upload image
  const[progress, setProgress] = useState(0);

  //State de errores con la firebase
  const [error, setError] = useState(false);
  
  //Validaciones
  const {valores, errores, handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  //Valores a validar
  const {nombre, empresa,  url, descripcion} = valores;

  //Hook de routing para redireccionar
  const router = useRouter();

  // Context con las operaciones crud de firebase
  const {usuario, firebase} = useContext(FirebaseContext);

  //Handle Image
  const handleImage = (e) => {
    setImage(e.target.files[0]);
  }

  async function crearProducto(){


    //Si el usuario no esta autenticado llevar al login
    if(!usuario) return router.push('/login');

    //Crear el objeto de nuevo producto
    const producto = {
        nombre,
        empresa,
        url,
        descripcion,
        votos: 0,
        comentarios: [],
        creado: Date.now(),
        creador: {
          id: usuario.uid,
          nombre: usuario.displayName
        },
        haVotado: []
    }

    //insertarlo en la bd
    try {
      
      const storageRef = ref(firebase.storage, `/imagesProductos/${imagen.name}`);

      const uploadImage = uploadBytesResumable(storageRef, imagen);

      uploadImage.on("state_changed",

      (snapshot) => {
        const progressPercent = Math.round( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 
      );
      setProgress(progressPercent);
      },
      (err) => {
        console.log(err);

      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {

          producto.urlImagen = downloadURL;
          const docRef = addDoc(collection(firebase.db, "productos"), producto);
          
        })
        .then(()=> {
          setProgress(0);
          console.log("Producto cargado!");
          return router.push('/');
        })
        ;
      }
      );
      

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }




  return (
    <div>
      <Layout>
        { !usuario ? <Error404/> : (

          <>
          <h1
            css={css(`
                text-align: center;
                margin-top: 5rem;
            `)}
          >Nuevo Producto</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >
            <fieldset>
              <legend>Informacion General</legend>
          
                <Campo>
                  <label htmlFor='nombre'>Nombre</label>
                  <input
                    type='text'
                    id='nombre'
                    placeholder='Nombre del Producto'
                    name='nombre'
                    value={nombre}
                    onChange={handleChange}

                  />
                </Campo>
                {errores.nombre && <Error>{errores.nombre}</Error>}

                <Campo>
                  <label htmlFor='empresa'>Empresa</label>
                  <input
                    type='text'
                    id='empresa'
                    placeholder='Tu Empresa'
                    name='empresa'
                    value={empresa}
                    onChange={handleChange}
                  />
                </Campo>
                {errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                  <label htmlFor='imagen'>Imagen</label>
                  <input
                    accept="image/*"
                    type='file'
                    id='imagen'
                    name='imagen'
                    onChange={handleImage}
                  />
                </Campo>
                {errores.imagen && <Error>{errores.imagen}</Error>}

                <Campo>
                  <label htmlFor='url'>URL</label>
                  <input
                    type='text'
                    id='url'
                    placeholder='URL del producto'
                    name='url'
                    value={url}
                    onChange={handleChange}
                  />
                </Campo>
                {errores.url && <Error>{errores.url}</Error>}
                
            </fieldset>

            <fieldset>
              <legend>Sobre tu Producto</legend>

                <Campo>
                    <label htmlFor='descripcion'>Descripcion</label>
                    <textarea
                      id='descripcion'
                      name='descripcion'
                      value={descripcion}
                      onChange={handleChange}
                    />
                </Campo>
                {errores.descripcion && <Error>{errores.descripcion}</Error>}

            </fieldset>


              <InputSubmit
                type='submit'
                value='Crear Producto'
              />

              {error && <Error>{error}</Error>}

          </Formulario>
          </>

        ) }
        
      </Layout>
    </div>
  )
};

