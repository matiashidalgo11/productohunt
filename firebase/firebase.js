import {initializeApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword} from 'firebase/auth';
import firebaseConfig from './config';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


    const app = initializeApp( firebaseConfig );

    const firebase = {
        auth: getAuth(),
        db: getFirestore(),
        storage : getStorage(app)
    }

    //Registra usuario
    export async function registrar(nombre, email, password){

        console.log("Estoy en registrar");

        await createUserWithEmailAndPassword(firebase.auth, email, password);

        return await updateProfile(firebase.auth.currentUser ,{
            displayName: nombre
        })
    };

    //Iniciar Sesion
    export async function login(email, password) {
        return signInWithEmailAndPassword(firebase.auth, email, password);
    }

    //Cierra la sesion del usuario
    export async function cerrarSesion() {
        await firebase.auth.signOut();
    }

export default firebase;
