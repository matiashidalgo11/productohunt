import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";

import { FirebaseContext } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

//Components
import Layout from '../../components/layout/Layout';
import Error404 from "../../components/layout/404";
import Boton from "../../components/ui/Boton";

import {css} from '@emotion/react';
import styled from '@emotion/styled';

import {formatDistanceToNow, subDays} from 'date-fns';
import { es } from 'date-fns/locale';

import {Campo, InputSubmit} from '../../components/ui/Formulario';
import { async } from "@firebase/util";

const ContenedorProducto = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`;
const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;


const Producto = (props) =>{

    //State del componente
    const [producto, setProducto] = useState('');
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({});
    const [consultarDB, setConsultarDB] = useState(true);

    //Router para obtener el id actual
    const router = useRouter();

    //Destructuramos y extraemos el id
    const {query: {id} } = router; 

    //Context
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if(id && consultarDB){

            const obtenerProducto = async () => {
            
                const docRef = doc(firebase.db, "productos", id);
                const docSnap = await getDoc(docRef);

                if(docSnap.data()){

                    setProducto(docSnap.data());
                    setConsultarDB(false);

                }else{
                    console.log('EL producto no existe');
                    setError(true);
                    setConsultarDB(false);
                }

            }

            obtenerProducto();
        }

    }, [id]);


    if(Object.keys(producto).length === 0 && !error) return <p>Cargando...</p>;

    const { comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos, creador, haVotado} =  producto;

    //Administrar y validar los votos
    const votarProducto = async () => {

        //Si el usuario no se encuentra logeado
        if(!usuario){
            return router.push('/login');
        }
        
        //Obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        //Verificar si el usuario actual ha votado
        if(haVotado.includes(usuario.uid) ) return;

        //Guardar el ID del usuario que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid];

        // Actualizar en la BD
        const docRef = doc(firebase.db, "productos", id);

        await updateDoc(docRef, {
            votos : nuevoTotal,
            haVotado: nuevoHaVotado
        })

        // Actualizar en el state

        setProducto({
            ...producto,
            votos: nuevoTotal
        });

        setConsultarDB(true);

    }

    //Funciones para crear comentarios
    const comentarioChange = e => {
        setComentario({
            ...comentario,
            [e.target.name] : e.target.value
        })
    }

    // Identificar si el comentario es el creador del producto

    const esCreador = id => {
        if(creador.id === id){
            return true;
        }
    }

    const agregarComentario = async e => {

        e.preventDefault();

        //Si el usuario no se encuentra logeado
        if(!usuario){
            return router.push('/login');
        }

        //Informacion al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // Tomar copia de comentarios y agregarlo al arreglo
        const nuevoComentarios = [...comentarios, comentario];

        //  Actualizar DB
        const docRef = doc(firebase.db, "productos", id);

        await updateDoc(docRef, {
            comentarios: nuevoComentarios
        })

        //  Actualizar el state
        setProducto({
            ...producto,
            comentarios: nuevoComentarios
        });

        setConsultarDB(true);

    }

    //Funcion que verifica que el creador del producto sea el mismo que esta autenticado
    const puedeBorrar = () =>{
        if(!usuario) return false;

        if(creador.id === usuario.uid) {
            return true;
        }
    }

    //Eliminar producto de la base de datos
    const eliminarProducto = async () => {

        if(!usuario) {
            return router.push('/login');
        }

        if(creador.id !== usuario.uid) {
            return router.push('/');
        }


        try{

            await deleteDoc(doc(firebase.db, "productos", id));
            router.push('/')


        } catch (error) {
            console.log('Error');
        }
    }

    return(

        <Layout>

            {error ? <Error404 /> :

                (
                    <div className="contenedor">
                        <h1 css={css(`
                                text-align: center ;
                                margin-top: 5rem ;
                        `)}>{nombre}</h1>
        
                        <ContenedorProducto>
                            <div>
                                <p>Publicado hace: {formatDistanceToNow(subDays(new Date(), 3), new Date(creado), { locale: es})}</p>
                                <img src={urlImagen} alt=''/>
                                <p>{descripcion}</p>
        
                                { usuario && (
                                    <>
        
                                        <h2>Agrega tu comentario</h2>
        
                                        <form onSubmit={agregarComentario}>
                                            <Campo>
                                                <input 
                                                    type='text'
                                                    name='mensaje'
                                                    onChange={comentarioChange}
                                                />
                                            </Campo>
        
                                            <InputSubmit
                                                type='submit'
                                                value='Agregar Comentario'
                                            />
        
                                        </form>
        
                                    
                                    </>
                                )}
        
                                <h2 css={css(`margin: 2rem 0;`)}>Comentarios</h2>
                                
                                {comentarios.length === 0 ? "Aun no hay comentarios" : (
        
                                    <ul>
        
                                        {comentarios.map((comentario, index) => (
                                            <li key={index}
                                                css={css(`
                                                        border: 1px solid #e1e1e1;
                                                        padding: 2rem;
                                                        `)}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por: 
                                                    <span
                                                        css={css(`
                                                            font-weight: bold;
                                                        `)}
                                                    >
                                                        {' '}{comentario.usuarioNombre}                                                
                                                    </span>
                                                </p>
                                                {esCreador(comentario.usuarioId) && 
                                                <CreadorProducto>Es creador</CreadorProducto>}
        
                                            </li>
                                        ))}
        
                                    </ul>
                                )}
        
        
        
                            </div>
        
                            <aside>
        
                                <div
                                    css={css(`
                                        margin-top: 5rem;
                                    `)}
                                >
                                    <Boton 
                                        target={'_black'}
                                        bgColor="true"
                                        href={url}
                                    > Visitar URL</Boton>
        
                                    <p>Publicado por: {creador.nombre} de {empresa}</p>
        
                                    <p css={css(`
                                        text-align: center;
                                    `)}>{votos} Votos</p>
        
                                    {usuario && (
                                        <Boton onClick={votarProducto}>
                                            Votar
                                        </Boton>
                                    )}
        
                                </div>
        
                            </aside>
                        </ContenedorProducto>

                        {puedeBorrar() && 
                            <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
                        }
                    </div>
                )
            }       

        </Layout>

    );
}

export default Producto;