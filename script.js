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
    // Número exacto proporcionado por el usuario
    const whatsappPhone = '584124024911';

    const wpButtons = document.querySelectorAll('.wp-btn');

    wpButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Obtener el nombre del producto desde el atributo "data-product"
            const productName = this.getAttribute('data-product') || 'sus productos';

            // Mensaje predeterminado solicitado
            const customMessage = `Hola MaryMar, deseo ordenar el producto: [${productName}]`;

            // Codificar el texto para la URL (convierte espacios en %20, etc.)
            const encodedText = encodeURIComponent(customMessage);

            // URL de la API de WhatsApp
            const wpUrl = `https://wa.me/${whatsappPhone}?text=${encodedText}`;

            // Abrir en una nueva pestaña
            window.open(wpUrl, '_blank');
        });
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
