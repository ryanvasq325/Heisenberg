class SellingPriceCalculator {
    #purchasePrice = 0;
    #totalTax = 0
    #profitMargin = 0;
    #operatingCost = 0;

    static create() {
        return new SellingPriceCalculator();
    }
    addPurchasePrice(purchasePrice) {
        this.#purchasePrice = purchasePrice;
        return this;
    }
    addTotalTax(totalTax = 0) {
        this.#totalTax = totalTax;
        return this;
    }
    addProfitMargin(profitMargin) {
        this.#profitMargin = profitMargin;
        return this;
    }
    addOperatingCost(operatingCost = 0) {
        this.#operatingCost = operatingCost;
        return this;
    }
    getData() {
        //testar os valores para garantir que sejam números e não negativos
        const taxRate = this.#totalTax / 100;
        const marginRate = this.#profitMargin / 100;
        const operatingCostRate = this.#operatingCost / 100;

        const divisor = 1 - (taxRate + marginRate + operatingCostRate);

        if ((taxRate + marginRate + operatingCostRate) <= 0) {
            throw new Error('A soma das taxas, margem de lucro e custo operacional deve ser maior que zero.');
        }

        //Se o percentual total for 100% ou mais, o preço de venda seria infinito ou negativo, o que não é válido.
        if (divisor <= 0) {
            throw new Error('A soma das taxas, margem de lucro e custo operacional deve ser menor que 100%.');
        }

        const sellingPrice = this.#purchasePrice / divisor;
        return 
        {
            valor_venda_sugerido: parseFloat(sellingPrice.toFixed(4)),
            valor_total_imposto: parseFloat((sellingPrice * taxRate).toFixed(4)),
            valor_margem_lucro: parseFloat((sellingPrice * marginRate).toFixed(4))
        };
    }
}
