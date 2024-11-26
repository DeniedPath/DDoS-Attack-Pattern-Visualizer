// resources.js
const resourcesContent = {
    documentation: {
        title: "Official Documentation",
        icon: "📚",
        resources: [
            {
                title: "Cloudflare DDoS Protection",
                description: "Comprehensive guide to DDoS attacks and protection strategies",
                url: "https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/",
                type: "Documentation"
            },
            {
                title: "AWS Shield Documentation",
                description: "AWS DDoS protection service documentation",
                url: "https://aws.amazon.com/shield/",
                type: "Documentation"
            },
            {
                title: "CISA DDoS Guidelines",
                description: "Official government guidance on DDoS attacks",
                url: "https://www.cisa.gov/news-events/news/understanding-denial-service-attacks",
                type: "Government Resource"
            }
        ]
    },
    tutorials: {
        title: "Tutorials & Guides",
        icon: "📝",
        resources: [
            {
                title: "OWASP DDoS Prevention Cheat Sheet",
                description: "Best practices for preventing DDoS attacks",
                url: "https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html",
                type: "Guide"
            },
            {
                title: "Imperva DDoS Protection Guide",
                description: "Detailed guide on DDoS protection strategies",
                url: "https://www.imperva.com/learn/ddos/",
                type: "Tutorial"
            },
            {
                title: "Google Cloud Armor Documentation",
                description: "Google's DDoS protection service documentation",
                url: "https://cloud.google.com/armor/docs",
                type: "Documentation"
            }
        ]
    },
    tools: {
        title: "Security Tools & Services",
        icon: "🛠️",
        resources: [
            {
                title: "Wireshark",
                description: "Network protocol analyzer for traffic monitoring",
                url: "https://www.wireshark.org/",
                type: "Tool"
            },
            {
                title: "Snort",
                description: "Open-source intrusion prevention system",
                url: "https://www.snort.org/",
                type: "Tool"
            },
            {
                title: "ModSecurity",
                description: "Open-source web application firewall",
                url: "https://modsecurity.org/",
                type: "Tool"
            }
        ]
    },
    research: {
        title: "Research & Articles",
        icon: "🔍",
        resources: [
            {
                title: "Akamai State of the Internet Security Reports",
                description: "Regular reports on internet security and DDoS trends",
                url: "https://www.akamai.com/internet-station/cyber-security",
                type: "Research"
            },
            {
                title: "Cisco Annual Internet Report",
                description: "Comprehensive analysis of internet trends and security",
                url: "https://www.cisco.com/c/en/us/solutions/executive-perspectives/annual-internet-report/index.html",
                type: "Research"
            },
            {
                title: "Google Project Shield",
                description: "Free DDoS protection for news sites",
                url: "https://projectshield.withgoogle.com/",
                type: "Service"
            }
        ]
    },
    communities: {
        title: "Communities & Forums",
        icon: "👥",
        resources: [
            {
                title: "Reddit r/netsec",
                description: "Network Security Community",
                url: "https://www.reddit.com/r/netsec/",
                type: "Community"
            },
            {
                title: "Stack Exchange Information Security",
                description: "Q&A for information security professionals",
                url: "https://security.stackexchange.com/",
                type: "Forum"
            },
            {
                title: "SANS Internet Storm Center",
                description: "Cooperative cyber threat monitoring",
                url: "https://isc.sans.edu/",
                type: "Community Resource"
            }
        ]
    }
};

class ResourcesSection {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderResources();
        this.attachEventListeners();
    }

    renderResources() {
        const container = document.querySelector('#resources-container');
        container.innerHTML = `
            <div class="resources-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                ${this.getUniqueTypes().map(type => 
                    `<button class="filter-btn" data-filter="${type}">${type}</button>`
                ).join('')}
            </div>
            <div class="resources-grid">
                ${this.generateResourcesHTML()}
            </div>
        `;
    }

    getUniqueTypes() {
        const types = new Set();
        Object.values(resourcesContent).forEach(category => {
            category.resources.forEach(resource => {
                types.add(resource.type);
            });
        });
        return Array.from(types);
    }

    generateResourcesHTML() {
        return Object.entries(resourcesContent).map(([key, category]) => `
            <div class="resource-category">
                <h2>${category.icon} ${category.title}</h2>
                <div class="resource-cards">
                    ${category.resources.map(resource => this.createResourceCard(resource)).join('')}
                </div>
            </div>
        `).join('');
    }

    createResourceCard(resource) {
        return `
            <div class="resource-card" data-type="${resource.type}">
                <div class="resource-content">
                    <h3>${resource.title}</h3>
                    <p>${resource.description}</p>
                    <span class="resource-type">${resource.type}</span>
                </div>
                <a href="${resource.url}" target="_blank" rel="noopener noreferrer" 
                   class="resource-link">Visit Resource</a>
            </div>
        `;
    }

    attachEventListeners() {
        document.querySelector('.resources-filters').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleFilter(e.target);
            }
        });
    }

    handleFilter(button) {
        const filter = button.dataset.filter;
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => 
            btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter resources
        document.querySelectorAll('.resource-card').forEach(card => {
            if (filter === 'all' || card.dataset.type === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Initialize resources section when tab is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResourcesSection();
});