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

    // 
    // 
    // 
    // 
    // 
    // 
    // 

    // useEffect(() => {
    //     fetch('http://localhost:5000/products')
    //         .then(res => res.json())
    //         .then(data => setProducts(data))
    // }, []);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`http://localhost:5000/products?page=${currentPage}&limit=${itemsPerPage}`);

            const data = await response.json();
            setProducts(data);
        }
        fetchData();
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        const storedCart = getShoppingCart();
        const ids = Object.keys(storedCart);

        fetch(`http://localhost:5000/productsByIds`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(ids)
        })
        .then(res => res.json())
        .then(cartProducts => {
            const savedCart = [];
        // step 1: get id of the addedProduct
        for (const id in storedCart) {
            // step 2: get product from products state by using id
            const addedProduct = cartProducts.find(product => product._id === id)
            if (addedProduct) {
                // step 3: add qunatity
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                // step 4: add the added product to the saved cart 
                savedCart.push(addedProduct);
            }
            // console.log('added Product', addedProduct)
        }
        // step 5: set the cart
        setCart(savedCart);
        })
        
        
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




    const options = [5, 10, 15, 20];
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
                        className={currentPage === number ? 'selected' : ''}
                        onClick={() => setCurrentPage(number)}
                    >{number + 1}</button>)
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