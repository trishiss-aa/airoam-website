/**
 * Airoam Partials Loader
 * Loads nav and footer from /partials/ folder
 * Handles relative paths for root vs /blog/ pages
 */
(function() {
    // Determine base path based on current page location
    var path = window.location.pathname;
    var basePath = '';
    
    // If we're in a subdirectory (like /blog/), adjust the base path
    if (path.includes('/blog/')) {
        basePath = '../';
    }
    
    // Load a partial HTML file and insert it
    function loadPartial(elementId, partialPath, callback) {
        var element = document.getElementById(elementId);
        if (!element) return;
        
        fetch(basePath + partialPath)
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to load ' + partialPath);
                return response.text();
            })
            .then(function(html) {
                // Replace {{BASE_PATH}} with actual base path
                html = html.replace(/\{\{BASE_PATH\}\}/g, basePath);
                element.innerHTML = html;
                
                // Run callback if provided
                if (callback) callback();
                
                // Dispatch event so other scripts know partial is loaded
                document.dispatchEvent(new CustomEvent('partialLoaded', { detail: elementId }));
            })
            .catch(function(err) {
                console.error(err);
            });
    }
    
    // Initialize mobile nav toggle
    function initMobileNav() {
        var hamburger = document.getElementById('nav-hamburger');
        var mobileMenu = document.getElementById('nav-mobile-menu');
        var mainNav = document.getElementById('main-nav');
        
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                mobileMenu.classList.toggle('open');
                var isOpen = mobileMenu.classList.contains('open');
                mobileMenu.setAttribute('aria-hidden', !isOpen);
            });
            
            // Close menu when clicking a link
            mobileMenu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('open');
                    mobileMenu.setAttribute('aria-hidden', 'true');
                });
            });
        }
        
        // Nav scroll behavior
        if (mainNav) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    mainNav.classList.add('scrolled');
                } else {
                    mainNav.classList.remove('scrolled');
                }
            }, { passive: true });
        }
    }
    
    // Initialize footer newsletter form
    function initFooterNewsletter() {
        var form = document.getElementById('footer-newsletter-form');
        var message = document.getElementById('footer-newsletter-message');
        
        if (form && message) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var formData = new FormData(form);
                
                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                })
                .then(function(response) {
                    if (response.ok) {
                        message.textContent = 'Thanks for subscribing!';
                        message.style.color = '#202020';
                        form.reset();
                    } else {
                        message.textContent = 'Something went wrong. Please try again.';
                        message.style.color = '#c00';
                    }
                })
                .catch(function() {
                    message.textContent = 'Something went wrong. Please try again.';
                    message.style.color = '#c00';
                });
            });
        }
    }
    
    // Load all partials
    loadPartial('nav-container', 'partials/nav.html', initMobileNav);
    loadPartial('footer-container', 'partials/footer.html', initFooterNewsletter);
})();
