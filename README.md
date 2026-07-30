# ravishtiwari.github.io

Static portfolio built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages by GitHub Actions.

## Edit content

- Site configuration, default theme, contact endpoint, and writing limit: `src/_data/site.yaml`
- Hero, metrics, and profile: `src/_data/hero.yaml`
- Top skills: `src/_data/skills.yaml`
- Architecture, Cloud/MLOps, DevOps, and Development cards: `src/_data/capabilities.yaml`
- Certifications: `src/_data/certifications.yaml`
- Writing entries: add or edit a Markdown file in `src/writing/`

Set `contact.endpoint` only to the public URL of a serverless endpoint. Keep provider credentials, CAPTCHA secrets, rate-limit controls, and email settings in that service—not in this repository.

## Local development

```sh
npm install
npm run start
```

Use `npm run build` to generate the deployable site in `_site/`. GitHub Pages deploys that directory on pushes to `master`.

## Docker preview

Build and serve the production site locally:

```sh
docker build -t ravish-portfolio .
docker run --rm -p 8080:80 ravish-portfolio
```

Open `http://localhost:8080`. Rebuild the image after content changes.
