        const header = document.querySelector('.header-container');
        const heroSection = document.getElementById('home');
        const navLinks = document.querySelectorAll('.nav-link');
        const sectionsToObserve = document.querySelectorAll(
             'main section, .hero-section'
         );
        const searchToggle = document.getElementById('search-toggle');
        const searchInputWrapper = document.querySelector('.search-input-wrapper');
        const searchInputField = document.getElementById('navbar-search-input-field');
        const scrollDownArrow = document.querySelector('.scroll-down');
        const aboutSectionForScroll = document.getElementById('about');
        const navItemsContainer = document.querySelector('.header-nav-items');
        let isSearchMode = false;
        let currentHighlights = [];
        const searchActivePlaceholder = "Search... (Enter to find, click outside to close)";
        const defaultPlaceholder = "Search page content...";


        function getHeaderOffset() {
            if (!header) return 80;
             return header.offsetHeight + parseInt(getComputedStyle(header).top) + 25;
        }


        function updateActiveNavLinkOnScroll() {
            const scrollY = window.pageYOffset;
            const offset = getHeaderOffset();
            let currentSectionId = '';
            let minDistance = Infinity;

            sectionsToObserve.forEach(section => {
                 const sectionTop = section.offsetTop;
                 const sectionHeight = section.offsetHeight;
                 const sectionMiddle = sectionTop + sectionHeight / 2;
                 const distanceToCenter = Math.abs(scrollY + window.innerHeight / 2 - sectionMiddle);

                 if ((scrollY >= sectionTop - offset * 1.5 && scrollY < sectionTop + sectionHeight - offset * 0.5) ||
                     (scrollY < sectionTop - offset && scrollY + window.innerHeight > sectionTop + offset * 0.5))
                  {
                    if (distanceToCenter < minDistance) {
                         minDistance = distanceToCenter;
                         currentSectionId = section.id;
                    }
                 }
            });

              if (scrollY < 100) {
                  currentSectionId = 'home';
              } else if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 50) {
                  const lastSection = document.querySelector('main section:last-of-type');
                   if (lastSection && lastSection.id === 'contact') {
                      currentSectionId = 'contact';
                  }
              }


             navLinks.forEach(link => {
                 link.classList.remove('active');
                 const linkHref = link.getAttribute('href');
                 if (linkHref && linkHref.startsWith('#') && linkHref === `#${currentSectionId}`) {
                     link.classList.add('active');
                 }
             });
        }


        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                         const clickOffset = header ? header.offsetHeight + parseInt(getComputedStyle(header).top) + 15 : 70;
                         const offsetPosition = targetElement.offsetTop - clickOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                         navLinks.forEach(nl => nl.classList.remove('active'));
                         this.classList.add('active');
                         if (isSearchMode) {
                             deactivateSearchMode();
                         }
                    }
                }
            });
        });

        window.addEventListener('scroll', updateActiveNavLinkOnScroll, { passive: true });

        window.addEventListener('load', () => {
             updateActiveNavLinkOnScroll();
             feather.replace();

            const heroHeading = document.getElementById('main-hero-heading');
            const heroSubheading = document.querySelector('.hero-content .hero-subheading');

            if (heroHeading) {
                heroHeading.classList.add('hero-text-animate');
            }
            if (heroSubheading) {
                heroSubheading.classList.add('hero-text-animate');
            }

            const revealElements = document.querySelectorAll(
                '.main-hero-heading, .hero-subheading, .hero-cta, ' +
                'main section > h2, ' +
                '.about-section > p, ' +
                '.what-i-do-list > li, ' +
                '.projects-grid > .project-item, ' +
                '.featured-items-grid > .featured-item, ' +
                '.contact-section .contact-icons > a, .contact-section .contact-icons > img'
            );

            revealElements.forEach(el => {
                if (!el.classList.contains('hero-text-animate')) { 
                    el.classList.add('reveal-on-scroll');
                }
            });

            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observerCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!entry.target.classList.contains('hero-text-animate')) { 
                           entry.target.classList.add('is-visible');
                        } else if (entry.target.classList.contains('hero-text-animate') && getComputedStyle(entry.target).animationPlayState === 'paused') {
                        }
                        observer.unobserve(entry.target);
                    }
                });
            };

            const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

            revealElements.forEach(el => {
                if (el) {
                    scrollObserver.observe(el);
                }
            });
        });

        if (scrollDownArrow && aboutSectionForScroll) {
            scrollDownArrow.addEventListener('click', (e) => {
                e.preventDefault();
                 const clickOffset = header ? header.offsetHeight + parseInt(getComputedStyle(header).top) + 15 : 70;
                 const offsetPosition = aboutSectionForScroll.offsetTop - clickOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            });
        }


        function activateSearchMode() {
            if (isSearchMode) return;
            isSearchMode = true;
            header.classList.add('search-mode');
            searchInputField.value = '';
            removeHighlights();
            searchInputField.setAttribute('placeholder', searchActivePlaceholder);
            setTimeout(() => searchInputField.focus(), 50);
        }

        function deactivateSearchMode() {
            if (!isSearchMode) return;
            isSearchMode = false;
            header.classList.remove('search-mode');
            searchInputField.value = '';
            searchInputField.setAttribute('placeholder', defaultPlaceholder);
            removeHighlights();
        }

        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if(isSearchMode) {
                 deactivateSearchMode();
            } else {
                 activateSearchMode();
            }
        });

        document.addEventListener('click', (event) => {
            if (isSearchMode && !header.contains(event.target)) {
                deactivateSearchMode();
            }
        });

         if (searchInputWrapper) {
             searchInputWrapper.addEventListener('click', (e) => e.stopPropagation());
         }

        function removeHighlights() {
            document.querySelectorAll('.search-highlight').forEach(el => {
                 const parent = el.parentNode;
                 if (parent) {
                     parent.replaceChild(document.createTextNode(el.textContent), el);
                     parent.normalize();
                 }
             });
            currentHighlights = [];
        }


        function highlightTextInNode(node, regex) {
             let matchFoundInNode = false;
             if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                 const text = node.textContent;
                 const matches = [...text.matchAll(regex)];

                 if (matches.length > 0) {
                     matchFoundInNode = true;
                     const fragment = document.createDocumentFragment();
                     let lastIndex = 0;

                     matches.forEach(match => {
                         const offset = match.index;
                         const matchedText = match[0];

                         fragment.appendChild(document.createTextNode(text.substring(lastIndex, offset)));
                         const span = document.createElement('span');
                         span.className = 'search-highlight';
                         span.textContent = matchedText;
                         fragment.appendChild(span);
                         lastIndex = offset + matchedText.length;
                     });
                     fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                     if(node.parentNode) {
                        node.parentNode.replaceChild(fragment, node);
                     }
                 }
             } else if (node.nodeType === Node.ELEMENT_NODE) {
                 if (node.matches('script, style, noscript, iframe, canvas, .header-container, footer, .search-highlight')) {
                     return false;
                 }
                  const children = Array.from(node.childNodes);
                  children.forEach(child => {
                      if (child.parentNode === node && highlightTextInNode(child, regex)) {
                          matchFoundInNode = true;
                      }
                  });
             }
             return matchFoundInNode;
        }

        function performSearch() {
             const searchTerm = searchInputField.value.trim();
             removeHighlights();

             if (!searchTerm) {
                 searchInputField.focus();
                 searchInputField.setAttribute('placeholder', searchActivePlaceholder);
                 return;
             }

             const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
             const contentAreas = document.querySelectorAll('main section:not(.contact-section), .hero-content p, .hero-content h1');
             let firstMatchElement = null;
             let foundMatchOverall = false;

             for (const area of contentAreas) {
                  const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT, null, false);
                  let node;
                  while(node = walker.nextNode()) {
                       if (node.parentElement && node.parentElement.classList.contains('search-highlight')) continue;

                      if (regex.test(node.textContent)) {
                          foundMatchOverall = true;
                           if (!firstMatchElement) {
                               let potentialTarget = node.parentElement;
                                while(potentialTarget && potentialTarget.parentElement && (window.getComputedStyle(potentialTarget).display === 'inline' || potentialTarget.offsetHeight < 5) && potentialTarget.tagName !== 'BODY' && potentialTarget.tagName !== 'MAIN' && !potentialTarget.matches('section, div.project-item, div.featured-item, p, h1, h2, h3, li')) {
                                    potentialTarget = potentialTarget.parentElement;
                                }
                              firstMatchElement = potentialTarget || area;
                           }
                      }
                      regex.lastIndex = 0;
                  }
                  if (firstMatchElement) break;
             }


             if (foundMatchOverall) {
                  const highlightRegex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                  contentAreas.forEach(area => highlightTextInNode(area, highlightRegex));

                  if (firstMatchElement) {
                     const headerOffsetVal = getHeaderOffset();
                     const firstHighlightSpan = document.querySelector('.search-highlight');
                      let finalScrollTarget = firstHighlightSpan;
                       if (firstHighlightSpan) {
                          let parentTarget = firstHighlightSpan.parentElement;
                           while(parentTarget && parentTarget.parentElement && (window.getComputedStyle(parentTarget).display === 'inline' || parentTarget.offsetHeight < 10) && parentTarget.tagName !== 'BODY' && parentTarget.tagName !== 'MAIN' && !parentTarget.matches('section, div.project-item, div.featured-item, p, h1, h2, h3, li')) {
                              parentTarget = parentTarget.parentElement;
                          }
                          finalScrollTarget = parentTarget || firstHighlightSpan;
                      }

                     if(finalScrollTarget) {
                        const elementRect = finalScrollTarget.getBoundingClientRect();
                        const absoluteElementTop = elementRect.top + window.pageYOffset;
                        const scrollToPosition = absoluteElementTop - headerOffsetVal;
                         window.scrollTo({ top: scrollToPosition, behavior: 'smooth'});
                     }
                  }

             } else {
                 searchInputField.value = '';
                 searchInputField.setAttribute('placeholder', 'Not found. Try again.');
                 setTimeout(() => {
                     if(isSearchMode) searchInputField.setAttribute('placeholder', searchActivePlaceholder);
                 }, 2500);
             }
        }


        if(searchInputField) {
            searchInputField.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    performSearch();
                }
            });
             searchInputField.addEventListener('input', () => {
                 if(isSearchMode && searchInputField.value === '') {
                     searchInputField.setAttribute('placeholder', searchActivePlaceholder);
                     removeHighlights();
                 }
             });
        }


