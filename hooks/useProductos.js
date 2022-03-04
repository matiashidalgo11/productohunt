import React, {useState, useEffect, useContext} from 'react';
import { FirebaseContext } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const useProductos = orden => {

    //State de productos
    const [productos, setProductos] = useState([]);
    
    const {firebase} = useContext(FirebaseContext);
    
    useEffect(() =>{
    
        const obtenerProductos =  () => {
    
        const refCollection = collection(firebase.db, "productos");
        const q = query(refCollection, orderBy(orden, 'desc'));
        onSnapshot(q, (manejarSnapshot));
        }
    
        obtenerProductos();
    },[])
    
    function manejarSnapshot(snapshot) {
        const productos = snapshot.docs.map(doc => {
        return {
            id: doc.id,
            ...doc.data()
        }
        });
    
        setProductos(productos);
    }

    return {
        productos
    }

}

export default useProductos;