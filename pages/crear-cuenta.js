import React, {useContext, useState} from 'react'
import Layout from '../components/layout/Layout';
import { css } from '@emotion/react';
import Router from 'next/router';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

//valiaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

//Firebase
import { FirebaseContext } from '../firebase';

const STATE_INICIAL = {
    nombre: '',
    email: '',
    password: ''
}


export default function CrearCuenta() {

  //Usar context
  const {registrar} = useContext(FirebaseContext);

  const [error, setError] = useState(false);

  const {valores, errores, handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const {nombre, email, password} = valores;

  async function crearCuenta(){

    console.log("Estoy en crear Cuenta");

    try{

      await registrar(nombre, email, password);
      Router.push('/');

    } catch (error){

      console.error("Hubo un error al crear el usuario", error.message);
      setError(error.message);

    }
  }

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css(`
                text-align: center;
                margin-top: 5rem;
            `)}
          >CrearCuenta</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >
              <Campo>
                <label htmlFor='nombre'>Nombre</label>
                <input
                  type='text'
                  id='nombre'
                  placeholder='Tu Nombre'
                  name='nombre'
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.nombre && <Error>{errores.nombre}</Error>}

              <Campo>
                <label htmlFor='email'>Email</label>
                <input
                  type='text'
                  id='email'
                  placeholder='Tu Email'
                  name='email'
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.email && <Error>{errores.email}</Error>}

              <Campo>
                <label htmlFor='password'>Password</label>
                <input
                  type='text'
                  id='password'
                  placeholder='Tu Password'
                  name='password'
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.password && <Error>{errores.password}</Error>}

              <InputSubmit
                type='submit'
                value='Crear Cuenta'
              />

              {error && <Error>{error}</Error>}

          </Formulario>
        </>
      </Layout>
    </div>
  )
};
