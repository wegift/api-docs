# Runa Developer Hub

This repo contains the documentation for the Runa Developer Hub aka API Docs. This includes the OpenAPI specs for published versions of the API along with content pages. We use [Mintlify](https://mintlify.com) as a docs framework and hosting provider.

This repository is publically hosted at https://github.com/wegift/api-docs.

## Writing

Read https://mintlify.com/guides

From [content types](https://mintlify.com/guides/content-types)

- Our **tutorial** is the 'Getting started' culminating in making your first order
- Our **how-to** are the feature guides
- Our **reference** is the 'API Reference' pages generated from the API spec
- Our **explanation** are the other pages in 'API Reference' and some pages under 'Best Practices'

### Content rules

- Do not use level 1 headings (`#`) in the content, use level 2 headings (`##`) instead. Level 1 headings are reserved for the page title and break the table of contents.

## Development

Install JS packages with `pnpm install` then run

```
pnpm dev
```

A local server will then serve the docs at http://localhost:3000
Hot-reload is supported

## Mintlify

See [Mintlify docs](https://mintlify.com/docs) for more information. The `docs.json` file is the configuration file. Pages are written in MDX, a markdown variant with JSX support.

## Publishing Changes

- Make your changes on a branch
- Open a PR and verify the changes from the preview
- Get some review
- Merge to main and the changes are automatically deployed to production
