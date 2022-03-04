import React, {useState, useContext} from 'react'
import Layout from '../components/layout/Layout';
import { css } from '@emotion/react';
import Router from 'next/router';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

//valiaciones
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

//Firebase
import { FirebaseContext } from '../firebase';

const STATE_INICIAL = {
  email: '',
  password: ''
}


export default function Login() {

  //Context
  const {login} = useContext(FirebaseContext);

  const [error, setError] = useState(false);

  const {valores, errores, handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const {email, password} = valores;

  async function iniciarSesion () {
    
    console.log('Iniciando Sesion...');

    try {

      const usuario = await login(email, password);
      Router.push('/');
      console.log(usuario);
      
    } catch (error){

      console.error("Hubo un error al autenticar el usuario", error.message);
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
          >Inicias Sesion</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >

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
                value='Iniciar Sesion'
              />

              {error && <Error>{error}</Error>}

          </Formulario>
        </>
      </Layout>
    </div>
  )
};

