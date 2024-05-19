const totalProductsElement = document.getElementById('total-products');
const cardProductsContainer = document.querySelector('.products');
const toggleLayoutButton = document.getElementById('toggle-layout');
const loadingElement = document.getElementById('loading');

fetchProducts()
    .then(data => {
        if (Array.isArray(data)) {
            const totalProducts = data.length;
            totalProductsElement.textContent = `${totalProducts} produtos`;

            data.forEach(produto => {
                fetchProductDetails(produto.productId)
                    .then(detalhesProduto => {
                        const cardProduto = criarCardProduto(detalhesProduto);
                        cardProductsContainer.appendChild(cardProduto);
                    })
                    .catch(error => {
                        console.error('Erro ao buscar os detalhes do produto:', error.message);
                    });
            });
        } else {
            console.error('Os dados recebidos não estão no formato esperado:', data);
        }
    })
    .catch(error => {
        console.error('Erro na solicitação:', error.message);
    });

function criarCardProduto(detalhesProduto) {
    const cardProduto = document.createElement('div');
    cardProduto.classList.add('card-products');
  
    const imagemElement = document.createElement('img');
    imagemElement.classList.add('product-image');
  
    const imagemProduct = detalhesProduto[0]?.items[0]?.images[0];
    if (imagemProduct && imagemProduct.imageUrl) {
        imagemElement.src = imagemProduct.imageUrl;
    }
  
    const originalImageUrl = imagemElement.src;
    imagemElement.addEventListener('click', () => {
        imagemElement.src = originalImageUrl;
    });
  
    const nomeElement = document.createElement('div');
    nomeElement.classList.add('product-name');
    nomeElement.textContent = detalhesProduto[0]?.productName;
  
    const additionalImagesContainer = document.createElement('div');
    additionalImagesContainer.classList.add('additional-images');
  
    detalhesProduto[0]?.items[0]?.images.slice(1).forEach(image => {
        const additionalImage = document.createElement('img');
        additionalImage.classList.add('additional-image');
        additionalImage.src = image.imageUrl;
        additionalImage.addEventListener('click', () => {
            imagemElement.src = image.imageUrl;
        });
        additionalImagesContainer.appendChild(additionalImage);
    });
  
    const pricesContainer = document.createElement('div');
    pricesContainer.classList.add('product-prices');
  
    const precoElement = document.createElement('div');
    precoElement.classList.add('product-price');
  
    const preco = detalhesProduto[0]?.items[0]?.sellers[0]?.commertialOffer?.Price;
    const precoDeLista = detalhesProduto[0]?.items[0]?.sellers[0]?.commertialOffer?.ListPrice;
  
    if (precoDeLista && precoDeLista > preco) {
        const precoDeDescontoElement = document.createElement('div');
        precoDeDescontoElement.classList.add('product-discount-price');
        precoDeDescontoElement.textContent = `De: R$ ${precoDeLista.toFixed(2)}`;
        precoDeDescontoElement.style.fontSize = '14px';
        pricesContainer.appendChild(precoDeDescontoElement);
    } else {
        const precoDeDescontoElement = document.createElement('div');
        precoDeDescontoElement.classList.add('product-discount-price');
        pricesContainer.appendChild(precoDeDescontoElement);
    }
    
    if (preco !== undefined) {
        precoElement.textContent = `R$ ${preco.toFixed(2)}`;
    } else {
        precoElement.textContent = 'Preço indisponível';
    }

    pricesContainer.appendChild(precoElement);
  
    const botoesContainer = document.createElement('div');
    botoesContainer.classList.add('button-container');
  
    const botaoElement = document.createElement('button');
    botaoElement.classList.add('product-button');
    botaoElement.textContent = 'COMPRAR';
  
    cardProduto.appendChild(imagemElement);
    cardProduto.appendChild(nomeElement);
    cardProduto.appendChild(additionalImagesContainer);
    cardProduto.appendChild(pricesContainer);
    cardProduto.appendChild(botoesContainer);
    botoesContainer.appendChild(botaoElement);
  
    return cardProduto;
}

toggleLayoutButton.addEventListener('click', () => {
    cardProductsContainer.classList.toggle('five-per-line');
});
