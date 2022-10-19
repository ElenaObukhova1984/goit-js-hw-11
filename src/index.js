import './css/styles.css';
import axios from 'axios';
import { Notify } from 'notiflix';
import simpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.photo-card a', {
      captionDelay: 250,
});
    
const API_KEY = "30614835-175317e9c07c2c96a1d90d41b";
axios.defaults.baseURL = "https://pixabay.com/api";

class PixabayAPI {
    constructor() {
        this.page = 1;
        this.userQuery = "";
        }
   
    async getImage() {
        const searchParams = new URLSearchParams({
            key: API_KEY,
            q: this.userQuery,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: this.page,
            per_page: 40,
    
        });
        const { data } = await axios.get(`/?${searchParams}`);
        return data;
    }

    set query(newQuery) {
        this.userQuery = newQuery;
    }

    get query() {
        return this.userQuery;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

}

const refs = {
    form: document.querySelector("#search-form"),
    btnLoadMore: document.querySelector(".load-more"),
    galleryImages: document.querySelector(".gallery"),
    }


function createMarkup(images) {
    const markup = images.map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
    }) => {
        return `<div class="photo-card">
            <a class="img-link" href = "${largeImageURL}">
            <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy"/>
            </a>
            
            <div class="info">
            <p class="info-item">
            <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
            <b>Views</b> ${views}
            </p>
            <p class="info-item">
            <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
            <b>Downloads</b> ${downloads}
            </p>
        </div>
        </div>`
        
    }).join("");

    refs.galleryImages.insertAdjacentHTML("beforeend", markup);

}

const pixabay = new PixabayAPI();
let data = 0;

refs.form.addEventListener("submit", handleSubmit);
refs.btnLoadMore.addEventListener("click", handleLoadMore);

async function handleSubmit(event) {
  
    event.preventDefault();
        
    pixabay.query= event.target.elements.searchQuery.value;
        refs.galleryImages.innerHTML = "";
        pixabay.resetPage();
     refs.btnLoadMore.classList.add("is-hidden");
    if (pixabay.query === "") {
        refs.galleryImages.innerHTML = "";
        refs.btnLoadMore.classList.add("is-hidden");
        pixabay.resetPage();
        return;
    }
     
    
  try {
    const { totalHits, hits } = await pixabay.getImage();
    

      if (hits.length === 0) {
      refs.btnLoadMore.classList.add("is-hidden");
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    } else if (totalHits < 40) {
      refs.btnLoadMore.classList.add("is-hidden");
    } else {
          Notify.success(`Hooray! We found ${totalHits} images.`);
          refs.btnLoadMore.classList.remove("is-hidden");
      createMarkup(hits);
      data += hits.length;
      lightbox.refresh();
    }
  if (refs.btnLoadMore.classList.contains("is-hidden")) {
    refs.btnLoadMore.classList.toggle("is-hidden");
      }

  } catch (error) {
    console.log(error);
  }

}


function handleLoadMore() {
    
    pixabay.incrementPage();
    const { totalHits, hits } = pixabay.getImage();
    createMarkup(hits);
    lightbox.refresh();

    data += hits.length;

    if (data >= totalHits) {
    //   refs.btnLoadMore.classList.add("is-hidden");
      Notify.info("We're sorry, but you've reached the end of search results.");
      
    }

}