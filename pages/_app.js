import App from 'next/app';
import {FirebaseContext} from '../firebase';
import firebase, { registrar, login, cerrarSesion } from '../firebase/firebase';
import useAutenticacion from '../hooks/useAutenticacion';

const MyApp = (props) => {

    const usuario = useAutenticacion();
    console.log(usuario);

    const {Component, pageProps} = props;
    
    return(
        <FirebaseContext.Provider
            value={{
                firebase,
                registrar,
                login,
                cerrarSesion,
                usuario
            }}
        >
            <Component {...pageProps} />
            
        </FirebaseContext.Provider>
    );
}

export default MyApp;