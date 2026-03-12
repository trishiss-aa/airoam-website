/**
 * Airoam Partials Loader
 * Loads nav and footer from /partials/ folder
 * Handles relative paths for root vs /blog/ pages
 * Includes smooth scroll for same-page anchor links
 */
(function() {
    // Determine base path based on current page location
    var path = window.location.pathname;
    var basePath = '';
    
    // If we're in a subdirectory (like /blog/), adjust the base path
    if (path.includes('/blog/')) {
        basePath = '../';
    }
    
    // Check if we're on the homepage
    var isHomepage = path === '/' || 
                     path === '/index.html' || 
                     path.endsWith('/index.html') ||
                     path === '';
    
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
                
                // Fix same-page anchor links on homepage
                if (isHomepage) {
                    fixHomepageAnchorLinks(element);
                }
                
                // Run callback if provided
                if (callback) callback();
                
                // Dispatch event so other scripts know partial is loaded
                document.dispatchEvent(new CustomEvent('partialLoaded', { detail: elementId }));
            })
            .catch(function(err) {
                console.error(err);
            });
    }
    
    // Fix anchor links on homepage to use smooth scroll instead of page reload
    function fixHomepageAnchorLinks(container) {
        var links = container.querySelectorAll('a[href*="index.html#"]');
        links.forEach(function(link) {
            var href = link.getAttribute('href');
            var hash = href.split('#')[1];
            if (hash) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    var target = document.getElementById(hash);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Update URL hash without scrolling
                        history.pushState(null, null, '#' + hash);
                    }
                });
            }
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
        
        // Load Heya widget
        loadHeyaWidget();
    }
    
    // Load Heya voice widget
    function loadHeyaWidget() {
        // Check if already loaded
        if (document.querySelector('script[src*="widget.heya.au"]')) return;
        
        var script = document.createElement('script');
        script.src = 'https://widget.heya.au/loader.js';
        script.setAttribute('data-pk', 'pk_heya_c92731291ee2d0e0ee5b51e7a767fd5f');
        script.setAttribute('data-config', 'ef0f0f1a-3545-44e1-bb90-a0144d8c43bf');
        document.body.appendChild(script);
    }
    
    // Load all partials
    loadPartial('nav-container', 'partials/nav.html', initMobileNav);
    loadPartial('footer-container', 'partials/footer.html', initFooterNewsletter);
})();
