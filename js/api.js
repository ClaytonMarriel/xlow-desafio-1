const API_URL = 'https://desafio.xlow.com.br/search';

function fetchProducts() {
    return fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Não foi possível buscar os dados. Status: ' + response.status);
            }
            return response.json();
        });
}

function fetchProductDetails(productId) {
    return fetch(`${API_URL}/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar os detalhes do produto ${productId}. Status: ${response.status}`);
            }
            return response.json();
        });
}
