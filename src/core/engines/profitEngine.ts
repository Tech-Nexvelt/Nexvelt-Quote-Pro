export interface ProfitMetrics {
  totalCostPrice: number;
  totalSellingPrice: number;
  grossProfitAmount: number;
  profitPercentage: number; // Gross Profit / Cost Price * 100
  marginPercentage: number; // Gross Profit / Selling Price * 100
}

export function calculateProfitMetrics(
  totalSellingPrice: number,
  totalCostPrice: number
): ProfitMetrics {
  const selling = Math.max(0, totalSellingPrice);
  const cost = Math.max(0, totalCostPrice);
  const grossProfitAmount = Math.round((selling - cost) * 100) / 100;

  let profitPercentage = 0;
  if (cost > 0) {
    profitPercentage = Math.round((grossProfitAmount / cost) * 10000) / 100;
  }

  let marginPercentage = 0;
  if (selling > 0) {
    marginPercentage = Math.round((grossProfitAmount / selling) * 10000) / 100;
  }

  return {
    totalCostPrice: Math.round(cost * 100) / 100,
    totalSellingPrice: Math.round(selling * 100) / 100,
    grossProfitAmount,
    profitPercentage,
    marginPercentage,
  };
}
