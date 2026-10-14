# King Priest Nation Website

The website for King Priest Nation (KPN) is a work in progress. The current version is a static HTML, CSS, and JavaScript prototype focused on the visual design and page structure.

## Preview

Open [`KPN-theme-preview/index.html`](./KPN-theme-preview/index.html) in a browser to view the prototype. The styles, images, and JavaScript component files it uses are in the same folder.

## Current prototype

The prototype uses a purple-and-gold visual theme and is organized into separate files for the page sections:

- Header and navigation
- Hero and welcome sections
- Sermons
- Events
- Ministries and announcements
- About and giving
- Footer and contact information

Sermon content is intended to link to or embed videos hosted on YouTube.

## Work in progress

This is not yet the finished or production-ready website. In particular:

- Events, meetings, and announcements are sample/static content and are not managed through an admin dashboard.
- Meeting links and schedules still need to be finalized; upcoming meetings should be shown in chronological order.
- Secure administrator sign-in and content editing are not implemented.
- The Cloudflare hosting and database setup has not been configured.
- Public contact, giving, and ministry details should be reviewed and replaced with confirmed information before launch.
- The design and content still need review across screen sizes and browsers.

The intended direction is to keep the public site lightweight and use Cloudflare's free services for hosting and, if needed, a small data-backed admin experience. This setup is still to be built and verified.

## Project structure

```text
KPN-theme-preview/
├── index.html
├── style.css
├── script.js
├── component-loader.js
├── header.js
├── hero.js
├── welcome.js
├── sermons.js
├── events.js
├── ministries.js
├── about.js
├── giving.js
├── footer.js
└── Images/
```
