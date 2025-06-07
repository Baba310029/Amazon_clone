const body = document.body;
const outerMain = document.querySelector('.outerMain');
const itemCount = document.getElementsByClassName('navCartItems')[0];

let cart = [];

function updateCartCounter(){
    const cartCount = document.querySelector('.navCartItems');
    const cards = document.querySelectorAll('.cartItemCard');
    let count = 0;

    if(cards.length > 0) {
        cards.forEach(card => {
            console.log('hii')
            const checkbox = card.querySelector('.itemSelectionCheckBox');
            if(checkbox && checkbox.checked){
                const title = card.querySelector('.cartMediumFont').innerText;
                const product = cart.find(p => p.title === title);
                if(product) count += product.quantity;
            }
        });
    }else
        cart.forEach(p => count += p.quantity);
    cartCount.innerText = count;
}

function loadInitialCart() {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart && Array.isArray(storedCart)) {
        cart = storedCart;
    }
    updateCartCounter();
}

function setupBackgroundSlider() {
    const backgroundImages = [
        'url("mainItems/banner01.jpg")',
        'url("mainItems/banner02.jpg")',
        'url("mainItems/banner03.jpg")',
        'url("mainItems/banner04.jpg")',
        'url("mainItems/banner05.jpg")',
        'url("mainItems/banner06.jpg")'
    ];
    const overLay = [
        'linear-gradient(to bottom, transparent 50%, #FFD814, #e3e6e6)',
        'linear-gradient(to bottom, transparent 50%,rgb(246, 97, 4), #e3e6e6)',
        'linear-gradient(to bottom, transparent 50%,rgb(192, 223, 194), #e3e6e6)',
        'linear-gradient(to bottom, transparent 50%,rgb(185, 106, 205), #e3e6e6)',
        'linear-gradient(to bottom, transparent 50%,rgb(231, 209, 97), #e3e6e6)',
        'linear-gradient(to bottom, transparent 50%,rgb(32, 45, 56), #e3e6e6)'
    ]
    let index = 0;
    const banner = document.getElementsByClassName("main")[0];
    const bannerOverlay = document.getElementsByClassName("mainOverlay")[0];
    const arrowSwitches = document.querySelectorAll(".mainArrows");
    const leftArrow = arrowSwitches[0];
    const rightArrow = arrowSwitches[1];
    banner.style.backgroundImage = backgroundImages[index];
    bannerOverlay.style.background = overLay[index];
    leftArrow.addEventListener('click', function() {
        index = (index - 1 + backgroundImages.length) % backgroundImages.length;
        banner.style.backgroundImage = backgroundImages[index];
        bannerOverlay.style.background = overLay[index];
    });
    rightArrow.addEventListener('click', function () {
        index = (index + 1) % backgroundImages.length;
        banner.style.backgroundImage = backgroundImages[index];
        bannerOverlay.style.background = overLay[index];
    });
}

function setupProductCards() {
    const main0 = document.querySelector('.main');
    const main1 = document.querySelector('.mainBanner');
    const searchPage = document.querySelector('#searchPage');
    const resultContainer = document.querySelector(".searchProductDisplay");
    const result = document.querySelector(".result");
    const searchQuery = new URLSearchParams(window.location.search).get('q') || '';

    function asusual(){
        main0.style.display = 'block';
        main1.style.display = 'block';
        searchPage.style.display= 'none';
    }

    function showResults(products, query) {
        resultContainer.innerHTML = '';
        body.style.backgroundColor = 'white';

        const filtered = products.filter(p => 
            p.name.trim().toLowerCase().includes(query.trim().toLowerCase())
        );
        if(query){
            main0.style.display = 'none';
            main1.style.display = 'none';
            searchPage.style.display= 'block';
        }

        if(filtered.length === 0) {
            resultContainer.innerHTML = '<p class="ProductMediumFont" style="color : orangered;">No products found!</p>';
            return;
        }
        
        result.innerHTML = `
            <div class="ProductLowererFont" style="padding: 1.5vw; font-size: bold; border-bottom: 0.3px solid rgb(213, 213, 213); box-shadow: 0 2px 4px -2px rgb(169, 169, 169);">
                results for <span style="color: orangered; padding: 0.5vw;">"${query}"</span>
            </div>
        `;

        filtered.forEach(product => {
            const card = createProductCard(product);
            resultContainer.appendChild(card);
        });
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'productCard';

        card.innerHTML = `
            <img class="product-image ProductLowererFont" src="${product.image}" alt="${product.name}">
            <div class="innerProductCard">
                <p class="product-brand ProductLowererFont">Featured from Amazon brands</p>
                <h3 class="product-title ProductMediumFont">${product.name}</h3>
                <div class="product-rating ProductMediumFont">
                    ⭐⭐⭐⭐☆ (${product.reviews})
                </div>
                <div class="product-price">
                    <span class="current-price">${product.price}</span>
                    <span class="old-price ProductLowererFont"><s>${product.oldPrice}</s></span>
                </div>
                <p class="delivery ProductLowererFont">Delivery <b>${product.deliveryDate}</b><br>Ships to ${product.shipTo}</p>
                <button class="add-to-cart ProductLowererFont">Add to cart</button>
            </div>
        `;

        return card;
    }

    function fetchQuery(query){
        fetch('products.json')
        .then(res => res.json())
        .then(products => showResults(products, query))
        .catch(function (err) {
            console.error(`Error loading products ${err}`);
            resultContainer.innerText = 'Failed to load products.';
        });
    }

    const input = document.getElementsByClassName('searchInput')[0];
    input.value = searchQuery;

    const categoryCards = document.querySelectorAll('.categoryCard');
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const categoryQuery = card.children[1].innerText;
            const encoded = encodeURIComponent(categoryQuery);
            window.location.href = `index.html?q=${encoded}`;
        });
        
    });
    
    if(searchQuery) 
        fetchQuery(searchQuery) 
    else
        return asusual();
    
   
}

function setupCart(){
    function createCartItemCard(product){
        const card = document.createElement('div');
        card.className = 'cartItemCard';
        card.innerHTML = `
            <input type="checkbox" class="itemSelectionCheckBox" ${product.selected ? 'checked' : ''}>
            <div class='outerImageDiv'><img src="${product.image}" alt="${product.title}" id="itemImage"></div>
            <div class="content">
                <div class="upper">
                    <div id="upperLeft">
                        <p class="cartMediumFont">${product.title}</p>
                        <p class="cartLowerFont" style="color: #2162A1">In Stock</p>
                        <div id="Checkbox">
                            <label class="giftLabel">
                                <input type="checkbox" />
                                <span class="cartLowerFont">This is a gift</span>
                            </label>
                        </div>
                        <p class="cartLowerFont"><span style="font-weight: bold;">Size: </span><span> xxxxx</span></p>
                        <p class="cartLowerFont"><span style="font-weight: bold;">Style: </span><span> xxxxx</span></p>
                    </div>
                    <div class="cartMediumFont" id="upperRight">$${product.price * product.quantity}</div>
                </div>
                <div class="bottom">
                    <div class="quantityButton">
                        <button class="cartMediumFont" id="delete"><img src="mainItems/del.png" alt="Delete"></button>
                        <button id="decrease"><h4 class="increaseClass">-</h4></button>
                        <h4 class="cartMediumFont" id="cardQuantity">${product.quantity}</h4>
                        <button id="increase"><h4 class="increaseClass">+</h4></button>
                    </div>
                    <p class="cartLowerFont">Delete</p>
                    <p class="cartLowerFont">Save for later</p>
                    <p class="cartLowerFont">Compare with similar items</p>
                    <p class="cartLowerFont">Share</p>
                </div>
            </div>
        `;
        return card;
    }

    document.addEventListener('click', function(e){
        if(e.target.classList.contains('add-to-cart')){
            const productCard = e.target.closest('.productCard');
            const title = productCard.querySelector('.product-title').innerText;
            const price = parseFloat(productCard.querySelector('.current-price').innerText.replace('$', ''));
            const image = productCard.querySelector('.product-image').src;

            const existing = cart.find(p => p.title === title);
            if(!existing)
                cart.push({title, price, image, quantity: 1, selected: true});
            else
                existing.quantity += 1;

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
        }
    });

    const cartDiv = document.getElementById('navCart');
    const cartPage = document.querySelector('#cartPage');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    function createCartPage(){
        const defaultCart = document.createElement('div');
        defaultCart.className = 'extraPage';
        defaultCart.id = 'cartPage';
        
        defaultCart.innerHTML = `
            <div class="outerCartItems">
                <div class="cartItems">
                    <h2 class="cartUpperFont" style="margin-bottom: clamp(0rem, 1.5vw, 0.5rem);">Your Amazon Cart is empty</h2>
                    <p class="cartMediumFont">Your Shopping Cart lives to serve. Give it purpose — fill it with groceries, clothing, household supplies, electronics, and more.
                    Continue shopping on the <span style="color: #2162A1;">Amazon.com homepage</span>, learn about <span style="color: #2162A1;">today's deals</span>, or visit your <span style="color: #2162A1;">Wish List</span>.</p>
                </div>
            </div>
            <div class="cartTotal">
                <div class="subtotal">
                    <p id='itemCount' style=" font-size: clamp(0rem, 1.8vw, 1.4rem); font-weight: 500;">Subtotal (${itemCount.innerText} item): <span id="subtotalCost" style="font-weight: bold;">$${total.toFixed(2)}</span></p>
                    <div id="checkBox">
                        <input type="checkbox" style="width: clamp(0rem, 1.4vw, 0.8rem);">
                        <p  class="cartLowerFont">This order contains a gift</p>
                    </div>
                    <form class="cartLowerFont">Proceed to checkout</form>
                </div>
                <div class="prime">
                    <div class="primeLogo">
                        <img src="mainItems/primeLogo.svg" >
                    </div>
                    <div class="totalText">
                        <p class="cartMediumFont" style="font-weight: bold;">Free fast delivery. No order minimum. Exclusive savings. Start your 30-day free trial of Prime.</p>
                        <form class="cartLowerFont">Join Prime</form>
                    </div>
                </div>
            </div>
            `;

        return defaultCart;
    }

    cartDiv.addEventListener('click', (e) => {
        const cartQuery = encodeURIComponent('queryClicked');
        window.location.href = `index.html?q=${cartQuery}`;
        outerMain.innerHTML = '';
    })



    if(new URLSearchParams(window.location.search).get('q') === 'queryClicked') {
        document.querySelector('.searchInput').value = '';
        outerMain.innerHTML = ''
        
        const defaultCartDiv = createCartPage();
        outerMain.appendChild(defaultCartDiv);

        window.history.replaceState({}, document.title, 'index.html');


        function updateSubtotal(){
            const subtotalCost = document.querySelectorAll('#subtotalCost');
            const itemCountText = document.querySelectorAll('#itemCount');

            const cards = document.querySelectorAll('.cartItemCard');
            let total = 0;
            let itemCount = 0;

            cards.forEach(card => {
                const checkbox = card.querySelector('.itemSelectionCheckBox');
                if(!checkbox || !checkbox.checked) return;

                const title = card.querySelector('.cartMediumFont').innerText;
                const product = cart.find(p => p.title === title);

                if (product) {
                    total += product.price * product.quantity;
                    itemCount += product.quantity;
                }
            })
            if(subtotalCost) {
                subtotalCost.forEach(item => {
                    item.innerText = `$${total.toFixed(2)}`;
                });
            }
            if(itemCountText) {
                itemCountText.forEach(item => {
                    item.innerHTML = `Subtotal (${itemCount} items): <span style="font-weight: bold;">$${total.toFixed(2)}</span>`;
                });
            } 
        }      

        const subtotalDiv = document.querySelector('.subtotal');
        const outerCartItems = document.querySelector('.outerCartItems')
        if(cart.length === 0) 
            subtotalDiv.style.display = 'none';
        else{
            outerCartItems.innerHTML = `
                <p class="cartUpperFont">Shopping Cart</p>
                <p class="cartLowerFont" style="color: #2162A1">Deselect all items</p>
                <p class="cartMediumFont" style="text-align: end; padding-bottom: 0.4vw; padding-right: 0.6vw; border-bottom: 2px solid rgb(239, 238, 238); color: #2162A1">price</p>
                <div class="cartItems"></div>
                <p class="cartMediumFont" id="itemCount" style="text-align: end;">Subtotal (${itemCount.innerText} items): <span id="subtotalCost" style="font-weight: bold;">$${total.toFixed(2)}</span></p>
            `;
            const cartItems = document.querySelector('.cartItems');
            cartItems.innerHTML = '';
            cart.forEach((product) => {
                const card = createCartItemCard(product);
                cartItems.appendChild(card);
            });
            updateCartCounter();
            updateSubtotal();
        }

        document.addEventListener('change', e => {
            if (e.target.classList.contains('itemSelectionCheckBox')) {
                const checkbox = event.target;
                const card = checkbox.closest('.cartItemCard');
                const title = card.querySelector('.cartMediumFont').innerText;

                const productInCart = cart.find(p => p.title === title);
                if (productInCart) {
                    productInCart.selected = checkbox.checked;
                    localStorage.setItem('cart', JSON.stringify(cart));
                }
                updateCartCounter();
                updateSubtotal();
            }
        });

        const deleteButton = document.querySelectorAll('#delete');
        deleteButton.forEach(button => button.style.display = 'none');
        const cartItemCard = document.querySelectorAll('.cartItemCard');

        cartItemCard.forEach( card => {
            const cardQuantity = card.querySelector('#cardQuantity');
            if(cardQuantity.innerText === '1') {
                card.querySelector('#delete').style.display = 'block';
                card.querySelector('#decrease').style.display = 'none';
            };
        })

        document.addEventListener('click', e => {
            const card = e.target.closest('.cartItemCard');
            if (!card) return;

            const title = card.querySelector('.cartMediumFont').innerText;
            

            const itemIndex = cart.findIndex(p => p.title === title);
            if (itemIndex === -1) return;

            const product = cart[itemIndex];

            if (e.target.alt === 'Delete') {
                cart.splice(itemIndex, 1);
            }

            if (e.target.innerText === '+') {
                product.quantity += 1;
            }

            if (e.target.innerText === '-') {
                if (product.quantity === 1) {
                    cart.splice(itemIndex, 1);
                } else {
                    product.quantity -= 1;
                }
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = `index.html?q=queryClicked`;
        });


    }
    
    
}

function setUpLoginPage(){
    function createEmailLoginPage(){
        const OuterDiv = document.createElement('div');
        OuterDiv.className = 'OuterDiv';
        OuterDiv.innerHTML = `
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" class="logo" width="100">
            <div class="innerLoginDiv">
                <h1 class="loginUpperFont">Sign in or create account</h1>
                <form>
                    <label for="email" class="loginMediumFont" style="font-weight: 600;">Enter mobile number or email</label>
                    <input class="loginMediumFont" type="text" id="email" name="email" spellcheck="true" required />
                    <p id="errorMsg" class="errorText hidden"></p>
                    <button class="loginMediumFont" id="continue-btn" type="submit">Continue</button>
                </form>
                <p class="loginMediumFont" id="terms">
                    By continuing, you agree to Amazon's 
                    <a href="#">Conditions of Use</a> and 
                    <a href="#">Privacy Notice</a>.
                </p>
                <a class="loginMediumFont" href="#" id="removeUnderline">Need help?</a>

                <hr id="innerHr"/>

                <p class="loginMediumFont"><strong>Buying for work?</strong></p>
                <a href="#" class="loginMediumFont" id="business-link" style="text-decoration: none;">Create a free business account</a>
            </div>
            <hr id="OuterHr"/>
            <div class="loginMediumFont" id="emailConditions">
                <div id="insideConditions">
                    <a href="#" id="removeUnderline">Conditions of Use</a>
                    <a href="#" id="removeUnderline">Privacy Notice</a>
                    <a href="#" id="removeUnderline">Help</a><br><br>
                </div>
                <p class="emailCopyRight">© 1996-2025, Amazon.com, Inc. or its affiliates</p>
            </div>
            `;
        return OuterDiv;
    }

    const mainPageSignInButton = document.querySelector('#navSignin');

    mainPageSignInButton.addEventListener('click', e => {
        body.innerHTML = '';
        body.style.backgroundColor = 'white';
        const div = createEmailLoginPage();
        body.appendChild(div);


        const input = document.getElementById('email');
        const form = document.querySelector('.innerLoginDiv').querySelector('form');
        const continueBtn = document.getElementById('continue-btn');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/;

        function isValidInput(value) {
            return emailRegex.test(value) || mobileRegex.test(value);
        }

        const saved = localStorage.getItem('userCredential');
        if(saved)
            input.value = saved;

        const clearBtn = document.createElement('i');
        clearBtn.className = 'fa-solid fa-xmark clearBtn';
        clearBtn.style.display = 'none';
        clearBtn.style.userSelect = 'none';
        
        input.parentElement.appendChild(clearBtn);

        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            input.classList.remove('invalid');
        });

        input.addEventListener('input', () => {
            const value = input.value.trim();

            clearBtn.style.display = value ? 'block' : 'none';

            if(value == '' || isValidInput(value)){
                input.classList.remove('invalid');
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const value = input.value.trim();

            if(isValidInput(value)){
                localStorage.setItem('userCredential', value);
                input.classList.remove('invalid');
                errorMsg.classList.add('hidden');
                errorMsg.innerHTML = '';
            }else{
                input.classList.add('invalid');
                 errorMsg.classList.remove('hidden');
                errorMsg.innerHTML = `<i class="fas fa-exclamation-circle"></i> <p class="loginMediumFont">Invalid email address</p>`;
            }
        })

    })
}

document.addEventListener("DOMContentLoaded", function () {
    const main = document.querySelector('.main');

    setUpLoginPage();
    loadInitialCart();
    if(main.style.display !== 'none') setupBackgroundSlider();
    if(new URLSearchParams(window.location.search).get('q') !== 'queryClicked') setupProductCards();
    setupCart();
});



