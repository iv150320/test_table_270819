Vue.component('ProductItem', {
    props: ['product'],
    template: `
        <tr>
            <td>{{ product.good_id }}</td>
            <td>{{ product.good }}</td>
            <td>{{ product.brand }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.rating }}</td>
        </tr>
    `
});


var app = new Vue({
    el: '#app',
    data: {
        products: [],

        brands: [],
        sortRules: [
            { key :'rating:desc', title: 'По рейтингу' },
            { key :'price:desc', title: 'По возрасту ' }
        ],
        inputSearch: '',
        selectCategory: 0,
        selectBrand: 0,
        minPrice: 0,
        maxPrice: 0,
        selectSort: 'good_id:asc'
    },
    computed: {
        filteredProducts: function() {
            // Фильтруем товары
            var filtered = this.products
                // По категории
                .filter(product => {
                    return this.selectCategory == 0 ||
                        product.rating == this.selectCategory;
                })



                .filter(product => {
                    return Number(product.price) >= this.minPrice && Number(product.price) <= this.maxPrice;
                })


                .filter(product => {
                    return this.inputSearch == '' ||
                        product.good.toLowerCase().indexOf(this.inputSearch.toLowerCase()) !== -1 ||
            product.brand.toLowerCase().indexOf(this.inputSearch.toLowerCase()) !== -1;
                });

            var sorted = _.sortBy(filtered, product => {
                return Number(product[this.sortKey]);
            });

            if (this.sortDir === 'desc') {
                sorted = sorted.reverse();
            }

            return sorted;
        },
        sortKey: function() {
            return this.selectSort.split(':')[0];
        },
        sortDir: function() {
            return this.selectSort.split(':')[1];
        }
    },
    mounted: function() {
        axios
            .get('users_crmm.json')
            .then(response => {
                this.products = response.data.data.goods;
                this.brands = response.data.data.brands;
                this.minPrice = this.getMinPrice();
                this.maxPrice = this.getMaxPrice();
            });
    },
    methods: {
        getMinPrice: function() {
            return Number(_.minBy(this.products, 'price').price);
        },
        getMaxPrice: function() {
            return Number(_.maxBy(this.products, 'price').price);
        },
        clear: function() {
            this.inputSearch = '';
            this.selectCategory = 0;
            this.selectBrand = 0;
            this.minPrice = this.getMinPrice();
            this.maxPrice = this.getMaxPrice();
            this.selectSort = 'good_id:asc';
        }
    }
});