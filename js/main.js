(function () {
  "use strict";

  /* ============================================================
     THEME TOGGLE
  ============================================================ */
  function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    syncThemeButtons();
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme") || "light";
    var next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncThemeButtons();
  }

  function syncThemeButtons() {
    var theme = document.documentElement.getAttribute("data-theme") || "light";
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      var icon = btn.querySelector("i, span");
      if (icon) {
        if (theme === "dark") {
          icon.classList.remove("fa-moon", "bi-moon");
          icon.classList.add("fa-sun", "bi-sun");
        } else {
          icon.classList.remove("fa-sun", "bi-sun");
          icon.classList.add("fa-moon", "bi-moon");
        }
      }
    });
  }

  /* ============================================================
     RTL / LTR TOGGLE
  ============================================================ */
  function initDirection() {
    var saved = localStorage.getItem("direction") || "ltr";
    document.documentElement.setAttribute("dir", saved);
    syncDirectionButtons();
  }

  function toggleDirection() {
    var current = document.documentElement.getAttribute("dir") || "ltr";
    var next = current === "ltr" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", next);
    localStorage.setItem("direction", next);
    if (next === "rtl") {
      document.documentElement.style.direction = "rtl";
    } else {
      document.documentElement.style.direction = "";
    }
    syncDirectionButtons();
  }

  function syncDirectionButtons() {
    var dir = document.documentElement.getAttribute("dir") || "ltr";
    document.querySelectorAll(".rtl-toggle").forEach(function (btn) {
      var text = btn.querySelector("span, .btn-text");
      if (text) {
        text.textContent = dir === "ltr" ? "RTL" : "LTR";
      }
    });
  }

  /* ============================================================
     NAVBAR ACTIVE HIGHLIGHT
  ============================================================ */
  function initActiveNav() {
    var rawPath = window.location.pathname.split("/").pop() || "index.html";
    if (rawPath === "" || rawPath === "/") rawPath = "index.html";
    rawPath = rawPath.split("?")[0].split("#")[0];

    // Reset all active classes from all nav links
    document.querySelectorAll(".navbar-nav .nav-link, .navbar-nav .dropdown-item").forEach(function (el) {
      el.classList.remove("active", "nav-active");
    });

    var navMap = {
      "index.html": "home",
      "home-2.html": "home-2",
      "shop.html": "shop.html",
      "workshops.html": "workshops.html",
      "brands.html": "brands.html",
      "about.html": "about.html",
      "blog.html": "blog.html",
      "pricing.html": "pricing.html",
      "contact.html": "contact.html"
    };

    var target = navMap[rawPath];
    if (!target) return;

    if (target === "home") {
      var homeToggle = document.querySelector(".navbar-nav .dropdown-toggle");
      if (homeToggle) homeToggle.classList.add("active", "nav-active");
      var item1 = document.querySelector('.navbar-nav .dropdown-item[href="index.html"]');
      if (item1) item1.classList.add("active");
    } else if (target === "home-2") {
      var homeToggle2 = document.querySelector(".navbar-nav .dropdown-toggle");
      if (homeToggle2) homeToggle2.classList.add("active", "nav-active");
      var item2 = document.querySelector('.navbar-nav .dropdown-item[href="home-2.html"]');
      if (item2) item2.classList.add("active");
    } else {
      var link = document.querySelector('.navbar-nav > li > .nav-link[href="' + target + '"], .navbar-nav .nav-link[href="' + target + '"]');
      if (link) link.classList.add("active", "nav-active");
    }
  }

  /* ============================================================
     NAVBAR SCROLL EFFECT
  ============================================================ */
  function initNavbarScroll() {
    var navbar = document.querySelector(".navbar");
    if (!navbar) return;
    function onScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     NAVBAR DROPDOWNS (Desktop & Mobile)
  ============================================================ */
  function initDropdowns() {
    function closeAllDropdowns() {
      document.querySelectorAll(".navbar .dropdown").forEach(function (drop) {
        drop.classList.remove("show", "open");
        var toggle = drop.querySelector(".dropdown-toggle");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.classList.remove("show", "open");
        }
        var menu = drop.querySelector(".dropdown-menu");
        if (menu) {
          menu.classList.remove("show", "open");
          menu.style.removeProperty("display");
          menu.style.removeProperty("transform");
          menu.style.removeProperty("position");
          menu.style.removeProperty("inset");
        }
      });
    }

    document.querySelectorAll(".navbar .dropdown-toggle").forEach(function (toggle) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        var parentDropdown = toggle.closest(".dropdown");
        if (!parentDropdown) return;
        var menu = parentDropdown.querySelector(".dropdown-menu");
        var isCurrentlyOpen = parentDropdown.classList.contains("show") || 
                              parentDropdown.classList.contains("open") || 
                              (menu && (menu.classList.contains("show") || menu.classList.contains("open")));

        // Close other dropdowns first
        document.querySelectorAll(".navbar .dropdown").forEach(function (other) {
          if (other !== parentDropdown) {
            other.classList.remove("show", "open");
            var otherToggle = other.querySelector(".dropdown-toggle");
            if (otherToggle) {
              otherToggle.setAttribute("aria-expanded", "false");
              otherToggle.classList.remove("show", "open");
            }
            var otherMenu = other.querySelector(".dropdown-menu");
            if (otherMenu) {
              otherMenu.classList.remove("show", "open");
              otherMenu.style.removeProperty("display");
            }
          }
        });

        if (isCurrentlyOpen) {
          parentDropdown.classList.remove("show", "open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.classList.remove("show", "open");
          if (menu) {
            menu.classList.remove("show", "open");
            menu.style.removeProperty("display");
          }
        } else {
          parentDropdown.classList.add("show", "open");
          toggle.setAttribute("aria-expanded", "true");
          toggle.classList.add("show", "open");
          if (menu) {
            menu.classList.add("show", "open");
            if (window.innerWidth < 1100) {
              menu.style.setProperty("display", "flex", "important");
              menu.style.removeProperty("transform");
              menu.style.removeProperty("position");
              menu.style.removeProperty("inset");
            } else {
              menu.style.setProperty("display", "block", "important");
            }
          }
        }
      });
    });

    document.querySelectorAll(".navbar .dropdown-menu .dropdown-item").forEach(function (item) {
      item.addEventListener("click", function () {
        closeAllDropdowns();
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".navbar .dropdown")) {
        closeAllDropdowns();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeAllDropdowns();
      }
    });
  }

  /* ============================================================
     MOBILE NAVIGATION
  ============================================================ */
  function initMobileNav() {
    var navbarCollapses = document.querySelectorAll(".navbar-collapse");
    var navbarTogglers = document.querySelectorAll(".navbar-toggler");

    function closeAllNavbars() {
      navbarCollapses.forEach(function (collapse) {
        collapse.classList.remove("show");
      });
      navbarTogglers.forEach(function (toggler) {
        toggler.setAttribute("aria-expanded", "false");
        toggler.classList.remove("active");
        var icon = toggler.querySelector("i");
        if (icon) {
          icon.className = "fas fa-bars";
        }
      });
      document.querySelectorAll(".navbar .dropdown").forEach(function (drop) {
        drop.classList.remove("show", "open");
        var toggle = drop.querySelector(".dropdown-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        var menu = drop.querySelector(".dropdown-menu");
        if (menu) menu.classList.remove("show");
      });
      document.body.style.overflow = "";
    }

    navbarTogglers.forEach(function (toggler) {
      toggler.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var targetSelector = toggler.getAttribute("data-bs-target") || toggler.getAttribute("data-target") || "#mainNav";
        var collapse = document.querySelector(targetSelector) || document.querySelector(".navbar-collapse");
        if (collapse) {
          var willOpen = !collapse.classList.contains("show");
          if (willOpen) {
            collapse.classList.add("show");
            toggler.setAttribute("aria-expanded", "true");
            toggler.classList.add("active");
            var icon = toggler.querySelector("i");
            if (icon) {
              icon.className = "fas fa-times";
            }
            document.body.style.overflow = "hidden";
          } else {
            closeAllNavbars();
          }
        }
      });
    });

    document.querySelectorAll(".navbar-nav .nav-link:not(.dropdown-toggle), .navbar-nav .dropdown-item").forEach(function (link) {
      link.addEventListener("click", function () {
        closeAllNavbars();
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".navbar") && !e.target.closest(".navbar-collapse")) {
        closeAllNavbars();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeAllNavbars();
      }
    });
  }

  /* ============================================================
     SEARCH OVERLAY
  ============================================================ */
  function initSearchOverlay() {
    var overlay = document.querySelector(".search-overlay");
    if (!overlay) return;
    var input = overlay.querySelector("input");

    document.querySelectorAll(".search-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        overlay.classList.add("active");
        overlay.style.display = "flex";
        if (input) input.focus();
      });
    });

    overlay.querySelectorAll(".search-close").forEach(function (btn) {
      btn.addEventListener("click", function () {
        overlay.classList.remove("active");
        overlay.style.display = "none";
      });
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        overlay.classList.remove("active");
        overlay.style.display = "none";
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("active")) {
        overlay.classList.remove("active");
        overlay.style.display = "none";
      }
    });
  }

  /* ============================================================
     TOAST NOTIFICATIONS
  ============================================================ */
  function showToast(message, type) {
    type = type || "success";
    var container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.cssText = "position:fixed;top:80px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;";
      document.body.appendChild(container);
    }

    var toast = document.createElement("div");
    toast.className = "toast-notification toast-" + type;
    toast.style.cssText = "padding:12px 20px;border-radius:8px;color:#fff;font-size:14px;min-width:250px;max-width:350px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:slideInRight 0.3s ease;cursor:pointer;";

    var colors = { success: "#28a745", error: "#dc3545", info: "#17a2b8" };
    var icons = { success: "fas fa-check-circle", error: "fas fa-exclamation-circle", info: "fas fa-info-circle" };
    toast.style.backgroundColor = colors[type] || colors.info;

    var iconEl = document.createElement("i");
    iconEl.className = icons[type] || icons.info;
    toast.appendChild(iconEl);

    var textEl = document.createElement("span");
    textEl.textContent = message;
    toast.appendChild(textEl);

    container.appendChild(toast);

    toast.addEventListener("click", function () {
      toast.style.animation = "slideOutRight 0.3s ease forwards";
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    });

    setTimeout(function () {
      if (toast.parentNode) {
        toast.style.animation = "slideOutRight 0.3s ease forwards";
        setTimeout(function () {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      }
    }, 3000);

    injectToastStyles();
  }

  var toastStylesInjected = false;
  function injectToastStyles() {
    if (toastStylesInjected) return;
    toastStylesInjected = true;
    var style = document.createElement("style");
    style.textContent = "@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOutRight{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}";
    document.head.appendChild(style);
  }

  window.showToast = showToast;

  /* ============================================================
     CART SYSTEM
  ============================================================ */
  window.Cart = {
    getItems: function () {
      try {
        var parsed = JSON.parse(localStorage.getItem("cart"));
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    },
    save: function (items) {
      localStorage.setItem("cart", JSON.stringify(items));
      this.updateBadges();
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items: items } }));
    },
    addItem: function (product, quantity) {
      quantity = parseInt(quantity, 10) || 1;
      if (quantity < 1) quantity = 1;
      var items = this.getItems();
      var prodId = product.id;
      var prodName = product.name;
      var existing = items.find(function (item) {
        return (prodId != null && String(item.id) === String(prodId)) ||
               (prodName && item.name && item.name.toLowerCase() === prodName.toLowerCase());
      });
      if (existing) {
        existing.quantity = (parseInt(existing.quantity, 10) || 0) + quantity;
      } else {
        items.push({
          id: prodId != null ? prodId : ("p_" + Date.now()),
          name: product.name,
          price: typeof product.price === "number" ? product.price : (parseFloat(product.price) || 0),
          image: product.image || "",
          quantity: quantity,
          category: product.category || ""
        });
      }
      this.save(items);
      if (typeof showToast === "function") {
        showToast(product.name + " added to cart!", "success");
      }
    },
    removeItem: function (productId) {
      var items = this.getItems().filter(function (item) { return String(item.id) !== String(productId); });
      this.save(items);
      if (typeof showToast === "function") {
        showToast("Item removed from cart", "info");
      }
    },
    updateQuantity: function (productId, quantity) {
      var qty = parseInt(quantity, 10) || 1;
      if (qty < 1) qty = 1;
      var items = this.getItems();
      var item = items.find(function (item) { return String(item.id) === String(productId); });
      if (item) {
        item.quantity = qty;
      }
      this.save(items);
      return item ? item.quantity : qty;
    },
    changeQuantity: function (productId, delta) {
      var items = this.getItems();
      var item = items.find(function (item) { return String(item.id) === String(productId); });
      if (item) {
        var currentQty = parseInt(item.quantity, 10) || 1;
        var newQty = Math.max(1, currentQty + delta);
        item.quantity = newQty;
        this.save(items);
        return item.quantity;
      }
      return 1;
    },
    getTotal: function () {
      return this.getItems().reduce(function (sum, item) {
        var p = typeof item.price === "number" ? item.price : (parseFloat(item.price) || 0);
        var q = parseInt(item.quantity, 10) || 1;
        return sum + (p * q);
      }, 0);
    },
    getCount: function () {
      return this.getItems().reduce(function (sum, item) {
        return sum + (parseInt(item.quantity, 10) || 1);
      }, 0);
    },
    clear: function () {
      localStorage.removeItem("cart");
      this.updateBadges();
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items: [] } }));
    },
    updateBadges: function () {
      var count = this.getCount();
      document.querySelectorAll(".cart-count").forEach(function (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? "inline-block" : "none";
      });
    }
  };

  /* ============================================================
     WISHLIST SYSTEM
  ============================================================ */
  window.Wishlist = {
    getItems: function () {
      try {
        return JSON.parse(localStorage.getItem("wishlist")) || [];
      } catch (e) {
        return [];
      }
    },
    save: function (items) {
      localStorage.setItem("wishlist", JSON.stringify(items));
      this.updateBadges();
      this.syncIcons();
    },
    toggle: function (productId) {
      var items = this.getItems();
      var index = items.indexOf(productId);
      if (index > -1) {
        items.splice(index, 1);
        showToast("Removed from wishlist", "info");
      } else {
        items.push(productId);
        showToast("Added to wishlist!", "success");
      }
      this.save(items);
      return index === -1;
    },
    isInWishlist: function (productId) {
      return this.getItems().indexOf(productId) > -1;
    },
    getCount: function () {
      return this.getItems().length;
    },
    updateBadges: function () {
      var count = this.getCount();
      document.querySelectorAll(".wishlist-count").forEach(function (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? "inline-block" : "none";
      });
    },
    syncIcons: function () {
      var self = this;
      document.querySelectorAll(".wishlist-btn, .add-wishlist-btn, .product-action-btn.wishlist-btn, [data-action='wishlist']").forEach(function (btn) {
        var card = btn.closest(".product-card, .product-item, .product-img-wrapper, [data-product-id], [data-id]");
        var rawId = btn.getAttribute("data-product-id") || btn.getAttribute("data-id") || (card ? (card.getAttribute("data-product-id") || card.getAttribute("data-id")) : null);
        var id = parseInt(rawId);
        var icon = btn.querySelector("i");
        if (icon && id && !isNaN(id)) {
          if (self.isInWishlist(id)) {
            icon.className = "fas fa-heart";
            btn.classList.add("active", "wishlist-active");
            btn.setAttribute("aria-label", "Remove from wishlist");
            btn.setAttribute("title", "In your wishlist");
          } else {
            icon.className = "far fa-heart";
            btn.classList.remove("active", "wishlist-active");
            btn.setAttribute("aria-label", "Add to wishlist");
            btn.setAttribute("title", "Add to wishlist");
          }
        }
      });
    }
  };

  /* ============================================================
     PRODUCT CARD INTERACTIONS
  ============================================================ */
  function initProductCards() {
    document.addEventListener("click", function (e) {
      var addBtn = e.target.closest(".add-to-cart-btn, #pd-add-to-cart, #quick-view-add-cart, button[data-action='add-to-cart']");
      if (addBtn) {
        e.preventDefault();
        e.stopPropagation();

        var card = addBtn.closest(".product-card, .product-item, .product-info-section, [data-product-id], [data-id]");
        var rawId = addBtn.getAttribute("data-product-id") || addBtn.getAttribute("data-id") || (card ? (card.getAttribute("data-product-id") || card.getAttribute("data-id")) : null);
        var productId = rawId ? parseInt(rawId, 10) : null;

        var cardTitle = card ? card.querySelector(".card-title, h6, h5, .product-name") : null;
        var titleText = cardTitle ? cardTitle.textContent.trim() : "";

        var cardPrice = card ? card.querySelector(".product-price, .card-price, .price") : null;
        var priceText = cardPrice ? cardPrice.textContent.trim() : "";
        var parsedPrice = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, "")) : 0;

        var cardImg = card ? card.querySelector(".product-image img, .card-img-top, img") : null;
        var imgSrc = cardImg ? (cardImg.getAttribute("src") || "") : "";

        var cardCat = card ? card.querySelector(".product-category, .badge") : null;
        var catText = cardCat ? cardCat.textContent.trim() : "";

        var products = (window.AppData && Array.isArray(window.AppData.products)) ? window.AppData.products : [];

        var product = null;

        // Try exact name match in AppData first if card has a title
        if (titleText) {
          var matchedByName = products.find(function (p) {
            return p.name.toLowerCase() === titleText.toLowerCase();
          });
          if (matchedByName) {
            product = Object.assign({}, matchedByName);
          }
        }

        // Try ID match if no exact name match
        if (!product && productId && !isNaN(productId)) {
          var matchedById = products.find(function (p) { return p.id === productId; });
          if (matchedById) {
            // Only use ID match if title doesn't contradict or if card has no conflicting title
            if (!titleText || matchedById.name.toLowerCase() === titleText.toLowerCase()) {
              product = Object.assign({}, matchedById);
            }
          }
        }

        // If card represents a specific product with its own DOM values (e.g. Home Page static card)
        if (!product) {
          product = {
            id: (productId && !isNaN(productId)) ? productId : ("p_" + (titleText ? titleText.toLowerCase().replace(/[^a-z0-9]/g, "_") : Date.now())),
            name: titleText || "Art Supply Product",
            price: (!isNaN(parsedPrice) && parsedPrice > 0) ? parsedPrice : 0,
            image: imgSrc || "",
            category: catText || ""
          };
        } else {
          // If card DOM has specific displayed price/image, ensure it matches what user clicked
          if (!isNaN(parsedPrice) && parsedPrice > 0) {
            product.price = parsedPrice;
          }
          if (imgSrc) {
            product.image = imgSrc;
          }
        }

        if (product) {
          // Determine quantity
          var qty = 1;
          if (addBtn.id === "pd-add-to-cart") {
            var pdQty = document.querySelector("#pd-quantity");
            if (pdQty) qty = parseInt(pdQty.value, 10) || 1;
          } else if (card) {
            var cardQty = card.querySelector(".quantity-input, input[type='number']");
            if (cardQty) qty = parseInt(cardQty.value, 10) || 1;
          }

          window.Cart.addItem(product, qty);

          // Small success feedback on button without modifying other elements
          var origHtml = addBtn.getAttribute("data-orig-html");
          if (!origHtml) {
            origHtml = addBtn.innerHTML;
            addBtn.setAttribute("data-orig-html", origHtml);
          }
          addBtn.innerHTML = '<i class="fas fa-check me-1"></i> Added to Cart';
          addBtn.classList.add("btn-success");
          addBtn.classList.remove("btn-primary");

          // Reset button state smoothly after 1.5 seconds
          if (addBtn._resetTimer) clearTimeout(addBtn._resetTimer);
          addBtn._resetTimer = setTimeout(function () {
            addBtn.innerHTML = origHtml;
            addBtn.classList.remove("btn-success");
            addBtn.classList.add("btn-primary");
            addBtn._resetTimer = null;
          }, 1500);
        }
        return;
      }

      var wishlistBtn = e.target.closest(".wishlist-btn, .add-wishlist-btn, [data-action='wishlist']");
      if (wishlistBtn) {
        e.preventDefault();
        var card = wishlistBtn.closest(".product-card, .product-item, .product-img-wrapper, [data-product-id], [data-id]");
        var id = parseInt(wishlistBtn.getAttribute("data-product-id") || wishlistBtn.getAttribute("data-id") || (card ? (card.getAttribute("data-product-id") || card.getAttribute("data-id")) : null));
        if (id && !isNaN(id)) {
          window.Wishlist.toggle(id);
        }
      }

      var quickViewBtn = e.target.closest(".quick-view-btn");
      if (quickViewBtn) {
        e.preventDefault();
        var card = quickViewBtn.closest(".product-card, .product-item, .product-img-wrapper, [data-product-id], [data-id]");
        var qvId = parseInt(quickViewBtn.getAttribute("data-product-id") || quickViewBtn.getAttribute("data-id") || (card ? (card.getAttribute("data-product-id") || card.getAttribute("data-id")) : null));
        if (qvId && !isNaN(qvId)) {
          openQuickView(qvId);
        }
      }
    });

    if (window.Wishlist) window.Wishlist.syncIcons();
  }

  function openQuickView(productId) {
    var products = window.AppData ? window.AppData.products : [];
    var product = products.find(function (p) { return p.id === productId; });
    if (!product) return;

    var modal = document.getElementById("quickViewModal");
    if (!modal) {
      modal = createQuickViewModal();
      document.body.appendChild(modal);
    }

    modal.querySelector(".qv-product-name").textContent = product.name;
    modal.querySelector(".qv-product-image").src = product.image;
    modal.querySelector(".qv-product-image").alt = product.name;
    modal.querySelector(".qv-product-price").textContent = "$" + product.price.toFixed(2);
    modal.querySelector(".qv-product-description").textContent = product.description;
    if (modal.querySelector(".qv-product-category")) {
      modal.querySelector(".qv-product-category").textContent = product.categoryLabel;
    }
    if (modal.querySelector(".qv-product-rating")) {
      modal.querySelector(".qv-product-rating").innerHTML = renderStars(product.rating) + ' <span class="text-muted ms-1">(' + product.reviewCount + ' reviews)</span>';
    }
    if (modal.querySelector(".add-to-cart-btn")) {
      modal.querySelector(".add-to-cart-btn").setAttribute("data-product-id", product.id);
    }
    if (modal.querySelector(".wishlist-btn")) {
      modal.querySelector(".wishlist-btn").setAttribute("data-product-id", product.id);
    }

    var bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }

  function createQuickViewModal() {
    var modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "quickViewModal";
    modal.tabIndex = -1;
    modal.innerHTML = '<div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><h5 class="modal-title qv-product-name"></h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><div class="row"><div class="col-md-6"><img src="" alt="" class="img-fluid rounded qv-product-image"></div><div class="col-md-6"><span class="badge bg-primary mb-2 qv-product-category"></span><div class="mb-2 qv-product-rating"></div><h4 class="qv-product-price text-primary mb-3"></h4><p class="qv-product-description mb-3"></p><div class="d-flex gap-2"><button class="btn btn-primary add-to-cart-btn flex-grow-1" data-product-id=""><i class="fas fa-cart-plus me-1"></i> Add to Cart</button></div></div></div></div></div></div>';
    return modal;
  }

  function renderStars(rating) {
    var html = "";
    for (var i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        html += '<i class="fas fa-star text-warning"></i>';
      } else if (i - rating < 1 && i - rating > 0) {
        html += '<i class="fas fa-star-half-alt text-warning"></i>';
      } else {
        html += '<i class="far fa-star text-warning"></i>';
      }
    }
    return html;
  }

  window.renderStars = renderStars;

  /* ============================================================
     SHOP FILTERING
  ============================================================ */
  window.ShopFilter = {
    currentCategory: "all",
    currentSearch: "",
    currentSort: "default",
    currentMinPrice: 0,
    currentMaxPrice: Infinity,
    currentPage: 1,
    perPage: 8,
    viewMode: "grid",

    normalizeCategory: function (category) {
      if (!category || category === "all" || category === "All" || category === "All Products") return "all";
      return String(category).toLowerCase().trim().replace(/[\s_]+/g, "-");
    },

    filterByCategory: function (category) {
      var normCat = this.normalizeCategory(category);
      this.currentCategory = normCat;
      this.currentPage = 1;
      this.render();
      
      document.querySelectorAll(".category-filter-btn").forEach(function (b) {
        var btnCat = (b.getAttribute("data-category") || "").toLowerCase().trim();
        if (btnCat === normCat) {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      });

      try {
        var url = new URL(window.location);
        if (normCat !== "all") {
          url.searchParams.set("category", normCat);
        } else {
          url.searchParams.delete("category");
        }
        history.replaceState(null, "", url);
      } catch (e) {}
    },

    filterByPrice: function (min, max) {
      this.currentMinPrice = typeof min === "number" ? min : 0;
      this.currentMaxPrice = typeof max === "number" ? max : Infinity;
      this.currentPage = 1;
      this.render();
    },

    filterBySearch: function (query) {
      this.currentSearch = (query || "").toLowerCase().trim();
      this.currentPage = 1;
      this.render();
    },

    sortBy: function (sortType) {
      this.currentSort = sortType || "default";
      this.render();
    },

    setView: function (viewType) {
      this.viewMode = viewType || "grid";
      this.render();
    },

    resetFilters: function () {
      this.currentCategory = "all";
      this.currentSearch = "";
      this.currentSort = "default";
      this.currentMinPrice = 0;
      this.currentMaxPrice = Infinity;
      this.currentPage = 1;

      var searchInput = document.querySelector(".product-search, #product-search");
      if (searchInput) searchInput.value = "";

      var sortSelect = document.querySelector(".product-sort, #product-sort");
      if (sortSelect) sortSelect.value = "default";

      var priceRange = document.querySelector("#priceRange");
      if (priceRange) priceRange.value = 200;

      var priceLabel = document.querySelector("#priceRangeLabel, .price-range-label");
      if (priceLabel) priceLabel.textContent = "$0 - $200";

      document.querySelectorAll(".category-filter-btn").forEach(function (b) {
        if ((b.getAttribute("data-category") || "") === "all") {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      });

      try {
        var url = new URL(window.location);
        url.searchParams.delete("category");
        url.searchParams.delete("search");
        history.replaceState(null, "", url);
      } catch (e) {}

      this.render();
    },

    getFilteredProducts: function () {
      var self = this;
      var products = window.AppData && Array.isArray(window.AppData.products) ? window.AppData.products : [];
      
      var filtered = products.filter(function (p) {
        // Category check
        if (self.currentCategory !== "all") {
          var pCat = (p.category || "").toLowerCase().trim().replace(/[\s_]+/g, "-");
          if (pCat !== self.currentCategory) return false;
        }

        // Price check
        if (p.price < self.currentMinPrice || p.price > self.currentMaxPrice) return false;

        // Search check
        if (self.currentSearch) {
          var haystack = [
            p.name,
            p.description,
            p.categoryLabel,
            p.category,
            p.brand || ""
          ].join(" ").toLowerCase();

          if (haystack.indexOf(self.currentSearch) === -1) return false;
        }

        return true;
      });

      switch (self.currentSort) {
        case "price-asc": filtered.sort(function (a, b) { return a.price - b.price; }); break;
        case "price-desc": filtered.sort(function (a, b) { return b.price - a.price; }); break;
        case "name": filtered.sort(function (a, b) { return a.name.localeCompare(b.name); }); break;
        case "popularity": filtered.sort(function (a, b) { return (b.reviewCount || 0) - (a.reviewCount || 0); }); break;
        case "rating": filtered.sort(function (a, b) { return (b.rating || 0) - (a.rating || 0); }); break;
        default: break;
      }
      return filtered;
    },

    render: function () {
      var self = this;
      var container = document.querySelector(".products-grid, .product-list, #products-container");
      if (!container) return;

      var filtered = self.getFilteredProducts();
      var totalPages = Math.ceil(filtered.length / self.perPage);
      if (self.currentPage > totalPages) self.currentPage = totalPages || 1;
      var start = (self.currentPage - 1) * self.perPage;
      var pageProducts = filtered.slice(start, start + self.perPage);

      var countEl = document.querySelector(".product-count, #product-count");
      if (countEl) {
        countEl.textContent = "Showing " + pageProducts.length + " of " + filtered.length + " products";
      }

      container.className = self.viewMode === "list" ? "product-list" : "products-grid row g-4";

      if (filtered.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5">' +
          '<div class="mb-3"><i class="fas fa-search fa-3x text-muted" style="opacity:0.4;"></i></div>' +
          '<h4 class="fw-bold mb-2">No products found</h4>' +
          '<p class="text-muted mb-4">No products match your selected category and filter criteria.</p>' +
          '<button class="btn btn-primary btn-sm" onclick="window.ShopFilter.resetFilters()"><i class="fas fa-undo me-1"></i> Reset All Filters</button>' +
          '</div>';
      } else {
        container.innerHTML = pageProducts.map(function (product) {
          return renderProductCard(product, self.viewMode);
        }).join("");
      }

      self.renderPagination(totalPages);

      if (window.Wishlist) window.Wishlist.syncIcons();

      if (self.viewMode === "list") {
        container.querySelectorAll(".product-item").forEach(function (item) {
          item.style.display = "flex";
          item.style.gap = "20px";
          item.style.padding = "20px";
          item.style.borderBottom = "1px solid var(--border-color, #eee)";
        });
      }
    },

    renderPagination: function (totalPages) {
      var self = this;
      var pagination = document.querySelector(".pagination, .shop-pagination");
      if (!pagination) return;
      if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
      }

      var html = "";
      html += '<li class="page-item ' + (self.currentPage === 1 ? "disabled" : "") + '"><a class="page-link" href="#" data-page="' + (self.currentPage - 1) + '" aria-label="Previous">&laquo;</a></li>';

      for (var i = 1; i <= totalPages; i++) {
        html += '<li class="page-item ' + (self.currentPage === i ? "active" : "") + '"><a class="page-link" href="#" data-page="' + i + '">' + i + "</a></li>";
      }

      html += '<li class="page-item ' + (self.currentPage === totalPages ? "disabled" : "") + '"><a class="page-link" href="#" data-page="' + (self.currentPage + 1) + '" aria-label="Next">&raquo;</a></li>';
      pagination.innerHTML = html;

      pagination.querySelectorAll(".page-link").forEach(function (link) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          var page = parseInt(this.getAttribute("data-page"));
          if (page >= 1 && page <= totalPages) {
            self.currentPage = page;
            self.render();
            window.scrollTo({ top: 400, behavior: "smooth" });
          }
        });
      });
    }
  };

  function renderProductCard(product, viewMode) {
    var isWishlist = window.Wishlist && window.Wishlist.isInWishlist(product.id);
    var starsHtml = renderStars(product.rating);
    var badgeHtml = "";
    if (product.badge) {
      var badgeClass = product.badge === "sale" ? "bg-danger" : product.badge === "new" ? "bg-success" : "bg-primary";
      badgeHtml = '<span class="position-absolute top-0 start-0 badge ' + badgeClass + ' m-2" style="z-index:2;">' + product.badge.charAt(0).toUpperCase() + product.badge.slice(1) + "</span>";
    }
    var oldPriceHtml = product.oldPrice ? '<span class="text-decoration-line-through text-muted me-2">$' + product.oldPrice.toFixed(2) + "</span>" : "";
    var stockBadge = product.inStock ? '<span class="badge bg-success">In Stock</span>' : '<span class="badge bg-secondary">Out of Stock</span>';
    var productImageHtml = '<div class="product-image card-img-top overflow-hidden"><a href="product-details.html?id=' + product.id + '"><img src="' + product.image + '" alt="' + product.name + '" class="img-fluid w-100 h-100" style="object-fit:cover;"></a></div>';

    if (viewMode === "list") {
      return '<div class="product-item d-flex position-relative" data-product-id="' + product.id + '">' + badgeHtml +
        '<div style="width:200px;min-width:200px;"><a href="product-details.html?id=' + product.id + '"><img src="' + product.image + '" alt="' + product.name + '" class="img-fluid rounded"></a></div>' +
        '<div class="flex-grow-1"><span class="product-category-badge mb-1">' + product.categoryLabel + '</span>' +
        '<h5 class="mb-1"><a href="product-details.html?id=' + product.id + '" class="product-title-link">' + product.name + "</a></h5>" +
        '<div class="mb-1">' + starsHtml + ' <small class="text-secondary">(' + product.reviewCount + ")</small></div>" +
        '<p class="mb-2 text-secondary">' + product.description.substring(0, 120) + "...</p>" +
        '<div class="mb-2">' + stockBadge + "</div>" +
        '<div class="mb-2"><h5 class="text-primary d-inline">' + oldPriceHtml + "$" + product.price.toFixed(2) + "</h5></div>" +
        '<div><button class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="' + product.id + '"><i class="fas fa-cart-plus me-1"></i> Add to Cart</button></div></div></div>';
    }

    return '<div class="col-12 col-sm-6 col-lg-4 col-xl-3"><div class="card product-card h-100 position-relative border-0 shadow-sm" data-product-id="' + product.id + '">' +
      badgeHtml +
      productImageHtml +
      '<div class="card-body d-flex flex-column">' +
      '<span class="product-category-badge mb-2 align-self-start">' + product.categoryLabel + "</span>" +
      '<h6 class="card-title mb-1"><a href="product-details.html?id=' + product.id + '" class="product-title-link">' + product.name + "</a></h6>" +
      '<div class="product-rating small">' + starsHtml + ' <span class="text-secondary">(' + product.reviewCount + ")</span></div>" +
      '<div class="product-price-section">' + oldPriceHtml + '<span class="card-price fw-bold text-primary fs-5">$' + product.price.toFixed(2) + "</span></div>" +
      '<button class="btn btn-primary btn-sm w-100 add-to-cart-btn" data-product-id="' + product.id + '"><i class="fas fa-cart-plus me-1"></i> Add to Cart</button>' +
      "</div></div></div>";
  }

  /* ============================================================
     SHOP PAGE INIT
  ============================================================ */
  function initShopPage() {
    var productsGrid = document.querySelector(".products-grid, .product-list, #products-container");
    if (!productsGrid) return;

    var urlParams = new URLSearchParams(window.location.search);
    var category = urlParams.get("category");
    if (category) {
      window.ShopFilter.filterByCategory(category);
    } else {
      window.ShopFilter.render();
    }

    document.querySelectorAll(".category-filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var cat = this.getAttribute("data-category") || "all";
        window.ShopFilter.filterByCategory(cat);
        document.querySelectorAll(".category-filter-btn").forEach(function (b) { b.classList.remove("active"); });
        this.classList.add("active");
      });
    });

    var searchInput = document.querySelector(".product-search, #product-search");
    if (searchInput) {
      var debounceTimer;
      searchInput.addEventListener("input", function () {
        var self = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          window.ShopFilter.filterBySearch(self.value);
        }, 300);
      });
    }

    var sortSelect = document.querySelector(".product-sort, #product-sort");
    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        window.ShopFilter.sortBy(this.value);
      });
    }

    var priceRange = document.querySelector("#priceRange, .price-range");
    if (priceRange) {
      priceRange.addEventListener("input", function () {
        var max = parseInt(this.value);
        var label = document.querySelector("#priceRangeLabel, .price-range-label");
        if (label) label.textContent = "$0 - $" + max;
        window.ShopFilter.filterByPrice(0, max);
      });
    }

    document.querySelectorAll(".view-toggle").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var view = this.getAttribute("data-view") || "grid";
        window.ShopFilter.setView(view);
        document.querySelectorAll(".view-toggle").forEach(function (b) { b.classList.remove("active"); });
        this.classList.add("active");
      });
    });
  }

  /* ============================================================
     WORKSHOP REGISTRATION
  ============================================================ */
  window.WorkshopReg = {
    modal: null,

    getWorkshop: function (workshopId) {
      var workshops = window.AppData && Array.isArray(window.AppData.workshops) ? window.AppData.workshops : [];
      return workshops.find(function (workshop) { return workshop.id === workshopId; }) || null;
    },

    getRegistrations: function () {
      try {
        var saved = JSON.parse(localStorage.getItem("workshopRegistrations"));
        if (!Array.isArray(saved)) return [];

        return saved.filter(function (entry) {
          if (!entry || typeof entry !== "object") return false;
          var workshop = window.WorkshopReg.getWorkshop(Number(entry.workshopId));
          if (!workshop || Number(entry.workshopId) !== workshop.id) return false;
          return Boolean(
            entry.registrationId &&
            entry.workshopTitle === workshop.title &&
            entry.instructor === workshop.instructor &&
            entry.date === workshop.date &&
            entry.time === workshop.time &&
            entry.location === workshop.location &&
            Number(entry.price) === Number(workshop.price) &&
            entry.registrationDate &&
            entry.status === "confirmed" &&
            entry.attendeeName &&
            entry.attendeeEmail &&
            entry.attendeePhone
          );
        });
      } catch (e) {
        return [];
      }
    },

    saveRegistrations: function (registrations) {
      localStorage.setItem("workshopRegistrations", JSON.stringify(registrations));
    },

    createRegistration: function (workshop, attendee) {
      return {
        registrationId: "registration-" + Date.now() + "-" + workshop.id,
        workshopId: workshop.id,
        workshopTitle: workshop.title,
        instructor: workshop.instructor,
        date: workshop.date,
        time: workshop.time,
        location: workshop.location,
        price: workshop.price,
        registrationDate: new Date().toISOString(),
        status: "confirmed",
        attendeeName: attendee.name || "",
        attendeeEmail: attendee.email || "",
        attendeePhone: attendee.phone || ""
      };
    },

    register: function (workshopId) {
      var workshop = this.getWorkshop(workshopId);
      if (!workshop) return;
      this.openForm(workshop);
    },

    submit: function (workshop, attendee) {
      var registrations = this.getRegistrations();
      registrations.push(this.createRegistration(workshop, attendee));
      this.saveRegistrations(registrations);
      this.updateUI(workshop.id);
      var count = this.getRegistrationCount(workshop.id);
      var msg = count > 1 
        ? "Seat #" + count + " registered for " + workshop.title + "!" 
        : "Registration Successful for " + workshop.title + "!";
      showToast(msg, "success");
      return true;
    },

    openForm: function (workshop) {
      var self = this;
      var modalElement = this.getModal();
      var count = self.getRegistrationCount(workshop.id);

      var alertBox = modalElement.querySelector("[data-already-registered-alert]");
      if (alertBox) {
        if (count > 0) {
          alertBox.style.display = "flex";
          var countText = alertBox.querySelector("[data-registered-count-text]");
          if (countText) countText.textContent = count + " seat(s) currently reserved";
          var cancelBtn = alertBox.querySelector(".cancel-this-registration-btn");
          if (cancelBtn) {
            cancelBtn.onclick = function () {
              self.unregister(workshop.id);
              if (window.bootstrap && bootstrap.Modal) {
                bootstrap.Modal.getOrCreateInstance(modalElement).hide();
              } else {
                modalElement.style.display = "none";
              }
            };
          }
        } else {
          alertBox.style.display = "none";
        }
      }

      var subtitle = count > 0 
        ? "Attendee #" + (count + 1) + " | " + workshop.instructor + " | " + workshop.date + " | " + workshop.time + " | $" + workshop.price
        : workshop.instructor + " | " + workshop.date + " | " + workshop.time + " | " + workshop.location + " | $" + workshop.price;

      modalElement.querySelector("[data-registration-title]").textContent = (count > 0 ? "Register Additional Attendee: " : "Workshop Registration: ") + workshop.title;
      modalElement.querySelector("[data-registration-details]").textContent = subtitle;
      modalElement.querySelector("[name='registration-name']").value = "";
      modalElement.querySelector("[name='registration-email']").value = "";
      modalElement.querySelector("[name='registration-phone']").value = "";
      modalElement.querySelector("[data-registration-form]").dataset.workshopId = workshop.id;

      var submitBtn = modalElement.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.textContent = count > 0 ? "Confirm & Register Another Seat" : "Complete Registration";
      }

      if (window.bootstrap && bootstrap.Modal) {
        bootstrap.Modal.getOrCreateInstance(modalElement).show();
      } else {
        modalElement.style.display = "block";
        modalElement.classList.add("show");
      }
      setTimeout(function () { modalElement.querySelector("[name='registration-name']").focus(); }, 150);
    },

    getModal: function () {
      var self = this;
      var existingModal = document.getElementById("workshopRegistrationModal");
      if (existingModal) {
        this.modal = existingModal;
        return existingModal;
      }
      var modal = document.createElement("div");
      modal.className = "modal fade";
      modal.id = "workshopRegistrationModal";
      modal.tabIndex = -1;
      modal.innerHTML = '<div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Workshop Registration</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><div data-already-registered-alert class="alert alert-success d-flex align-items-center justify-content-between p-3 mb-3 rounded-3" style="display:none;"><div class="d-flex align-items-center gap-2"><i class="fas fa-check-circle fs-5 text-success"></i><div><strong>You are registered</strong><div class="small text-muted" data-registered-count-text>1 seat reserved</div></div></div><button type="button" class="btn btn-sm btn-outline-danger cancel-this-registration-btn"><i class="fas fa-times me-1"></i>Cancel Registration</button></div><h6 data-registration-title class="mb-2"></h6><p data-registration-details class="small text-muted mb-4"></p><form data-registration-form><div class="mb-3"><label class="form-label" for="registration-name">Full Name</label><input id="registration-name" name="registration-name" class="form-control" required></div><div class="mb-3"><label class="form-label" for="registration-email">Email</label><input id="registration-email" name="registration-email" type="email" class="form-control" required></div><div class="mb-3"><label class="form-label" for="registration-phone">Phone</label><input id="registration-phone" name="registration-phone" type="tel" class="form-control" required></div><button type="submit" class="btn btn-primary w-100">Complete Registration</button></form></div></div></div>';
      document.body.appendChild(modal);
      modal.querySelector("[data-registration-form]").addEventListener("submit", function (event) {
        event.preventDefault();
        var workshop = self.getWorkshop(parseInt(this.dataset.workshopId, 10));
        if (!workshop) return;
        var attendee = {
          name: this.querySelector("[name='registration-name']").value.trim(),
          email: this.querySelector("[name='registration-email']").value.trim(),
          phone: this.querySelector("[name='registration-phone']").value.trim()
        };
        if (self.submit(workshop, attendee) && window.bootstrap && bootstrap.Modal) {
          bootstrap.Modal.getOrCreateInstance(modal).hide();
        }
      });
      this.modal = modal;
      return modal;
    },

    unregister: function (workshopId) {
      var numId = Number(workshopId);
      var registrations = this.getRegistrations().filter(function (registration) { 
        return Number(registration.workshopId) !== numId; 
      });
      this.saveRegistrations(registrations);
      showToast("Workshop registration cancelled", "info");
      this.updateUI(numId);
      window.dispatchEvent(new CustomEvent("workshop-registration-changed", { detail: { workshopId: numId, status: "cancelled" } }));
    },

    getConfirmModal: function () {
      var existing = document.getElementById("workshopCancelConfirmModal");
      if (existing) return existing;

      var modal = document.createElement("div");
      modal.className = "modal fade";
      modal.id = "workshopCancelConfirmModal";
      modal.tabIndex = -1;
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = '<div class="modal-dialog modal-dialog-centered" style="max-width:420px;">' +
        '<div class="modal-content border-0 shadow" style="border-radius:var(--radius-md, 12px); overflow:hidden; background:var(--bg-card);">' +
          '<div class="modal-header border-0 pb-0">' +
            '<h5 class="modal-title fw-bold text-danger"><i class="fas fa-exclamation-triangle me-2"></i>Cancel Registration</h5>' +
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
          '</div>' +
          '<div class="modal-body py-3">' +
            '<p class="mb-2" data-cancel-confirm-msg>Are you sure you want to cancel your registration for this workshop?</p>' +
            '<p class="small text-muted mb-0">This will release your reserved seat(s) and cannot be undone.</p>' +
          '</div>' +
          '<div class="modal-footer border-0 pt-0 d-flex justify-content-end gap-2">' +
            '<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Keep Registration</button>' +
            '<button type="button" class="btn btn-danger confirm-cancel-action-btn"><i class="fas fa-times me-1"></i>Confirm Cancellation</button>' +
          '</div>' +
        '</div>' +
      '</div>';
      document.body.appendChild(modal);
      return modal;
    },

    requestCancel: function (workshopId) {
      var self = this;
      var numId = Number(workshopId);
      var workshop = self.getWorkshop(numId);
      var count = self.getRegistrationCount(numId);
      if (count === 0) return;

      var confirmModal = self.getConfirmModal();
      var msgEl = confirmModal.querySelector("[data-cancel-confirm-msg]");
      if (msgEl) {
        var wTitle = workshop ? workshop.title : "this workshop";
        msgEl.innerHTML = 'Are you sure you want to cancel your registration for <strong>' + wTitle + '</strong>' + (count > 1 ? ' (' + count + ' seats)' : '') + '?';
      }

      var confirmBtn = confirmModal.querySelector(".confirm-cancel-action-btn");
      confirmBtn.onclick = function () {
        if (window.bootstrap && bootstrap.Modal) {
          var bsModal = bootstrap.Modal.getInstance(confirmModal) || bootstrap.Modal.getOrCreateInstance(confirmModal);
          bsModal.hide();
        } else {
          confirmModal.style.display = "none";
          confirmModal.classList.remove("show");
        }

        var regModal = document.getElementById("workshopRegistrationModal");
        if (regModal) {
          if (window.bootstrap && bootstrap.Modal) {
            var bsReg = bootstrap.Modal.getInstance(regModal);
            if (bsReg) bsReg.hide();
          } else {
            regModal.style.display = "none";
            regModal.classList.remove("show");
          }
        }

        self.unregister(numId);
      };

      if (window.bootstrap && bootstrap.Modal) {
        bootstrap.Modal.getOrCreateInstance(confirmModal).show();
      } else {
        confirmModal.style.display = "block";
        confirmModal.classList.add("show");
      }
    },

    isRegistered: function (workshopId) {
      return this.getRegistrations().some(function (registration) { return Number(registration.workshopId) === Number(workshopId); });
    },
    getRegistrationCount: function (workshopId) {
      return this.getRegistrations().filter(function (registration) { return Number(registration.workshopId) === Number(workshopId); }).length;
    },
    getRegistered: function () {
      return this.getRegistrations().map(function (registration) { return Number(registration.workshopId); });
    },
    updateUI: function (workshopId) {
      var self = this;
      var numId = Number(workshopId);
      var count = self.getRegistrationCount(numId);
      var workshop = self.getWorkshop(numId);

      // Update all register buttons across page
      document.querySelectorAll(".workshop-register-btn[data-workshop-id='" + numId + "']").forEach(function (btn) {
        if (count > 0) {
          btn.innerHTML = '<i class="fas fa-check-circle me-1"></i> Registered' + (count > 1 ? ' (' + count + ')' : '');
          btn.classList.remove("btn-primary");
          btn.classList.add("btn-success");
          btn.title = "You have " + count + " registration(s). Click to register another attendee.";
          btn.disabled = false;
          btn.removeAttribute("disabled");
        } else {
          btn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Register Now';
          btn.classList.remove("btn-success");
          btn.classList.add("btn-primary");
          btn.title = "Click to register for this workshop";
          btn.disabled = false;
          btn.removeAttribute("disabled");
        }
      });

      // Update workshop-details sidebar registration status & buttons
      var statusWrap = document.getElementById("workshop-registered-status-wrap");
      var detailRegBtn = document.getElementById("workshop-register-btn");
      var sideCancelBtn = document.getElementById("workshop-cancel-sidebar-btn");
      
      if (detailRegBtn) {
        var currentWId = parseInt(detailRegBtn.getAttribute("data-workshop-id") || "0", 10);
        if (currentWId === numId) {
          if (count > 0) {
            if (statusWrap) {
              statusWrap.style.display = "block";
              var seatCountEl = document.getElementById("workshop-registered-seat-count");
              if (seatCountEl) {
                seatCountEl.textContent = count + (count === 1 ? " seat reserved" : " seats reserved");
              }
            }
            if (sideCancelBtn) {
              sideCancelBtn.setAttribute("data-workshop-id", numId);
            }
            detailRegBtn.style.display = "none";
          } else {
            if (statusWrap) {
              statusWrap.style.display = "none";
            }
            detailRegBtn.style.display = "block";
            detailRegBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Register Now';
            detailRegBtn.classList.remove("btn-success");
            detailRegBtn.classList.add("btn-primary");
          }
        }
      }

      // Update seats left / progress bar on workshop-details page if this workshop is displayed
      if (workshop) {
        var seatsLeftEl = document.getElementById("workshop-seats-left");
        var seatsTotalEl = document.getElementById("workshop-seats-total");
        var seatsBarEl = document.getElementById("workshop-seats-bar");
        if (seatsLeftEl && seatsTotalEl && seatsBarEl) {
          var baseTaken = workshop.seatsTaken || 0;
          var currentTaken = baseTaken + count;
          var seatsLeft = Math.max(0, workshop.seatsTotal - currentTaken);
          seatsLeftEl.textContent = seatsLeft;
          seatsTotalEl.textContent = workshop.seatsTotal;
          var pct = Math.min(100, Math.round((currentTaken / workshop.seatsTotal) * 100));
          seatsBarEl.style.width = pct + "%";
        }
      }
    }
  };

  function initWorkshopButtons() {
    document.addEventListener("click", function (e) {
      // 1. Cancel registration click
      var cancelBtn = e.target.closest(".cancel-this-registration-btn, .workshop-cancel-btn, .workshop-unregister-btn, [data-action='cancel-registration']");
      if (cancelBtn) {
        e.preventDefault();
        e.stopPropagation();
        var workshopId = parseInt(cancelBtn.getAttribute("data-workshop-id"), 10);
        if (!workshopId) {
          var card = cancelBtn.closest("[data-workshop-id]");
          if (card) workshopId = parseInt(card.getAttribute("data-workshop-id"), 10);
        }
        if (!workshopId) {
          var modal = cancelBtn.closest("#workshopRegistrationModal");
          if (modal) {
            var form = modal.querySelector("[data-registration-form]");
            if (form && form.dataset.workshopId) workshopId = parseInt(form.dataset.workshopId, 10);
          }
        }
        if (workshopId) {
          window.WorkshopReg.requestCancel(workshopId);
        }
        return;
      }

      // 2. Register button click
      var regBtn = e.target.closest(".workshop-register-btn");
      if (regBtn) {
        e.preventDefault();
        var workshopId = parseInt(regBtn.getAttribute("data-workshop-id"), 10);
        if (workshopId) window.WorkshopReg.register(workshopId);
      }
    });

    document.querySelectorAll(".workshop-register-btn").forEach(function (btn) {
      var workshopId = parseInt(btn.getAttribute("data-workshop-id"), 10);
      if (workshopId) window.WorkshopReg.updateUI(workshopId);
    });
  }

  /* ============================================================
     WORKSHOPS FILTERING & PAGE LOGIC
  ============================================================ */
  function getAuthorAvatar(name, customAvatar) {
    if (customAvatar && customAvatar.indexOf("placeholder") === -1 && customAvatar.indexOf("placehold.co") === -1) {
      return customAvatar;
    }
    var authorMap = {
      "sarah mitchell": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      "sarah m.": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      "emma laurent": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      "marco rivera": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
      "yuki tanaka": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
      "david chen": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      "lisa park": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
      "emily rodriguez": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
      "james thompson": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
      "sarah kim": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=120&q=80"
    };
    var lowerName = (name || "").toLowerCase().trim();
    if (authorMap[lowerName]) return authorMap[lowerName];
    if (customAvatar) return customAvatar;

    var initials = (name || "AC").split(" ").map(function(w){ return w.charAt(0); }).join("").substring(0, 2).toUpperCase() || "AC";
    var colors = ["#E85D3A", "#3A7BDE", "#28a745", "#9b59b6", "#F4A825", "#e83e8c", "#17a2b8", "#6c757d"];
    var hash = 0;
    for (var i = 0; i < lowerName.length; i++) hash = lowerName.charCodeAt(i) + ((hash << 5) - hash);
    var color = colors[Math.abs(hash) % colors.length];
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="' + encodeURIComponent(color) + '"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="44" font-weight="bold" fill="%23ffffff">' + initials + '</text></svg>';
  }

  function getWorkshopInstructor(workshop) {
    var instructors = window.AppData && window.AppData.instructors;
    var profile = workshop && instructors && instructors[workshop.instructorId];
    if (profile) return profile;
    return {
      name: workshop && workshop.instructor ? workshop.instructor : "ArtCraft Instructor",
      avatar: getAuthorAvatar(workshop && workshop.instructor, workshop && workshop.instructorAvatar)
    };
  }

  function isUpcomingWorkshop(w) {
    if (!w || !w.date) return true;
    var now = new Date();
    now.setHours(0, 0, 0, 0);

    var parts = (w.date || "").split("-");
    if (parts.length === 3) {
      var year = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10) - 1;
      var day = parseInt(parts[2], 10);
      var wDate = new Date(year, month, day);

      if (w.time) {
        var match = w.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (match) {
          var hours = parseInt(match[1], 10);
          var minutes = parseInt(match[2], 10);
          var ampm = match[3].toUpperCase();
          if (ampm === "PM" && hours < 12) hours += 12;
          if (ampm === "AM" && hours === 12) hours = 0;
          wDate.setHours(hours, minutes, 0, 0);
          return wDate.getTime() >= new Date().getTime();
        }
      }
      wDate.setHours(23, 59, 59, 999);
      return wDate.getTime() >= new Date().getTime();
    }

    var fallbackDate = new Date(w.date);
    fallbackDate.setHours(23, 59, 59, 999);
    return isNaN(fallbackDate.getTime()) ? true : fallbackDate.getTime() >= new Date().getTime();
  }

  function initWorkshopsPage() {
    var grid = document.getElementById("workshops-grid");
    if (!grid) return;
    // Prevent double-initialization (called from both init() and inline script)
    if (grid.dataset.workshopsInitialized === "true") return;
    grid.dataset.workshopsInitialized = "true";

    var headingTitle = document.getElementById("workshops-heading-title");
    var headingSubtitle = document.getElementById("workshops-heading-subtitle");
    var allWorkshops = (window.AppData && Array.isArray(window.AppData.workshops)) ? window.AppData.workshops : [];

    function getWorkshopInstructor(w) {
      if (!w) return { name: "ArtCraft Instructor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" };
      if (w.instructorId && window.AppData && window.AppData.instructors && window.AppData.instructors[w.instructorId]) {
        return window.AppData.instructors[w.instructorId];
      }
      return {
        name: w.instructor || "ArtCraft Instructor",
        avatar: w.instructorAvatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
      };
    }

    function renderWorkshops(list) {
      if (!list || list.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5">' +
          '<div class="p-4 mx-auto rounded-3 border" style="max-width:480px; background:var(--bg-card);">' +
          '<i class="fas fa-calendar-times fa-3x text-muted mb-3" style="opacity:0.5;display:block;"></i>' +
          '<h4 class="fw-bold mb-2">No workshops found</h4>' +
          '<p class="text-muted mb-3">No workshops matched the selected filter. Try selecting "All" or a different category.</p>' +
          '<button type="button" class="btn btn-primary btn-sm reset-filter-btn"><i class="fas fa-undo me-1"></i> View All Workshops</button>' +
          '</div></div>';
        return;
      }

      grid.innerHTML = list.map(function (w, index) {
        var seatsLeft = Math.max(0, (w.seatsTotal || 0) - (w.seatsTaken || 0));
        var level = w.skillLevel || "All Levels";
        var categorySlug = (w.category || "art").toLowerCase();
        var levelSlug = level.toLowerCase();
        var animDelay = (index * 0.06) + "s";

        // Category display name
        var categoryDisplayMap = { painting: "Painting", crafting: "Crafting", drawing: "Drawing & Sketching", origami: "Origami" };
        var categoryDisplay = categoryDisplayMap[categorySlug] || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

        var instructor = getWorkshopInstructor(w);

        return '<div class="col-md-6 col-lg-4 workshop-card-item" data-category="' + categorySlug + '" data-level="' + levelSlug + '" style="animation-delay:' + animDelay + ';">' +
          '<div class="card-art h-100 d-flex flex-column" style="border:1px solid var(--border-color);">' +
          '<a href="workshop-details.html?id=' + w.id + '" class="card-img-top d-block overflow-hidden position-relative" style="height:220px;" aria-label="View ' + w.title + ' details">' +
          '<img src="' + w.image + '" alt="' + w.title + '" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy">' +
          '<div style="position:absolute; top:12px; left:12px; display:flex; gap:6px; flex-wrap:wrap; pointer-events:none;">' +
          '<span style="background:rgba(0,0,0,0.65); backdrop-filter:blur(4px); color:#fff; font-size:0.75rem; font-weight:600; padding:4px 12px; border-radius:20px; text-transform:capitalize;">' + categoryDisplay + '</span>' +
          '</div>' +
          '</a>' +
          '<div class="card-body d-flex flex-column flex-grow-1 p-4">' +
          '<div class="d-flex align-items-center gap-2 mb-2">' +
          '<img src="' + instructor.avatar + '" alt="' + instructor.name + '" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">' +
          '<small class="text-muted fw-medium">' + instructor.name + '</small>' +
          '</div>' +
          '<h5 class="card-title mb-2"><a href="workshop-details.html?id=' + w.id + '" class="text-decoration-none" style="color:var(--text-primary);">' + w.title + '</a></h5>' +
          '<p class="card-text text-muted flex-grow-1 mb-3" style="font-size:0.9rem; line-height:1.5;">' + (w.description ? w.description.substring(0, 100) + "..." : "") + '</p>' +
          '<div class="d-flex flex-wrap gap-3 mb-3 pb-3 border-bottom" style="font-size:0.82rem; color:var(--text-muted);">' +
          '<span><i class="fas fa-calendar-alt text-primary me-1"></i> ' + (w.date || "Upcoming") + '</span>' +
          '<span><i class="fas fa-clock text-primary me-1"></i> ' + (w.time || "TBD") + '</span>' +
          '<span><i class="fas fa-map-marker-alt text-primary me-1"></i> ' + (w.location || "Studio") + '</span>' +
          '</div>' +
          '<div class="workshop-card-action-row d-flex justify-content-between align-items-center mt-auto">' +
          '<div class="workshop-card-price-wrap d-flex align-items-baseline gap-2">' +
          '<span class="fw-bold text-primary fs-5">$' + (w.price || 0) + '</span>' +
          '<small class="text-muted ms-2">' + seatsLeft + ' seats left</small></div>' +
          '<a href="workshop-details.html?id=' + w.id + '" class="btn btn-primary btn-sm workshop-register-btn" data-workshop-id="' + w.id + '">Register Now</a>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';
      }).join("");

      if (window.WorkshopReg) {
        list.forEach(function (w) { window.WorkshopReg.updateUI(w.id); });
      }
    }

    var workshopBannerMap = {
      all: {
        pill: "Hands-on Creative Learning",
        heading: "Creative Workshops",
        desc: "Learn from expert artists and crafters in hands-on sessions. From watercolor to origami, find your next creative adventure.",
        image: "images/ws-hero-all-studio.jpg",
        alt: "Creative art workshops and loft studio learning space"
      },
      upcoming: {
        pill: "Scheduled Sessions",
        heading: "Upcoming Workshops & Events",
        desc: "Explore our upcoming creative sessions, master new artistic techniques, and reserve your seat today.",
        image: "images/ws-hero-upcoming-studio.jpg",
        alt: "Hands-on creative art studio workshop session with students painting"
      },
      beginner: {
        pill: "Start Your Creative Journey",
        heading: "Beginner Art Workshops",
        desc: "Foundational, beginner-friendly workshops with gentle step-by-step guidance. No prior experience needed.",
        image: "images/ws-watercolor-basics.jpg",
        alt: "Beginner watercolor palette, brushes, and foundational materials"
      },
      intermediate: {
        pill: "Skill Advancement",
        heading: "Intermediate Workshops",
        desc: "Take your technique further with specialized instruction in color theory, fluid acrylics, and structural sketching.",
        image: "images/ws-urban-sketching.jpg",
        alt: "Intermediate artist loft studio with drawing studies and canvases"
      },
      advanced: {
        pill: "Masterclass Series",
        heading: "Advanced Masterclasses",
        desc: "High-level artistic masterclasses focusing on anatomical precision, realistic rendering, and masterwork execution.",
        image: "images/advanced-charcoal-portrait.jpg",
        alt: "Advanced classical realistic portrait drawing on artist easel"
      },
      painting: {
        pill: "Fine Art & Color",
        heading: "Painting Workshops",
        desc: "Explore watercolor washes, fluid acrylic pouring, and expressive brushwork taught by master painters.",
        image: "images/advanced-oil-painting-technique.jpg",
        alt: "Fine art painting masterclass with palette knife and canvas"
      },
      crafting: {
        pill: "Artisanal & DIY",
        heading: "Crafting & Handmade Workshops",
        desc: "Create handmade pottery, hand-built ceramics, and scented soy candles with expert crafters.",
        image: "images/workshop-pottery-clay-sculpting.jpg",
        alt: "Handmade artisanal ceramics and clay pottery"
      },
      drawing: {
        pill: "Lines, Form & Lettering",
        heading: "Drawing & Sketching Workshops",
        desc: "Master modern brush calligraphy, plein-air urban sketching, and classical graphite portraiture.",
        image: "images/ws-modern-calligraphy.jpg",
        alt: "Calligraphy dip pens, ink bottles, and fine drawing materials"
      },
      origami: {
        pill: "Paper Craft & Sculptures",
        heading: "Origami & Paper Art Workshops",
        desc: "Discover the meditative art of Japanese paper folding, modular geometry, and intricate paper sculptures.",
        image: "images/origami-paper-collection.jpg",
        alt: "Origami paper folding collection and geometric paper art"
      }
    };

    function applyFilter(cat) {
      var rawCat = (cat || "all").toLowerCase().trim();
      if (rawCat === "drawing & sketching" || rawCat === "sketching") rawCat = "drawing";

      // Update active button state - only one active button at a time
      document.querySelectorAll(".workshop-filter-btn, .category-filter-btn").forEach(function (b) {
        var bCat = (b.getAttribute("data-category") || "").toLowerCase().trim();
        if (bCat === "drawing & sketching" || bCat === "sketching") bCat = "drawing";
        if (bCat === rawCat) {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      });

      var filtered = [];
      var titleText = "All Workshops";
      var countText = "";

      if (rawCat === "all" || rawCat === "") {
        filtered = allWorkshops.slice();
        titleText = "All Workshops";
        countText = "Showing all " + filtered.length + " available workshops";
      } else if (rawCat === "upcoming") {
        filtered = allWorkshops.filter(function (w) {
          return isUpcomingWorkshop(w);
        });
        titleText = "Upcoming Workshops";
        countText = "Showing " + filtered.length + " upcoming workshop" + (filtered.length === 1 ? "" : "s");
      } else if (rawCat === "beginner") {
        filtered = allWorkshops.filter(function (w) {
          return (w.skillLevel || "").toLowerCase().trim() === "beginner";
        });
        titleText = "Beginner Workshops";
        countText = "Showing " + filtered.length + " beginner workshop" + (filtered.length === 1 ? "" : "s");
      } else if (rawCat === "intermediate") {
        filtered = allWorkshops.filter(function (w) {
          return (w.skillLevel || "").toLowerCase().trim() === "intermediate";
        });
        titleText = "Intermediate Workshops";
        countText = "Showing " + filtered.length + " intermediate workshop" + (filtered.length === 1 ? "" : "s");
      } else if (rawCat === "advanced") {
        filtered = allWorkshops.filter(function (w) {
          return (w.skillLevel || "").toLowerCase().trim() === "advanced";
        });
        titleText = "Advanced Workshops";
        countText = "Showing " + filtered.length + " advanced workshop" + (filtered.length === 1 ? "" : "s");
      } else if (rawCat === "painting") {
        filtered = allWorkshops.filter(function (w) {
          return (w.category || "").toLowerCase().trim() === "painting";
        });
        titleText = "Painting Workshops";
        countText = "Showing " + filtered.length + " painting workshop" + (filtered.length === 1 ? "" : "s");
      } else if (rawCat === "crafting") {
        filtered = allWorkshops.filter(function (w) {
          return (w.category || "").toLowerCase().trim() === "crafting";
        });
        titleText = "Crafting Workshops";
        countText = "Showing " + filtered.length + " crafting workshop" + (filtered.length === 1 ? "" : "s");
      } else if (rawCat === "drawing") {
        filtered = allWorkshops.filter(function (w) {
          var c = (w.category || "").toLowerCase().trim();
          return c === "drawing" || c === "sketching" || c === "drawing & sketching";
        });
        titleText = "Drawing & Sketching Workshops";
        countText = "Showing " + filtered.length + " drawing & sketching workshop" + (filtered.length === 1 ? "" : "s");
      } else if (rawCat === "origami") {
        filtered = allWorkshops.filter(function (w) {
          return (w.category || "").toLowerCase().trim() === "origami";
        });
        titleText = "Origami Workshops";
        countText = "Showing " + filtered.length + " origami workshop" + (filtered.length === 1 ? "" : "s");
      } else {
        // Fallback for custom category/level
        filtered = allWorkshops.filter(function (w) {
          var c = (w.category || "").toLowerCase().trim();
          var l = (w.skillLevel || "").toLowerCase().trim();
          return c === rawCat || l === rawCat;
        });
        var displayLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
        titleText = displayLabel + " Workshops";
        countText = "Showing " + filtered.length + " workshop" + (filtered.length === 1 ? "" : "s");
      }

      if (headingTitle) headingTitle.textContent = titleText;
      if (headingSubtitle) headingSubtitle.textContent = countText;

      // Update Hero Banner dynamically according to the selected filter
      var heroImg = document.getElementById("workshops-hero-img");
      var heroHeading = document.getElementById("workshops-hero-heading");
      var heroDesc = document.getElementById("workshops-hero-desc");
      var heroPillText = document.getElementById("workshops-hero-pill-text");

      var bannerData = workshopBannerMap[rawCat] || workshopBannerMap["all"];
      if (bannerData) {
        if (heroHeading) heroHeading.textContent = bannerData.heading;
        if (heroDesc) heroDesc.textContent = bannerData.desc;
        if (heroPillText) heroPillText.textContent = bannerData.pill;
        if (heroImg) {
          heroImg.src = bannerData.image;
          heroImg.alt = bannerData.alt;
          if (heroImg.setAttribute) {
            heroImg.setAttribute("src", bannerData.image);
            heroImg.setAttribute("alt", bannerData.alt);
          }
        }
      }

      // Update URL query parameter without page reload
      if (window.history && window.history.replaceState) {
        var cleanCat = rawCat === "all" ? "" : "?category=" + encodeURIComponent(rawCat);
        var newUrl = window.location.pathname + cleanCat;
        window.history.replaceState(null, "", newUrl);
      }

      renderWorkshops(filtered);
    }

    // Direct click listeners on buttons
    document.querySelectorAll(".workshop-filter-btn, .category-filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var cat = this.getAttribute("data-category") || "all";
        applyFilter(cat);
      });
    });

    // Delegated click listener for fallback & reset button
    document.addEventListener("click", function (e) {
      var resetBtn = e.target.closest(".reset-filter-btn");
      if (resetBtn) {
        e.preventDefault();
        applyFilter("all");
        return;
      }
      var btn = e.target.closest(".workshop-filter-btn, .category-filter-btn");
      if (btn && btn.closest("#workshop-filter-group, .workshop-filter-pills, .workshop-filter-container")) {
        e.preventDefault();
        var cat = btn.getAttribute("data-category") || "all";
        applyFilter(cat);
        return;
      }
    });

    // Initial filter on load (check URL parameters if any)
    var urlParams = new URLSearchParams(window.location.search);
    var initialCategory = urlParams.get("category") || urlParams.get("level") || urlParams.get("filter") || "all";
    applyFilter(initialCategory);
  }

  window.initWorkshopsPage = initWorkshopsPage;

  /* ============================================================
     FORM VALIDATION
  ============================================================ */
  function validateField(input) {
    var value = input.value.trim();
    var type = input.getAttribute("type");
    var name = input.getAttribute("name");
    var isValid = true;
    var message = "";

    if (input.hasAttribute("required") && !value) {
      isValid = false;
      message = "This field is required";
    } else if (type === "email" && value) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = "Please enter a valid email";
      }
    } else if (type === "tel" && value) {
      var phoneRegex = /^[\+]?[\d\s\-\(\)]{7,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        message = "Please enter a valid phone number";
      }
    } else if (name === "password_confirm" || name === "confirmPassword") {
      var password = input.closest("form").querySelector('[name="password"]');
      if (password && password.value !== value) {
        isValid = false;
        message = "Passwords do not match";
      }
    }

    var targetContainer = input.closest(".newsletter-input-wrap") || input.parentElement;
    var errorEl = targetContainer.querySelector(".invalid-feedback, .field-error");
    var existingGroup = targetContainer.querySelector(".field-error");
    if (existingGroup) existingGroup.remove();

    input.classList.remove("is-invalid", "is-valid");

    if (!isValid) {
      input.classList.add("is-invalid");
      var errEl = document.createElement("div");
      errEl.className = "invalid-feedback field-error";
      errEl.textContent = message;
      targetContainer.appendChild(errEl);
    } else if (value) {
      input.classList.add("is-valid");
    }

    return isValid;
  }
  window.validateField = validateField;

  function validateForm(form) {
    var inputs = form.querySelectorAll("[required], [type='email'], [type='tel']");
    var allValid = true;
    inputs.forEach(function (input) {
      if (!validateField(input)) allValid = false;
    });
    return allValid;
  }

  function initForms() {
    document.addEventListener("blur", function (e) {
      if (e.target.matches("input, textarea, select")) {
        validateField(e.target);
      }
    }, true);

    document.addEventListener("input", function (e) {
      if (e.target.matches("input, textarea, select") && e.target.classList.contains("is-invalid")) {
        validateField(e.target);
      }
    }, true);

    document.querySelectorAll("form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (validateForm(form)) {
          showToast("Form submitted successfully!", "success");
          form.classList.add("submitted");
        } else {
          showToast("Please fix the errors in the form", "error");
        }
      });
    });
  }

  /* ============================================================
     SCROLL ANIMATIONS
  ============================================================ */
  function initScrollAnimations() {
    if (!("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll(".animate-on-scroll").forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     SCROLL TO TOP
  ============================================================ */
  function initScrollTop() {
    var btn = document.querySelector(".scroll-top, #scroll-top");
    if (!btn) return;

    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        btn.classList.add("visible");
        btn.style.display = "flex";
      } else {
        btn.classList.remove("visible");
        btn.style.display = "none";
      }
    }, { passive: true });

    btn.style.display = "none";

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============================================================
     NEWSLETTER FORM
  ============================================================ */
  function initNewsletter() {
    document.querySelectorAll(".newsletter-form, #newsletter-form, .sidebar-newsletter-form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = form.querySelector("input[type='email']");
        if (email) {
          if (validateField(email)) {
            showToast("Thanks for subscribing!", "success");
            email.value = "";
            email.classList.remove("is-valid");
          } else {
            showToast("Please enter a valid email address", "error");
          }
        }
      });
    });
  }

  /* ============================================================
     COUNTDOWN TIMER
  ============================================================ */
  window.Countdown = {
    interval: null,
    init: function (targetDate) {
      if (this.interval) clearInterval(this.interval);
      var self = this;
      function update() {
        var now = new Date().getTime();
        var target = new Date(targetDate).getTime();
        var diff = target - now;

        if (diff <= 0) {
          clearInterval(self.interval);
          self.setDisplay(0, 0, 0, 0);
          return;
        }

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);
        self.setDisplay(days, hours, minutes, seconds);
      }
      update();
      this.interval = setInterval(update, 1000);
    },
    setDisplay: function (days, hours, minutes, seconds) {
      var daysEl = document.querySelector(".countdown-days");
      var hoursEl = document.querySelector(".countdown-hours");
      var minutesEl = document.querySelector(".countdown-minutes");
      var secondsEl = document.querySelector(".countdown-seconds");
      if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
    }
  };

  /* ============================================================
     IMAGE GALLERY (Product Details)
  ============================================================ */
  function initImageGallery() {
    var mainImage = document.querySelector(".product-main-image, .gallery-main-image");
    if (!mainImage) return;

    document.querySelectorAll(".gallery-thumb, .product-thumb").forEach(function (thumb) {
      thumb.addEventListener("click", function (e) {
        e.preventDefault();
        var newSrc = this.getAttribute("data-image") || this.querySelector("img")?.getAttribute("src");
        if (newSrc) {
          mainImage.style.opacity = "0.5";
          setTimeout(function () {
            mainImage.src = newSrc;
            mainImage.style.opacity = "1";
          }, 150);
        }
        document.querySelectorAll(".gallery-thumb, .product-thumb").forEach(function (t) {
          t.classList.remove("active", "border-primary");
        });
        thumb.classList.add("active", "border-primary");
      });
    });

    if (mainImage) {
      mainImage.style.transition = "opacity 0.15s ease";
    }
  }

  /* ============================================================
     TAB NAVIGATION
  ============================================================ */
  function initTabs() {
    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(function (tab) {
      tab.addEventListener("shown.bs.tab", function (e) {
        var target = document.querySelector(e.target.getAttribute("href") || e.target.getAttribute("data-bs-target"));
        if (target) {
          target.style.opacity = "0";
          target.style.transform = "translateY(10px)";
          setTimeout(function () {
            target.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            target.style.opacity = "1";
            target.style.transform = "translateY(0)";
          }, 50);
        }
      });
    });
  }

  /* ============================================================
     LOGIN / REGISTER DEMO AUTH
  ============================================================ */
  window.Auth = {
    login: function (email, password) {
      if (!email || !password) return false;
      var user = { email: email, name: email.split("@")[0], loggedIn: true };
      localStorage.setItem("authUser", JSON.stringify(user));
      this.updateNavbar();
      showToast("Welcome back, " + user.name + "!", "success");
      return true;
    },
    register: function (data) {
      if (!data || !data.email) return false;
      var user = { email: data.email, name: data.name || data.email.split("@")[0], loggedIn: true };
      localStorage.setItem("authUser", JSON.stringify(user));
      this.updateNavbar();
      showToast("Account created successfully! Welcome, " + user.name + "!", "success");
      return true;
    },
    logout: function () {
      localStorage.removeItem("authUser");
      this.updateNavbar();
      showToast("You've been logged out", "info");
    },
    isLoggedIn: function () {
      var user = this.getUser();
      return user && user.loggedIn;
    },
    getUser: function () {
      try {
        return JSON.parse(localStorage.getItem("authUser"));
      } catch (e) {
        return null;
      }
    },
    updateNavbar: function () {
      var user = this.getUser();
      var authContainer = document.querySelector(".auth-container, .user-menu");
      if (!authContainer) return;

      if (user && user.loggedIn) {
        authContainer.innerHTML = '<div class="dropdown"><a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle" data-bs-toggle="dropdown"><i class="fas fa-user-circle me-2"></i><span class="d-none d-md-inline">' + user.name + '</span></a><ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i> Profile</a></li><li><a class="dropdown-item" href="#"><i class="fas fa-box me-2"></i> My Orders</a></li><li><hr class="dropdown-divider"></li><li><a class="dropdown-item logout-btn" href="#"><i class="fas fa-sign-out-alt me-2"></i> Logout</a></li></ul></div>';
        var logoutBtn = authContainer.querySelector(".logout-btn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            window.Auth.logout();
          });
        }
      } else {
        authContainer.innerHTML = '<a href="login.html" class="nav-link"><i class="fas fa-sign-in-alt me-1"></i> Login</a>';
      }
    }
  };

  function initAuthForms() {
    var loginForm = document.querySelector("#login-form, form.login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = loginForm.querySelector('[name="email"], [type="email"]');
        var password = loginForm.querySelector('[name="password"], [type="password"]');
        if (email && password && email.value && password.value) {
          window.Auth.login(email.value, password.value);
        }
      });
    }

    var registerForm = document.querySelector("#register-form, form.register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = registerForm.querySelector('[name="name"]');
        var email = registerForm.querySelector('[name="email"], [type="email"]');
        var password = registerForm.querySelector('[name="password"], [type="password"]');
        if (email && password && email.value && password.value) {
          window.Auth.register({ name: name ? name.value : "", email: email.value });
        }
      });
    }

    window.Auth.updateNavbar();
  }

  /* ============================================================
     CHECKOUT
  ============================================================ */
  window.Checkout = {
    processOrder: function () {
      var form = document.querySelector("#checkout-form, form.checkout-form");
      if (form && !validateForm(form)) {
        showToast("Please complete all required fields", "error");
        return false;
      }

      var cartItems = window.Cart.getItems();
      if (cartItems.length === 0) {
        showToast("Your cart is empty", "error");
        return false;
      }

      var order = {
        id: "ORD-" + Date.now(),
        items: cartItems,
        total: window.Cart.getTotal(),
        date: new Date().toISOString(),
        status: "confirmed"
      };

      var orders = [];
      try {
        orders = JSON.parse(localStorage.getItem("orders")) || [];
      } catch (e) {
        orders = [];
      }
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      window.Cart.clear();
      showToast("Order placed successfully! Order ID: " + order.id, "success");

      var successEl = document.querySelector(".checkout-success, #checkout-success");
      if (successEl) {
        successEl.style.display = "block";
        successEl.querySelector(".order-id").textContent = order.id;
      }

      var checkoutForm = document.querySelector("#checkout-form, form.checkout-form");
      if (checkoutForm) checkoutForm.style.display = "none";

      return true;
    }
  };

  function initCheckout() {
    document.addEventListener("click", function (e) {
      if (e.target.closest(".place-order-btn")) {
        e.preventDefault();
        window.Checkout.processOrder();
      }
    });
  }

  /* ============================================================
     NUMBER INPUT CONTROLS
  ============================================================ */
  function initNumberInputs() {
    document.addEventListener("click", function (e) {
      var quantityBtn = e.target.closest(".qty-btn");
      if (!quantityBtn) return;
      
      // If inside cart-item-card or cart page, cart.html handles it directly via Cart.changeQuantity
      if (quantityBtn.closest(".cart-item-card") || document.getElementById("cart-items")) {
        return;
      }

      e.preventDefault();
      var input = quantityBtn.parentElement ? quantityBtn.parentElement.querySelector("input[type='number'], .quantity-input") : null;
      if (!input) return;

      var current = parseInt(input.value, 10) || 1;
      var min = parseInt(input.getAttribute("min"), 10) || 1;
      var max = parseInt(input.getAttribute("max"), 10) || 999;

      if (quantityBtn.classList.contains("qty-minus") || quantityBtn.classList.contains("minus")) {
        input.value = Math.max(min, current - 1);
      } else if (quantityBtn.classList.contains("qty-plus") || quantityBtn.classList.contains("plus")) {
        input.value = Math.min(max, current + 1);
      }

      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  /* ============================================================
     BLOG FILTERING & RENDERING
  ============================================================ */
  var blogState = {
    category: "all",
    search: "",
    currentPage: 1,
    postsPerPage: 12
  };

  function normalizeBlogCategory(category) {
    if (!category || category.toLowerCase() === "all") return "all";
    return String(category).toLowerCase().trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function getBlogPostById(id) {
    var posts = (window.AppData && Array.isArray(window.AppData.blogPosts)) ? window.AppData.blogPosts : [];
    var postId = parseInt(id, 10);
    return posts.find(function (post) { return post.id === postId; }) || null;
  }

  function getBlogAuthor(post) {
    return post && post.author && typeof post.author === "object"
      ? post.author
      : { name: "ArtCraft Editorial", avatar: "" };
  }

  function renderBlogCards(posts, container, paginationContainer) {
    if (!container) return;

    var total = (posts && Array.isArray(posts)) ? posts.length : 0;

    // Update dynamic article count text
    var countEl = document.getElementById("blog-count");
    var countTextEl = document.getElementById("blog-count-text");
    if (countEl) countEl.textContent = total;
    if (countTextEl) {
      if (total === 0) {
        countTextEl.innerHTML = 'Showing <strong class="text-primary">0</strong> articles';
      } else if (total === 1) {
        countTextEl.innerHTML = 'Showing <strong class="text-primary">1</strong> article';
      } else {
        countTextEl.innerHTML = 'Showing <strong class="text-primary">' + total + '</strong> articles';
      }
    }

    if (!posts || posts.length === 0) {
      container.innerHTML =
        '<div class="col-12 text-center py-5" style="opacity:1 !important; visibility:visible !important;">' +
        '<i class="fas fa-search fa-3x text-muted mb-3" style="opacity:0.5;"></i>' +
        '<h4 class="fw-semibold" style="color:var(--text-primary);">No articles found</h4>' +
        '<p class="text-muted mb-4">No blog articles matched your current filter or search criteria.</p>' +
        '<button class="btn btn-primary btn-sm" id="btn-reset-filters" style="border-radius:var(--radius-sm); padding:8px 20px;">Reset All Filters</button>' +
        '</div>';
      if (paginationContainer) paginationContainer.innerHTML = "";
      var resetBtn = document.getElementById("btn-reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          var searchInput = document.querySelector(".blog-search, #blog-search, .blog-search-input");
          if (searchInput) searchInput.value = "";
          blogState.currentPage = 1;
          filterBlogPosts("all", "");
        });
      }
      return;
    }

    // Paginate through posts
    var totalPages = Math.ceil(total / blogState.postsPerPage);
    if (blogState.currentPage > totalPages) blogState.currentPage = 1;
    var startIdx = (blogState.currentPage - 1) * blogState.postsPerPage;
    var pagePosts = posts.slice(startIdx, startIdx + blogState.postsPerPage);

    container.innerHTML = pagePosts.map(function (post) {
      var excerptText = post.excerpt ? (post.excerpt.length > 120 ? post.excerpt.substring(0, 120) + "..." : post.excerpt) : "";
      var postCategory = post.category || (Array.isArray(post.categories) ? post.categories[0] : "Article");
      var postImg = post.image;
      var author = getBlogAuthor(post);
      var postAuthor = author.name;
      var postAvatar = author.avatar;
      var postDate = post.date || "July 2026";
      var postRead = post.readTime || "5 min read";

      return '<div class="col-md-6 col-lg-4 d-flex">' +
        '<div class="card-art w-100 h-100 d-flex flex-column" style="opacity:1 !important; visibility:visible !important;">' +
        '<div class="card-img-top overflow-hidden" style="height:200px; position:relative;">' +
        '<img src="' + postImg + '" alt="' + (post.title || "Blog Article") + '" style="width:100%;height:100%;object-fit:cover;display:block;">' +
        '</div>' +
        '<div class="card-body d-flex flex-column flex-grow-1" style="padding:20px;">' +
        '<div class="d-flex justify-content-between align-items-center mb-2">' +
        '<span class="badge" style="background:var(--primary-light);color:var(--primary);font-weight:600;font-size:0.8rem;padding:4px 10px;border-radius:4px;">' + postCategory + '</span>' +
        '<small class="text-muted" style="font-size:0.8rem;">' + postRead + '</small>' +
        '</div>' +
        '<h5 class="card-title mb-2"><a href="blog-details.html?id=' + post.id + '" class="text-decoration-none" style="color:var(--text-primary);font-weight:600;font-size:1.1rem;line-height:1.4;">' + (post.title || "Article") + '</a></h5>' +
        '<p class="card-text flex-grow-1 text-muted mb-3" style="font-size:0.9rem;line-height:1.5;">' + excerptText + '</p>' +
        '<div class="blog-card-footer mt-auto pt-3" style="border-top:1px solid var(--border-color);">' +
        '<div class="blog-author-row d-flex align-items-center gap-2 mb-3">' +
        '<img src="' + postAvatar + '" alt="' + postAuthor + '" style="width:34px;height:34px;border-radius:50%;object-fit:cover;flex-shrink:0;">' +
        '<div class="me-auto" style="min-width:0;"><small class="fw-medium d-block text-truncate" style="color:var(--text-primary);font-size:0.85rem;">' + postAuthor + '</small><small class="text-muted" style="font-size:0.75rem;">' + postDate + '</small></div>' +
        '</div>' +
        '<div class="blog-card-btn-wrap d-flex justify-content-center align-items-center w-100">' +
        '<a href="blog-details.html?id=' + post.id + '" class="btn btn-outline btn-sm blog-read-more-btn" style="font-size:0.8rem;padding:6px 18px;white-space:nowrap;">Read More <i class="fas fa-arrow-right ms-1"></i></a>' +
        '</div>' +
        '</div>' +
        '</div></div></div>';
    }).join("");

    // Render pagination if multiple pages exist
    if (paginationContainer) {
      if (totalPages <= 1) {
        paginationContainer.innerHTML = "";
      } else {
        var pagHtml = '<nav aria-label="Blog pagination" class="w-100 d-flex justify-content-center"><ul class="pagination justify-content-center mb-0">';
        
        // Prev button
        pagHtml += '<li class="page-item ' + (blogState.currentPage === 1 ? 'disabled' : '') + '">' +
          '<button class="page-link page-link-art" data-page="' + (blogState.currentPage - 1) + '" ' + (blogState.currentPage === 1 ? 'disabled' : '') + ' aria-label="Previous">&laquo;</button></li>';
        
        // Page numbers
        for (var p = 1; p <= totalPages; p++) {
          pagHtml += '<li class="page-item ' + (p === blogState.currentPage ? 'active' : '') + '">' +
            '<button class="page-link page-link-art ' + (p === blogState.currentPage ? 'active' : '') + '" data-page="' + p + '">' + p + '</button></li>';
        }
        
        // Next button
        pagHtml += '<li class="page-item ' + (blogState.currentPage === totalPages ? 'disabled' : '') + '">' +
          '<button class="page-link page-link-art" data-page="' + (blogState.currentPage + 1) + '" ' + (blogState.currentPage === totalPages ? 'disabled' : '') + ' aria-label="Next">&raquo;</button></li>';
        
        pagHtml += '</ul></nav>';
        paginationContainer.innerHTML = pagHtml;

        paginationContainer.querySelectorAll("button[data-page]").forEach(function(btn) {
          btn.addEventListener("click", function(e) {
            e.preventDefault();
            var targetPage = parseInt(this.getAttribute("data-page"), 10);
            if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages && targetPage !== blogState.currentPage) {
              blogState.currentPage = targetPage;
              filterBlogPosts(blogState.category, blogState.search, false);
              var gridElem = document.getElementById("blog-container");
              if (gridElem) {
                gridElem.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }
          });
        });
      }
    }
  }

  function filterBlogPosts(category, search, resetPage) {
    if (resetPage !== false) {
      blogState.currentPage = 1;
    }
    blogState.category = category || "all";
    if (search !== undefined) {
      blogState.search = search;
    }

    var posts = (window.AppData && window.AppData.blogPosts) ? window.AppData.blogPosts : [];
    var searchStr = (blogState.search || "").toLowerCase().trim();
    var catTarget = normalizeBlogCategory(blogState.category);

    // Update active visual state across category filter buttons
    document.querySelectorAll(".blog-category-btn").forEach(function (b) {
      var btnCat = normalizeBlogCategory(b.getAttribute("data-category"));
      b.classList.toggle("active", btnCat === catTarget);
    });

    function matchesCat(post) {
      if (catTarget === "all" || !catTarget) return true;
      // Filters are intentionally based on the article's primary category only.
      // Secondary `categories` values are searchable tags, not alternate listings.
      return normalizeBlogCategory(post.category) === catTarget;
    }

    var filtered = posts.filter(function (post) {
      if (!matchesCat(post)) return false;
      if (searchStr) {
        var haystack = (
          (post.title || "") + " " +
          (post.excerpt || "") + " " +
          (post.content || "") + " " +
          (getBlogAuthor(post).name || "") + " " +
          (post.category || "") + " " +
          (Array.isArray(post.categories) ? post.categories.join(" ") : "")
        ).toLowerCase();
        if (haystack.indexOf(searchStr) === -1) return false;
      }
      return true;
    });

    var container = document.querySelector(".blog-grid, .blog-list, #blog-container");
    var paginationContainer = document.getElementById("blog-pagination");
    renderBlogCards(filtered, container, paginationContainer);
  }

  function initBlogFiltering() {
    var blogContainer = document.querySelector(".blog-grid, .blog-list, #blog-container");
    if (!blogContainer) return;

    if (blogContainer.getAttribute && blogContainer.getAttribute("data-blog-initialized") === "true") {
      return;
    }
    if (blogContainer.setAttribute) {
      blogContainer.setAttribute("data-blog-initialized", "true");
    }

    // Check URL parameters for category filter
    var urlParams = new URLSearchParams(window.location.search);
    var initCat = urlParams.get("category") || "all";
    var initSearch = urlParams.get("search") || "";

    var blogSearch = document.querySelector(".blog-search, #blog-search, .blog-search-input");
    if (blogSearch && initSearch) {
      blogSearch.value = initSearch;
    }

    document.querySelectorAll(".blog-category-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var category = this.getAttribute("data-category") || "all";
        var searchInput = document.querySelector(".blog-search, #blog-search, .blog-search-input");
        var searchVal = searchInput ? searchInput.value : "";
        filterBlogPosts(category, searchVal, true);
      });
    });

    if (blogSearch) {
      var debounceTimer;
      function applyBlogSearch() {
        var activeCategory = document.querySelector(".blog-category-btn.active");
        var cat = activeCategory ? activeCategory.getAttribute("data-category") : "all";
        filterBlogPosts(cat || "all", blogSearch.value, true);
      }

      blogSearch.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          applyBlogSearch();
        }, 200);
      });

      blogSearch.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          clearTimeout(debounceTimer);
          applyBlogSearch();
        }
      });

      function submitBlogSearch(event) {
        if (event) event.preventDefault();
        clearTimeout(debounceTimer);
        applyBlogSearch();
        blogSearch.focus();
      }

      var blogSearchForm = document.getElementById("blog-search-form");
      if (blogSearchForm) {
        blogSearchForm.addEventListener("submit", submitBlogSearch);
      }
    }

    // Initial render
    filterBlogPosts(initCat, initSearch, true);
  }

  window.initBlogPage = initBlogFiltering;
  window.filterBlogPosts = filterBlogPosts;
  window.getBlogPostById = getBlogPostById;

  function initHomeBlogPreview() {
    var container = document.getElementById("home-blog-preview");
    var posts = window.AppData && window.AppData.blogPosts;
    if (!container || !Array.isArray(posts)) return;

    var featured = posts.find(function (post) { return post.featured; });
    var previewPosts = (featured ? [featured] : []).concat(posts.filter(function (post) {
      return !featured || post.id !== featured.id;
    })).slice(0, 3);

    container.innerHTML = previewPosts.map(function (post) {
      var author = getBlogAuthor(post);
      return '<div class="col-md-4 d-flex">' +
        '<div class="card-art h-100 w-100 d-flex flex-column">' +
        '<div class="card-img-top overflow-hidden"><img src="' + post.image + '" alt="' + post.title + '" style="width:100%;height:200px;object-fit:cover;"></div>' +
        '<div class="card-body d-flex flex-column flex-grow-1">' +
        '<div class="d-flex justify-content-between align-items-center mb-2"><span class="badge" style="background:var(--primary-light);color:var(--primary);">' + post.category + '</span><small class="text-muted">' + post.readTime + '</small></div>' +
        '<h5 class="card-title"><a href="blog-details.html?id=' + post.id + '" class="text-decoration-none" style="color:var(--text-primary);">' + post.title + '</a></h5>' +
        '<p class="card-text flex-grow-1 text-muted">' + post.excerpt + '</p>' +
        '<div class="d-flex align-items-center gap-2 mt-auto pt-3" style="border-top:1px solid var(--border-color);"><img src="' + author.avatar + '" alt="' + author.name + '" style="width:30px;height:30px;border-radius:50%;object-fit:cover;"><div><small class="fw-medium d-block">' + author.name + '</small><small class="text-muted">' + post.date + '</small></div></div>' +
        '<div class="blog-card-btn-wrap d-flex justify-content-center align-items-center w-100 pt-3"><a href="blog-details.html?id=' + post.id + '" class="btn btn-outline btn-sm blog-read-more-btn">Read More <i class="fas fa-arrow-right ms-1"></i></a></div>' +
        '</div></div></div>';
    }).join("");
  }

  /* ============================================================
     INIT ALL
  ============================================================ */
  function init() {
    initTheme();
    initDirection();
    initActiveNav();
    initNavbarScroll();
    initDropdowns();
    initMobileNav();
    initSearchOverlay();
    initProductCards();
    initShopPage();
    initWorkshopButtons();
    initWorkshopsPage();
    initForms();
    initScrollAnimations();
    initScrollTop();
    initNewsletter();
    initImageGallery();
    initHomeBlogPreview();
    initTabs();
    initAuthForms();
    initCheckout();
    initNumberInputs();
    initBlogFiltering();
    initScrollTop();

    if (window.Cart) window.Cart.updateBadges();
    if (window.Wishlist) {
      window.Wishlist.updateBadges();
      window.Wishlist.syncIcons();
    }

    if (document.querySelector(".countdown-days")) {
      window.Countdown.init("2026-12-31T00:00:00");
    }
  }

  /* ============================================================
     THEME & RTL EVENT LISTENERS
  ============================================================ */
  document.addEventListener("click", function (e) {
    if (e.target.closest(".theme-toggle")) {
      toggleTheme();
    }
    if (e.target.closest(".rtl-toggle")) {
      toggleDirection();
    }
    if (e.target.closest("#scroll-top, .scroll-top")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  /* ============================================================
     SCROLL-TO-TOP BUTTON
  ============================================================ */
  function initScrollTop() {
    var btn = document.getElementById("scroll-top") ||
              document.querySelector(".scroll-top");
    if (!btn) return;

    function onScroll() {
      if (window.scrollY > 300) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on load in case page is already scrolled
  }

  /* ============================================================
     BOOT
  ============================================================ */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
