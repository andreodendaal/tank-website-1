// Navigation and Search Management Class
class Nav {
    constructor(navPlaceholderId, navUrl, catalogUrl) {
        this.navPlaceholderId = navPlaceholderId;
        this.navUrl = navUrl;
        this.catalogUrl = catalogUrl;
        this.catalog = [];
        this.catalogLoaded = false;
        this.loadNav();
        this.loadCatalog();
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

    async loadCatalog() {
        try {
            const response = await fetch(this.catalogUrl);
            const data = await response.json();
            this.catalog = data.items;
            this.catalogLoaded = true;
        } catch (error) {
            console.error('Error loading catalog:', error);
        }
    }

    setupSearchHandler() {
        const searchButton = document.querySelector('button[onclick="searchSite()"]');
        if (searchButton) {
            searchButton.onclick = () => this.searchSite();
        }
    }

    search(query) {
        if (!this.catalogLoaded) {
            console.error('Catalog not loaded yet.');
            return [];
        }

        query = query.toLowerCase();
        return this.catalog.filter(item =>
            item.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }

    generateResultsHTML(results) {
        let resultsHTML = '';
        if (results.length > 0) {
            results.forEach(result => {
                if (result.type === 'image') {
                    resultsHTML += `<div class="search-result">
                        <img src="${result.src}" alt="${result.alt}">
                        <p>${result.text}</p>
                    </div>`;
                } else if (result.type === 'document') {
                    resultsHTML += `<div class="search-result">
                        <a href="${result.src}" target="_blank">${result.title}</a>
                        <p>${result.text}</p>
                    </div>`;
                } else if (result.type === 'text') {
                    resultsHTML += `<div class="search-result">
                        <p>${result.content}</p>
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
    new Nav('nav-placeholder', 'nav.html', 'data/catalog.json');
});
