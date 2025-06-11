(function(){
    const gallery = document.querySelector('.gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.nav-btn.prev');
    const nextBtn = lightbox.querySelector('.nav-btn.next');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentIndex = -1;
    let filteredItems = galleryItems; 
    //initially all//

    //Update ARIA pressed states for filter buttons//
    function updateFilterAria(selectedBtn){
        filterButtons.forEach(btn => {
            btn.setAttribute('aria-pressed', btn === selectedBtn);
        });
    } 

    //Filter gallery items by category//
    function filterGallery(category){
        filteredItems = category === 'all' ?
        galleryItems : galleryItems.filter(item => item.dataset.category === category);

        //Show or hide gallery items//
        galleryItems.forEach(item => {
            if(filteredItems.includes(item))
            {
                item.style.display = '';
                item.setAttribute('tabindex', '0');
            }
            else{
                item.style.display = 'none';
                item.removeAttribute('tabindex');
            }
        });
    }

    //Open lightbox by index//
    function openLightbox(index) {
        if(index < 0 || index >= filteredItems.length) return;
        currentIndex = index;
        const img = filteredItems[currentIndex].querySelector('img');
        lightboxImage.src = img.src.replace('w=400', 'w=1200');
        //Large image//
        lightboxImage.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    //Close lightbox//
    function closeLightbox(){
        lightbox.classList.remove('active');
        lightboxImage.src = '';
        currentIndex = -1;
        document.body.style.overflow = '';
    }

    //show next image in lightbox//
    function showNext() {
        if(currentIndex === -1) return;
        let nextIndex = (currentIndex + 1) %filteredItems.length;
        openLightbox(nextIndex);
    }

    //Show previous image in lightbox//
    function showPrev() {
        if(currentIndex === -1) return;
        let prevIndex = (currentIndex - 1 + filteredItems.length) %filteredItems.length; 
        openLightbox(prevIndex); 
    }

    //Event listener:filter buttons//
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            if(button.classList.contains('active')) return;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateFilterAria(button);
            filterGallery(button.dataset.filter);
        });
    });

    //Event listener: clicking on gallery images to open lightbox//
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if(item.style.display === 'none') return;
            openLightbox(filteredItems.indexOf(item));
        });
        //Keyboard accessibility to open lightbox on Enter/Space//
        item.addEventListener('keydown', (event) => {
            if(event.key === 'Enter' || event.key === '') {
                event.preventDefault();
                if(item.style.display !== 'none') {
                    openLightbox(filteredItems.indexOf(item));
                }
            }
        });
    });

    //Lightbox navigation buttons//
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    //Close lightbox on clicking outside the image//
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) {
            closeLightbox();
        }
    });

    //Keyboard navigation support in lightbox//
    document.addEventListener('keydown', (e) => {
        if(! lightbox.classList.contains('active')) return;
        if(e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
            showNext();
        }
        else if(e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
            showPrev();
        }
        else if(e.key === 'Escape') {
            closeLightbox();
        }
    });

    //Initialize gallery display all//
    filterGallery('all');
})();