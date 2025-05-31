const body = document.body;

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
    const searchPage = document.querySelector('.searchPage');
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
        
    })
    
    if(searchQuery) 
        fetchQuery(searchQuery) 
    else
        return asusual();
    
   
}


document.addEventListener("DOMContentLoaded", function () {

    if(document.querySelector('.main').style.display !== 'none') setupBackgroundSlider() ;
    setupProductCards();
});






