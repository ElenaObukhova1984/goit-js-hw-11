import './css/styles.css';
import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

import { PixabayAPI } from './pixabayAPI';
import { createMarkup } from './createMarkup';
import { refs } from './refs';

const lightbox = new SimpleLightbox('.photo-card a', {
      captionDelay: 250,
});
    


const pixabay = new PixabayAPI();


refs.form.addEventListener("submit", handleSubmit);
refs.btnLoadMore.addEventListener("click", handleLoadMore);

async function handleSubmit(event) {
  
    event.preventDefault();
        
    pixabay.query= event.target.elements.searchQuery.value;

    
    refs.galleryImages.innerHTML = "";
        pixabay.resetPage();
     
    if (pixabay.query === "") {
        pixabay.resetPage();
        refs.galleryImages.innerHTML = "";
        refs.btnLoadMore.classList.add("is-hidden");
        
        return;
    }
     
    
  try {
      const { totalHits, hits } = await pixabay.getImage();
      pixabay.calculateTotalPages(totalHits);
      if (hits.length !== 0) {
          Notify.success(`Hooray! We found ${totalHits} images.`);
          createMarkup(hits);
          lightbox.refresh();

      } else {
          Notify.failure("Sorry, there are no images matching your search query. Please try again.") 
      }

      if (pixabay.isShowLoadMore) {
        refs.btnLoadMore.classList.remove('is-hidden');
      }

  } catch (error) {
    console.log(error);
  }
}


async function handleLoadMore() {
    pixabay.incrementPage();
if (!pixabay.isShowLoadMore) {
    refs.btnLoadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.")
      }
try { const { hits } = await pixabay.getImage();
    createMarkup(hits);
    lightbox.refresh();
} 
catch (error) {
   console.log(error);
}
  
}