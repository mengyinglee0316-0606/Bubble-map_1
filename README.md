# Bubble-map_1

This repository hosts the BubbleMap interactive template in the `BubbleMap` directory.

## GitHub Pages Deployment

A GitHub Actions workflow is included to publish the `BubbleMap` folder to GitHub Pages on every push to the `main` or `work` branch. After enabling GitHub Pages in the repository settings (set **Source** to **GitHub Actions**), the site will be available at the Pages URL shown in the workflow run summary.

If you use a different default branch, update `.github/workflows/deploy-pages.yml` to match.

When using the "Deploy from a branch" option instead, you can keep the folder set to `/ (root)` because the repository root `index.html` redirects to `BubbleMap/`.
