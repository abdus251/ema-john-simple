import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Products/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';
import { key } from 'localforage';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [cart, setCart] = useState([])
    const { totalProducts } = useLoaderData();

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    // 
    // 
    // 
    // 


    const pageNumbers = [...Array(totalPages).keys()];




    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, []);

    useEffect(() => {
        const storedCart = getShoppingCart();
        // console.log(storedCart)
    }, [])
    const handleAddToCart = (product) => {
        // cart.push(product);
        const newCart = [...cart, product];
        setCart(newCart);
        // console.log(newCart,"newCart")
        addToDb(product._id)
    }
    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }




    const options = [5, 10, 20];
    function handleSelectChange(event) {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(0);
    }

    return (
        <>
            <div className='shop-container'>
                <div className="products-container">
                    {
                        products.map(product => <Product
                            key={product._id}
                            product={product}
                            handleAddToCart={handleAddToCart}
                        ></Product>)
                    }
                </div>
                <div className="cart-container">
                    <Cart cart={cart}
                        handleClearCart={handleClearCart}
                    >
                        <Link to="/orders">
                            <button className='btn-proceed'>Rewiew Order
                            </button>
                        </Link>
                    </Cart>
                </div>
            </div>
            {/*pagination */}
            <div className="pagination">
                <p>Current Page: {currentPage} and items per page {itemsPerPage}</p>
                {
                    pageNumbers.map(number => <button key={number}
                        className={currentPage=== number ?'selected': ''}
                        onClick={() => setCurrentPage(number)}
                    >{number}</button>)
                }
                <select value={itemsPerPage} onChange={handleSelectChange}>{options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
                </select>
            </div>

        </>
    );
};

export default Shop;