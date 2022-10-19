import axios from 'axios';

const API_KEY = "30614835-175317e9c07c2c96a1d90d41b";
axios.defaults.baseURL = "https://pixabay.com/api";

export class PixabayAPI {
    constructor() {
        this.page = 1;
        this.searchQuery = "";
        this.totalPage = 0;
        
        }
   
    async getImage() {
        const searchParams = new URLSearchParams({
            key: API_KEY,
            q: this.searchQuery,
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
        this.searchQuery = newQuery;
    }

    get query() {
        return this.searchQuery;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    calculateTotalPages(totalHits) {
    this.totalPages = Math.ceil(totalHits / 40);
  }

  get isShowLoadMore() {
    return this.page < this.totalPages;
  }

}