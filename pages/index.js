import React from 'react'
import Layout from '../components/layout/Layout';

//Components
import DetallesProducto from '../components/layout/DetallesProducto';

//Hook
import useProductos from '../hooks/useProductos';

export default function Home() {

  const { productos } = useProductos('creado');

  return (
    <div>
      <Layout>
        <div className='listado-productos'>
          <div className='contnedor'>
            <ul className='bg-white'>
              {productos.map((producto, index) => (
                <DetallesProducto 
                  key={index}
                  producto={producto}
                  />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
};
