export const formatCurrency = (amount, currency = "ARS") => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrencyShort = (amount) => {
  if (amount >= 1000000) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 1,
    }).format(amount / 1000000) + "M";
  }
  if (amount >= 1000) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 1,
    }).format(amount / 1000) + "K";
  }
  return formatCurrency(amount);
};
