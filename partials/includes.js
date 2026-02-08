// ============================================
// PARTIALS LOADER
// Loads nav, footer, and voice widget dynamically
// ============================================
(function() {
    // Determine base path based on current page location
    var path = window.location.pathname;
    var basePath = '';
    
    // If we're in a subdirectory (like /blog/), adjust the base path
    if (path.includes('/blog/')) {
        basePath = '../';
    }

    var partialsPath = basePath + 'partials/';
    
    // Load a partial HTML file and insert it
    function loadPartial(elementId, fileName, callback) {
        var element = document.getElementById(elementId);
        if (!element) return;
        
        fetch(partialsPath + fileName)
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to load ' + fileName);
                return response.text();
            })
            .then(function(html) {
                // Replace {{BASE_PATH}} placeholder with actual base path
                html = html.replace(/\{\{BASE_PATH\}\}/g, basePath);
                element.innerHTML = html;
                
                // Run callback if provided
                if (callback) callback();
            })
            .catch(function(err) {
                console.error('Partial load error:', err);
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
            var links = mobileMenu.querySelectorAll('a');
            for (var i = 0; i < links.length; i++) {
                links[i].addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('open');
                    mobileMenu.setAttribute('aria-hidden', 'true');
                });
            }
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

    // Initialize voice widget
    function initVoiceWidget() {
        var wrap = document.getElementById('voice-widget-wrap');
        var btn = document.getElementById('voice-widget');
        var textEl = btn ? btn.querySelector('.voice-widget-text') : null;
        var termsOverlay = document.getElementById('voice-terms-overlay');
        var termsAgree = document.getElementById('voice-terms-agree');
        var termsCancel = document.getElementById('voice-terms-cancel');
        var feedbackOverlay = document.getElementById('voice-feedback-overlay');
        var feedbackUp = document.getElementById('voice-feedback-up');
        var feedbackDown = document.getElementById('voice-feedback-down');
        var keyNinjaBtn = document.getElementById('key-ninja-btn');

        if (!wrap || !btn || !textEl) return;

        var state = 'idle';
        var isInCall = false;
        var micPermissionGranted = false;
        var keyNinjaInitialized = false;
        
        var originalConsoleLog = console.log;
        
        console.log = function() {
            originalConsoleLog.apply(console, arguments);
            
            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                
                if (typeof arg === 'string') {
                    if (arg.includes('Call status changed: Inactive') || 
                        arg.includes('Call ended') || 
                        arg.includes('Call stopped successfully')) {
                        originalConsoleLog('📞 Call ended detected');
                        isInCall = false;
                        setButtonState('idle');
                        openFeedback();
                    }
                    else if (arg.includes('Call started successfully')) {
                        originalConsoleLog('✅ Call connected');
                        isInCall = true;
                        setButtonState('call');
                    }
                }
            }
        };

        function setButtonState(s) {
            state = s;
            btn.disabled = (s === 'connecting');
            btn.classList.remove('state-connecting', 'state-call');
            if (s === 'connecting') {
                btn.classList.add('state-connecting');
                textEl.textContent = 'Connecting';
            } else if (s === 'call') {
                btn.classList.add('state-call');
                textEl.textContent = 'End call';
            } else {
                textEl.textContent = 'Voice call';
            }
        }

        function openTerms() {
            termsOverlay.classList.add('open');
            termsOverlay.setAttribute('aria-hidden', 'false');
        }
        function closeTerms() {
            termsOverlay.classList.remove('open');
            termsOverlay.setAttribute('aria-hidden', 'true');
        }
        function openFeedback() {
            feedbackOverlay.classList.add('open');
            feedbackOverlay.setAttribute('aria-hidden', 'false');
        }
        function closeFeedback() {
            feedbackOverlay.classList.remove('open');
            feedbackOverlay.setAttribute('aria-hidden', 'true');
        }

        function submitFeedback(isPositive) {
            fetch('https://formspree.io/f/xqedznlr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    feedback: isPositive ? 'positive' : 'negative',
                    page: window.location.pathname,
                    timestamp: new Date().toISOString()
                })
            }).then(function() { closeFeedback(); }).catch(function() { closeFeedback(); });
        }
        
        function requestMicrophonePermission() {
            return new Promise(function(resolve, reject) {
                if (micPermissionGranted) {
                    resolve();
                    return;
                }
                
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ audio: true })
                        .then(function(stream) {
                            micPermissionGranted = true;
                            stream.getTracks().forEach(function(track) { track.stop(); });
                            resolve();
                        })
                        .catch(function(err) {
                            alert('Microphone access is required for voice calls.');
                            reject(err);
                        });
                } else {
                    resolve();
                }
            });
        }
        
        function startCall() {
            requestMicrophonePermission()
                .then(function() {
                    setButtonState('connecting');
                    
                    if (keyNinjaBtn) {
                        keyNinjaBtn.click();
                    }
                    
                    setTimeout(function() {
                        if (state === 'connecting') {
                            originalConsoleLog('⚠️ Connection timeout');
                            setButtonState('idle');
                            alert('Connection timed out. Please try again.');
                        }
                    }, 15000);
                })
                .catch(function(err) {
                    originalConsoleLog('❌ Microphone error:', err);
                    setButtonState('idle');
                });
        }
        
        function endCall() {
            originalConsoleLog('📞 Ending call');
            if (keyNinjaBtn) {
                keyNinjaBtn.click();
            }
            
            setTimeout(function() {
                if (isInCall || state === 'call') {
                    isInCall = false;
                    setButtonState('idle');
                    openFeedback();
                }
            }, 500);
        }

        if (termsOverlay) termsCancel.addEventListener('click', closeTerms);
        
        if (termsAgree) termsAgree.addEventListener('click', function() {
            closeTerms();
            startCall();
        });

        if (feedbackUp) feedbackUp.addEventListener('click', function() { submitFeedback(true); });
        if (feedbackDown) feedbackDown.addEventListener('click', function() { submitFeedback(false); });

        if (termsOverlay) termsOverlay.addEventListener('click', function(e) {
            if (e.target === termsOverlay) closeTerms();
        });
        if (feedbackOverlay) feedbackOverlay.addEventListener('click', function(e) {
            if (e.target === feedbackOverlay) closeFeedback();
        });

        btn.addEventListener('click', function() {
            if (state === 'idle') {
                openTerms();
                return;
            }
            if (state === 'call') {
                endCall();
                return;
            }
        });

        function initWidgetVisibility() {
            if (window.keyNinjaReady || keyNinjaInitialized) {
                var attempts = 0;
                var checkInterval = setInterval(function() {
                    attempts++;
                    if (keyNinjaBtn && (keyNinjaBtn.onclick !== null || attempts >= 50)) {
                        clearInterval(checkInterval);
                        keyNinjaInitialized = true;
                        wrap.classList.add('visible');
                        originalConsoleLog('✅ Voice widget ready');
                    }
                }, 100);
            }
        }
        
        document.addEventListener('keyNinjaReady', initWidgetVisibility);
        
        if (window.keyNinjaReady) {
            initWidgetVisibility();
        }
        
        setTimeout(function() {
            if (!wrap.classList.contains('visible')) {
                wrap.classList.add('visible');
                originalConsoleLog('⚠️ Widget shown (fallback)');
            }
        }, 8000);
    }
    
    // Load all partials
    loadPartial('nav-container', 'nav.html', initMobileNav);
    loadPartial('footer-container', 'footer.html');
    loadPartial('voice-widget-container', 'voice-widget.html', initVoiceWidget);
})();
