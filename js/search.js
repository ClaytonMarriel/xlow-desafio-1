// search.js
const apiURL = 'https://desafio.xlow.com.br/search';
const totalProductsElement = document.getElementById('total-products');
const cardProductsContainer = document.querySelector('.products');
const toggleLayoutButton = document.getElementById('toggle-layout');

// Fetch products and details
fetch(apiURL)
  .then(response => {
    if (!response.ok) {
      throw new Error('Não foi possível buscar os dados. Status: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log('Dados recebidos:', data);

    if (Array.isArray(data)) {
      const totalProducts = data.length;
      totalProductsElement.textContent = `${totalProducts} produtos`;

      data.forEach(produto => {
        fetch(`${apiURL}/${produto.productId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Erro ao buscar os detalhes do produto ${produto.productId}. Status: ${response.status}`);
            }
            return response.json();
          })
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

  const imagemProduct = detalhesProduto[0].items[0].images[0];
  if (imagemProduct && imagemProduct.imageUrl) {
    imagemElement.src = imagemProduct.imageUrl;
  }

  const nomeElement = document.createElement('div');
  nomeElement.classList.add('product-name');
  nomeElement.textContent = detalhesProduto[0].productName;

  const precoElement = document.createElement('div');
  precoElement.classList.add('product-price');

  const preco = detalhesProduto[0].items[0].sellers[0].commertialOffer.Price;
  const precoDeLista = detalhesProduto[0].items[0].sellers[0].commertialOffer.ListPrice;

  if (preco !== undefined) {
    precoElement.textContent = `R$ ${preco.toFixed(2)}`;
  } else {
    precoElement.textContent = 'Preço indisponível';
  }

  // Verifica se há um preço de desconto e cria um elemento para ele
  if (precoDeLista && precoDeLista > preco) {
    const precoDeDescontoElement = document.createElement('div');
    precoDeDescontoElement.classList.add('product-discount-price');
    precoDeDescontoElement.textContent = `De: R$ ${precoDeLista.toFixed(2)}`;
    precoDeDescontoElement.style.textDecoration = 'line-through';
    cardProduto.appendChild(precoDeDescontoElement);
  }

  const botoesContainer = document.createElement('div');
  botoesContainer.classList.add('button-container');

  const botaoElement = document.createElement('button');
  botaoElement.classList.add('product-button');
  botaoElement.textContent = 'Comprar';

  cardProduto.appendChild(imagemElement);
  cardProduto.appendChild(nomeElement);
  cardProduto.appendChild(precoElement);
  cardProduto.appendChild(botoesContainer);
  botoesContainer.appendChild(botaoElement);

  return cardProduto;
}

// Toggle layout between 4 and 5 products per line
toggleLayoutButton.addEventListener('click', () => {
  cardProductsContainer.classList.toggle('five-per-line');
});
