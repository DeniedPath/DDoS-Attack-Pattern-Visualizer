const learningContent = {
    basics: {
        title: "DDoS Attack Basics",
        sections: [
            {
                title: "What is a DDoS Attack?",
                content: `A Distributed Denial of Service (DDoS) attack is a malicious attempt to disrupt 
                         the normal traffic of a targeted server, service, or network by overwhelming 
                         the target or its surrounding infrastructure with a flood of Internet traffic.`,
                image: "https://www.cloudflare.com/img/learning/ddos/what-is-a-ddos-attack/ddos-attack-traffic-flow.png",
                resources: [
                    {
                        title: "Cloudflare - DDoS Attack Overview",
                        url: "https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/"
                    },
                    {
                        title: "CISA - Understanding Denial-of-Service Attacks",
                        url: "https://www.cisa.gov/news-events/news/understanding-denial-service-attacks"
                    },
                    {
                        title: "AWS - DDoS Attack Protection",
                        url: "https://aws.amazon.com/shield/ddos-attack-protection/"
                    }
                ]
            },
            {
                title: "How DDoS Attacks Work",
                content: `DDoS attacks utilize multiple compromised computer systems as sources of attack traffic. 
                         These machines can include computers and IoT devices. Think of it as multiple people 
                         trying to enter a revolving door simultaneously – the door gets stuck.`,
                resources: [
                    {
                        title: "Imperva - DDoS Attacks",
                        url: "https://www.imperva.com/learn/ddos/denial-of-service/"
                    },
                    {
                        title: "Cisco - What Is a DDoS Attack?",
                        url: "https://www.cisco.com/c/en/us/products/security/what-is-a-ddos-attack.html"
                    }
                ]
            }
        ]
    },
    attackTypes: {
        title: "Types of DDoS Attacks",
        sections: [
            {
                title: "Volume Based Attacks",
                content: "UDP floods, ICMP floods, and other spoofed-packet floods",
                details: [
                    "UDP Flood: Sends large UDP packets to overwhelm target",
                    "ICMP Flood: Overwhelms target with ICMP Echo Request",
                    "DNS Amplification: Uses DNS servers to flood target"
                ],
                resources: [
                    {
                        title: "Cloudflare - UDP Flood Attack",
                        url: "https://www.cloudflare.com/learning/ddos/udp-flood-ddos-attack/"
                    },
                    {
                        title: "Imperva - DNS Amplification",
                        url: "https://www.imperva.com/learn/ddos/dns-amplification/"
                    }
                ]
            },
            {
                title: "Protocol Attacks",
                content: "SYN floods, Ping of Death, Smurf DDoS",
                details: [
                    "SYN Flood: Exploits TCP handshake",
                    "Ping of Death: Sends malformed ping packets",
                    "Smurf Attack: Uses broadcast addresses"
                ],
                resources: [
                    {
                        title: "Cloudflare - SYN Flood Attack",
                        url: "https://www.cloudflare.com/learning/ddos/syn-flood-ddos-attack/"
                    },
                    {
                        title: "OWASP - DoS Prevention Cheat Sheet",
                        url: "https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html"
                    }
                ]
            }
        ]
    },
    mitigation: {
        title: "DDoS Mitigation Strategies",
        sections: [
            {
                title: "Traffic Analysis & Filtering",
                content: "Methods for identifying and filtering malicious traffic patterns",
                resources: [
                    {
                        title: "AWS Shield - DDoS Protection",
                        url: "https://aws.amazon.com/shield/"
                    },
                    {
                        title: "Cloudflare DDoS Protection",
                        url: "https://www.cloudflare.com/ddos/"
                    }
                ]
            },
            {
                title: "Best Practices & Tools",
                content: "Industry standard approaches to DDoS mitigation",
                resources: [
                    {
                        title: "GitHub DDoS Protection",
                        url: "https://github.blog/2017-03-28-ddos-incident-report/"
                    },
                    {
                        title: "Google Cloud Armor",
                        url: "https://cloud.google.com/armor"
                    }
                ]
            }
        ]
    }
};

class LearningSection {
    constructor() {
        this.currentSection = 'basics';
        this.init();
    }

    init() {
        this.renderNavigation();
        this.renderContent(this.currentSection);
        this.attachEventListeners();
    }

    renderNavigation() {
        const nav = document.createElement('div');
        nav.className = 'learning-nav';
        
        Object.keys(learningContent).forEach(section => {
            const button = document.createElement('button');
            button.className = 'learning-nav-btn';
            button.dataset.section = section;
            button.textContent = learningContent[section].title;
            nav.appendChild(button);
        });

        document.querySelector('#learn-tab').prepend(nav);
    }

    renderContent(section) {
        const content = learningContent[section];
        const container = document.querySelector('.learning-cards');
        container.innerHTML = '';

        content.sections.forEach(sectionData => {
            const card = this.createCard(sectionData);
            container.appendChild(card);
        });
    }

    createCard(sectionData) {
        const card = document.createElement('div');
        card.className = 'learning-card';
        
        let resourcesHtml = '';
        if (sectionData.resources) {
            resourcesHtml = `
                <div class="resources-list">
                    <h4>Learn More:</h4>
                    <ul>
                        ${sectionData.resources.map(resource => `
                            <li><a href="${resource.url}" target="_blank" rel="noopener noreferrer">
                                ${resource.title}
                            </a></li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        card.innerHTML = `
            <h3>${sectionData.title}</h3>
            <p>${sectionData.content}</p>
            ${sectionData.details ? this.createDetailsList(sectionData.details) : ''}
            ${sectionData.image ? `<img src="${sectionData.image}" alt="${sectionData.title}">` : ''}
            ${resourcesHtml}
            <button class="learn-more-btn" onclick="window.open('${sectionData.resources?.[0]?.url || '#'}', '_blank')">
                Learn More
            </button>
        `;

        return card;
    }

    createDetailsList(details) {
        return `
            <ul class="details-list">
                ${details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        `;
    }

    attachEventListeners() {
        document.querySelector('.learning-nav').addEventListener('click', (e) => {
            if (e.target.classList.contains('learning-nav-btn')) {
                this.currentSection = e.target.dataset.section;
                this.updateActiveButton(e.target);
                this.renderContent(this.currentSection);
            }
        });
    }

    updateActiveButton(activeButton) {
        document.querySelectorAll('.learning-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
}

// Initialize learning section when tab is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LearningSection();
});