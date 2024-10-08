// Navigation and Search Management Class
class Nav {
    constructor(navPlaceholderId, navUrl, contentUrl) {
        this.navPlaceholderId = navPlaceholderId;
        this.navUrl = navUrl;
        this.contentUrl = contentUrl;
        this.content = {};
        this.contentLoaded = false;
        this.loadNav();
        this.loadContent();
    }

    async loadNav() {
        try {
            const response = await fetch(this.navUrl);
            const navContent = await response.text();
            document.getElementById(this.navPlaceholderId).innerHTML = navContent;
            this.setupSearchHandler(); // Set up search handler after nav is loaded
        } catch (error) {
            console.error('Error loading navigation:', error);
        }
    }

    async loadContent() {
        try {
            const response = await fetch(this.contentUrl);
            const data = await response.json();
            this.content = data;
            this.contentLoaded = true;
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    setupSearchHandler() {
        const searchButton = document.querySelector('button[onclick="searchSite()"]');
        if (searchButton) {
            searchButton.onclick = () => this.searchSite();
        }
    }

    search(query) {
        if (!this.contentLoaded) {
            console.error('Content not loaded yet.');
            return [];
        }

        query = query.toLowerCase();
        let results = [];

        const searchInSection = (section) => {
            if (section.tags && section.tags.some(tag => tag.toLowerCase().includes(query))) {
                results.push(section);
            }
            if (section.sections) {
                section.sections.forEach(subSection => searchInSection(subSection));
            }
            if (section.carousel) {
                section.carousel.forEach(carouselItem => {
                    if (carouselItem.tags && carouselItem.tags.some(tag => tag.toLowerCase().includes(query))) {
                        results.push(carouselItem);
                    }
                });
            }
        };

        Object.values(this.content).forEach(section => searchInSection(section));

        return results;
    }

    generateResultsHTML(results) {
        let resultsHTML = '';
        if (results.length > 0) {
            results.forEach(result => {
                if (result.image) {
                    resultsHTML += `<div class="search-result">
                        <img src="${result.image}" alt="${result.alt}">
                        <p>${result.caption}</p>
                    </div>`;
                } else if (result.text) {
                    resultsHTML += `<div class="search-result">
                        <h3>${result.title}</h3>
                        <p>${result.text.join(' ')}</p>
                    </div>`;
                }
            });
        } else {
            resultsHTML = '<p>No results found</p>';
        }
        return resultsHTML;
    }

    openResultsPage(query) {
        const results = this.search(query);
        const resultsHTML = this.generateResultsHTML(results);
        const newWindow = window.open('search-results.html', '_blank');
        newWindow.onload = function() {
            newWindow.document.getElementById('search-results').innerHTML = resultsHTML;
        };
    }

    searchSite() {
        const searchInput = document.getElementById('search').value;
        this.openResultsPage(searchInput);
    }
}

// Initialize site when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new Nav('nav-placeholder', 'nav.html', 'data/content.json');
});
