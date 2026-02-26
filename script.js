document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. EFECTO DEL NAVBAR AL HACER SCROLL
       ========================================== */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================
       2. MENÚ MÓVIL (Hamburguesa)
       ========================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Cambiar icono entre barras y X
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
                // Asegurarse de que el menú móvil sea visible si el hero es muy brillante
                if (window.scrollY < 50) {
                    navbar.classList.add('scrolled');
                }
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                if (window.scrollY < 50) {
                    navbar.classList.remove('scrolled');
                }
            }
        });

        // Cerrar menú al hacer click en un enlace
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    /* ==========================================
       3. SMOOTH SCROLL PARA LOS ENLACES
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Permitir URLs que no son anclas
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Ajustar el offset por el header fijo
                const headerHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================
       4. ANIMACIONES AL HACER SCROLL (FADE IN UP)
       ========================================== */
    const fadeElements = document.querySelectorAll('.fade-in-up');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Dispara un poco antes de que toque el fondo
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: una vez animado, dejar de observar
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        scrollObserver.observe(element);
    });

    /* ==========================================
       5. INTEGRACIÓN DE PEDIDOS (WHATSAPP)
       ========================================== */
    let cart = [];
    const whatsappPhone = '584124024911';

    // Elementos del DOM
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addButtons = document.querySelectorAll('.add-to-cart-btn');

    // Abrir/Cerrar Modal
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('show');
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('show');
    });

    // Cerrar al hacer click fuera
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('show');
    });
    // Añadir al Carrito
    addButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            let product = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));

            // Check if there are select elements nearby
            const card = this.closest('.combo-card');
            if (card) {
                const selectors = card.querySelectorAll('.combo-select');
                if (selectors.length > 0) {
                    const flavors = Array.from(selectors).map(sel => sel.value);
                    const flavorsText = flavors.length === 2
                        ? `${flavors[0]} y ${flavors[1]}`
                        : flavors.map((f, i) => i === flavors.length - 1 ? `y ${f}` : f).join(', ');
                    product += ` (${flavorsText})`;
                }
            }

            // Buscar si ya existe
            const existingItem = cart.find(item => item.product === product);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ product, price, quantity: 1 });
            }

            updateCartUI();

            // Animación visual en el botón
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-check"></i> Añadido';
            this.style.backgroundColor = 'var(--color-gold)';
            this.style.color = 'white';

            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 1000);
        });
    });

    // Actualizar UI del Carrito
    function updateCartUI() {
        // Actualizar contador
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Limpiar contenedor
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                const subtotal = item.price * item.quantity;
                total += subtotal;

                const itemHTML = `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h5>${item.product} (x${item.quantity})</h5>
                            <div class="cart-item-price">$${subtotal.toFixed(2)}</div>
                        </div>
                        <i class="fa-solid fa-trash cart-item-remove" data-index="${index}"></i>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
            });
        }

        // Actualizar total
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;

        // Añadir eventos a botones de eliminar
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartUI();
            });
        });
    }

    // Finalizar Compra por WhatsApp
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Añade productos al carrito primero.');
            return;
        }

        let orderList = cart.map(item => `- ${item.quantity}x ${item.product}`).join('\n');
        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const customMessage = `Hola MaryMar, mi pedido es:\n\n${orderList}\n\nTotal a pagar: $${total.toFixed(2)}`;
        const encodedText = encodeURIComponent(customMessage);
        const wpUrl = `https://wa.me/${whatsappPhone}?text=${encodedText}`;

        window.open(wpUrl, '_blank');

        // Opcional: vaciar carrito luego de enviar
        cart = [];
        updateCartUI();
        cartModal.classList.remove('show');
    });

    /* ==========================================
       6. DESCRIPCIONES DINÁMICAS (INTERACTIVIDAD)
       ========================================== */
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productImg = card.querySelector('.product-img');
        const productTitle = card.querySelector('.product-title');
        const productDesc = card.querySelector('.product-description');

        if (productDesc) {
            // Función para alternar la visibilidad
            const toggleDesc = () => {
                productDesc.classList.toggle('show');
            };

            // Añadir eventos a la imagen y al título
            if (productImg) productImg.addEventListener('click', toggleDesc);
            if (productTitle) productTitle.addEventListener('click', toggleDesc);
        }
    });

});
