export class NewsManager {
    constructor() {
        this.container = document.getElementById("entries");
        this.loadEntries();
    }

    async loadEntries() {
        try {
            const response = await fetch('/api/posts');
            const entries = await response.json();
            this.displayEntries(entries);
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    }

    addEntryToDisplay(post) {
        const div = document.createElement('div');
        div.className = 'entry';
        div.innerHTML = `
            <strong>${new Date(post.date).toLocaleDateString()}</strong>: 
            ${this.escapeHtml(post.text)}
        `;
        this.container.prepend(div);
    }

    displayEntries(entries) {
        this.container.innerHTML = entries
            .map(entry => `
                <div class="entry">
                    <strong>${new Date(entry.date).toLocaleDateString()}</strong>: 
                    ${this.escapeHtml(entry.text)}
                </div>
            `)
            .join("");
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
