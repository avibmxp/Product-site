var app = new Vue({
  el: "#app",
  data: {
    apiUrl: "https://fedtest.monolith.co.il/api/",
    product: {},
    errMsg: "",
    sImage: 0,
    colors: {},
    sizes: {},
    sColor: "-1",
    sSize: "-1",
    colorAttr: 1,
    sizeAttr: 5,
    quantity: 0,
    currentVariant: {}, 
    total: 0,
  },
  mounted() {
    this.getProduct(3);
  },
  watch: {
    sSize(newVal){
      if(this.sColor != -1) {
        this.product.variants.forEach((variant) => {
          if((variant.labels[0].attribute_id == this.colors.id && variant.labels[0].label_id == this.sColor) && 
              (variant.labels[1].attribute_id == this.sizes.id && variant.labels[1].label_id == newVal)) {
            this.currentVariant = variant;
          }
        });
      }
    },
    quantity(newVal) {
      this.total = this.currentVariant.price * newVal;
    }
  },
  computed:{ 
    currentSizes() {
      if(this.sColor != -1) {
        let sizesStock = [];
        this.product.variants.forEach((variant) => {
          if(variant.labels[0].attribute_id == this.colors.id && variant.labels[0].label_id == this.sColor)
          sizesStock.push(variant.labels[1].label_id);
        });
  
        let sizes = this.sizes.labels.filter((size) => {
          return sizesStock.includes(size.id);
        });
        return sizes;
      }
      else{
        return this.sizes.labels; 
      }
    },
    bigImage(){
        if(this.currentVariant.image)
          return this.imageFormat(this.currentVariant.image, 370, 370);
        return "";
    },
    disableAddToCard(){
      if(this.sColor != -1 && this.sSize != 1 && this.quantity > 0)
        return false;
      return true;
    },
  },
  methods: {
    getProduct(productId) {
      let url =  `${this.apiUrl}Catalog/Get?id=${productId}`;
      fetch(url, { method: 'GET' })
      .then(response => response.json())
      .then(json => {     
        this.product = json.data;
        this.currentVariant = this.product.variants[0];
        if(json.data.attributes.length > 1) {
          this.colors = json.data.attributes[0];
          this.sizes = json.data.attributes[1];
        }
        console.log(json);
      });
    },
    imageFormat(image, width, height) {
      return `https://fedtest.monolith.co.il/api/imager.php?url=${image.url}&type=fit&width=${width}&height=${height}&quality=70`;
    },
    addToCart(){
      let msg = `Order details: Product name: ${this.currentVariant.title}, Quantity: ${this.quantity}, Price: $${this.total}`;
      alert(msg);
    }
  },
});
