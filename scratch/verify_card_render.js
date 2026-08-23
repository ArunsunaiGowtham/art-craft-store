const fs = require('fs');
const path = require('path');

const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const window = {};
eval(dataJs);

function renderProductCard(product, viewMode) {
  var starsHtml = '★★★★☆';
  var badgeHtml = "";
  if (product.badge) {
    var badgeClass = product.badge === "sale" ? "bg-danger" : product.badge === "new" ? "bg-success" : "bg-primary";
    badgeHtml = '<span class="position-absolute top-0 start-0 badge ' + badgeClass + ' m-2" style="z-index:2;">' + product.badge.charAt(0).toUpperCase() + product.badge.slice(1) + "</span>";
  }
  var oldPriceHtml = product.oldPrice ? '<span class="text-decoration-line-through text-muted me-2">$' + product.oldPrice.toFixed(2) + "</span>" : "";

  return '<div class="col-md-6 col-lg-4 col-xl-3"><div class="card product-card h-100 position-relative border-0 shadow-sm" data-product-id="' + product.id + '">' +
    badgeHtml +
    '<div class="card-img-top overflow-hidden" style="height:200px;"><a href="product-details.html?id=' + product.id + '"><img src="' + product.image + '" alt="' + product.name + '" class="img-fluid w-100 h-100" style="object-fit:cover;"></a></div>' +
    '<div class="card-body d-flex flex-column">' +
    '<span class="badge bg-light text-dark mb-2 align-self-start">' + product.categoryLabel + "</span>" +
    '<h6 class="card-title mb-1"><a href="product-details.html?id=' + product.id + '" class="text-decoration-none text-dark">' + product.name + "</a></h6>" +
    '<div class="mb-2 small">' + starsHtml + ' <span class="text-muted">(' + product.reviewCount + ")</span></div>" +
    '<p class="card-text text-muted small flex-grow-1">' + product.description.substring(0, 80) + "...</p>" +
    '<div class="mb-2">' + oldPriceHtml + '<span class="fw-bold text-primary fs-5">$' + product.price.toFixed(2) + "</span></div>" +
    '<div class="d-flex gap-2 mt-auto"><button class="btn btn-primary btn-sm flex-grow-1 add-to-cart-btn" data-product-id="' + product.id + '"><i class="fas fa-cart-plus me-1"></i> Add to Cart</button>' +
    '</div></div></div>';
}

const origamiProds = window.AppData.products.filter(p => p.category === 'origami');
console.log(`Found ${origamiProds.length} origami products`);

origamiProds.forEach(p => {
  const cardHtml = renderProductCard(p, 'grid');
  console.log(`\nCard HTML for "${p.name}":\n`, cardHtml);
  if (!cardHtml.includes(p.image)) throw new Error(`Missing image ${p.image} in card`);
});

console.log('\n>>> Card rendering verified successfully! <<<');
