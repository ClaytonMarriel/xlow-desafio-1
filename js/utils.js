function formatPrice(price) {
  if (price !== undefined) {
      return `R$ ${price.toFixed(2)}`;
  } else {
      return 'Preço indisponível';
  }
}
