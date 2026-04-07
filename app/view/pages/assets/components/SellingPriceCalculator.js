export default class SellingPriceCalculator {
    create() {
        return new SellingPriceCalculator();
    }
    addPurchasePrice(price) {
        this.purchasePrice = price;
        return this;
    }
    addTotalTax(totalTax = 0) {
        this.totalTax = totalTax;
        return this;
    }
    addProfitMargin(profitMargin) {
        this.profitMargin = profitMargin;
        return this;
    }
    operatingCost(operatingCost = 0) {
        this.operatingCost = operatingCost;
        return this;
    }
    getData() {
        return {
            valor_venda_sugerido: '',
            valor_total_imposto: '',
            valor_total_lucro: ''
        };
    }

}