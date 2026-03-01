# WikiYou.org

**The People's Encyclopedia** — a free, community-built wiki powered by GitHub.

WikiYou is a static website where anyone can contribute articles, tools, company profiles, and more by submitting a Pull Request. All content is generated using [SiteGen](https://github.com/altlimit/sitegen) and hosted as static HTML.

## 🌐 What is WikiYou?

WikiYou is like Wikipedia, but powered by GitHub. Instead of user accounts and wikis, contributors fork this repository, create or edit pages, and submit Pull Requests. This means:

- **Full version history** via git
- **Community review** via PR discussions
- **No accounts needed** — just a GitHub account
- **Static & fast** — generated HTML with zero runtime dependencies

## 📁 Project Structure

```
site/
├── src/                  # Source pages
│   ├── index.html        # Homepage (directory)
│   ├── companies/        # Company profiles
│   ├── tools/            # Interactive tools & calculators
│   ├── people/           # People biographies
│   ├── games/            # Browser games & game articles
│   ├── apps/             # App reviews & history
│   ├── guides/           # How-to guides & tutorials
│   ├── contribute.html   # Contributor guide
│   ├── css/styles.css    # Design system
│   └── 404.html          # Not found page
├── templates/            # Page layouts
│   ├── article.html      # General wiki article
│   ├── profile.html      # Company/person profile with infobox
│   ├── tool.html         # Interactive tool layout
│   ├── directory.html    # Category listing page
│   └── main.html         # Base layout
└── data/                 # Site configuration
    ├── site.json
    └── nav.json
```

## 🚀 Quick Start

### Prerequisites

Install [SiteGen](https://github.com/altlimit/sitegen):

```bash
go install github.com/altlimit/sitegen@latest
```

### Development

```bash
sitegen -serve
```

### Production Build

```bash
sitegen -clean -minify
```

Output goes to `public/`.

## ✏️ Contributing

1. **Fork** this repository
2. **Create** a new `.html` file in the appropriate category folder under `site/src/`
3. **Choose a template** (`article.html`, `profile.html`, or `tool.html`)
4. **Write your content** using the provided CSS helper classes
5. **Submit** a Pull Request

See the full [Contribution Guide](https://wikiyou.org/contribute) for templates, examples, and guidelines.

## 📄 License

Content is available under open contribution. See individual pages for specific attributions.
