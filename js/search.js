const apiURL = 'https://desafio.xlow.com.br/search';
const totalProductsElement = document.getElementById('total-products');
const cardProductsContainer = document.querySelector('.products');

fetch(apiURL)
  .then(response => {
    if (!response.ok) {
      throw new Error('Não foi possível buscar os dados. Status: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log('Dados recebidos:', data);

    // Verifica se data é um array e se não está vazio
    if (Array.isArray(data)) {
      const totalProducts = data.length;
      totalProductsElement.textContent = `${totalProducts} produtos`;

      // Itera sobre os produtos e exibe cada um
      data.forEach(produto => {
        // Faz uma solicitação para obter os detalhes do produto
        fetch(`${apiURL}/${produto.productId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Erro ao buscar os detalhes do produto ${produto.productId}. Status: ${response.status}`);
            }
            return response.json();
          })
          .then(detalhesProduto => {

            // Cria um card de produto com os detalhes recebidos
            const cardProduto = criarCardProduto(detalhesProduto);
            // Adiciona o card de produto ao contêiner de cartões de produtos
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
  cardProduto.style.textAlign = 'center';

  const espacamentoEntreElementos = '5px';

  const imagemElement = document.createElement('img');
  imagemElement.classList.add('product-image');
  imagemElement.style.width = '140px';
  // imagemElement.style.minHeight = 'auto';
  // imagemElement.style.marginBottom = espacamentoEntreElementos;

  const imagemProduct = detalhesProduto[0].items[0].images[0];
  if (imagemProduct && imagemProduct.imageUrl) {
    imagemElement.src = imagemProduct.imageUrl;
  }

  const nomeElement = document.createElement('div');
  nomeElement.classList.add('product-name');
  nomeElement.textContent = detalhesProduto[0].productName;
  console.log('Nome produto: ', detalhesProduto);

  const precoElement = document.createElement('div');
  precoElement.classList.add('product-price');


  // Verifica se há vendedores disponíveis e define o preço
  if (detalhesProduto && detalhesProduto.length > 0 && detalhesProduto[0].items && detalhesProduto[0].items.length > 0 && detalhesProduto[0].items[0].sellers && detalhesProduto[0].items[0].sellers.length > 0) {
    const preco = detalhesProduto[0].items[0].sellers[0].commertialOffer.Price;
    if (preco) {
      precoElement.textContent = `R$ ${preco.toFixed(2)}`; // Formata o preço com duas casas decimais
    } else {
      precoElement.textContent = 'Preço indisponível';
    }
  } else {
    precoElement.textContent = 'Preço indisponível';
  }

  const botoesContainer = document.createElement('div');
  botoesContainer.classList.add('button-container');

  const botaoElement = document.createElement('button');
  botaoElement.classList.add('product-button');
  botaoElement.textContent = 'Comprar';

  // Adiciona os elementos ao card do produto
  cardProduto.appendChild(imagemElement);
  cardProduto.appendChild(nomeElement);
  cardProduto.appendChild(precoElement);
  cardProduto.appendChild(botaoElement);

  return cardProduto;
}
