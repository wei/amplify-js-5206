import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Amplify, { DataStore } from 'aws-amplify';
import awsExports from './aws-exports';
import { Product } from './models';
Amplify.configure(awsExports);

async function addProduct() {
  const newProduct = await DataStore.save(
    new Product({
      name: `Product_${Math.random()}`,
      owner: `Owner_${Math.random()}`,
      imageKey: `Image_${Math.random()}`
    })
  )

  return newProduct
}

async function removeImageFromProduct(id: string) {
  const product = await DataStore.query(Product, id)
  if (!product) {
    alert('Product not found')
    return null
  }

  const productCopy = Product.copyOf(product, updated => {
    updated.imageKey = undefined
  })

  const updatedProduct = await DataStore.save(
    productCopy
  )

  return updatedProduct
}

function App() {
  const [product, setProduct] = useState<Product | null>()

  useEffect(() => {
    (async() => {
      const p = await addProduct()
      setProduct(p)

      setTimeout(async () => {
        const updated_p = await removeImageFromProduct(p.id)
        setProduct(updated_p)
      }, 2000)
    })()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <pre>{JSON.stringify(product, null, 2)}</pre>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
