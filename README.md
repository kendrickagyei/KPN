# King Priest Nation Website

The website for King Priest Nation (KPN) is a work in progress. The public site is built with HTML, CSS, and JavaScript. The project includes Firebase Authentication and Cloud Firestore integration for administrator-managed announcements.

## Preview

Serve the `KPN-theme-preview` folder with a local web server (for example, VS Code Live Server) and open its `index.html`. The Firebase JavaScript modules do not work when opening the page directly with a `file://` URL.

## Current prototype

The prototype uses a purple-and-gold visual theme and is organized into separate files for the page sections:

- Header and navigation
- Hero and welcome sections
- Sermons
- Events
- Announcements and ministries
- About and giving
- Footer and contact information

Sermon content is intended to link to or embed videos hosted on YouTube.

## Work in progress

This is not yet the finished or production-ready website. In particular:

- Events and meetings are still sample/static content and are not managed through an admin dashboard.
- Meeting links and schedules still need to be finalized; upcoming meetings should be shown in chronological order.
- Firebase administrator sign-in and announcement editing are implemented, but the Firebase project must be configured before they can be used.
- Cloudflare Pages hosting has not been configured.
- Public contact, giving, and ministry details should be reviewed and replaced with confirmed information before launch.
- The design and content still need review across screen sizes and browsers.

The intended direction is to keep the public site lightweight, host it on Cloudflare Pages, and use Firebase for announcement sign-in and storage. The hosting setup is still to be configured.

## Firebase announcement setup

1. Create a Firebase project and register a Web app.
2. In **Authentication → Sign-in method**, enable **Email/Password**. Create the admin account in the Firebase console; public account registration is not included.
3. Create a **Cloud Firestore** database.
4. Copy the Web app's Firebase configuration into `KPN-theme-preview/firebase-config.js`. These web configuration values identify the Firebase project; do not put service-account keys or private credentials in the site.
5. Copy the admin user's **UID** from Firebase Authentication into `adminUid` in `firebase-config.js`.
6. Replace `REPLACE_WITH_ADMIN_UID` in `KPN-theme-preview/firestore.rules` with that same UID and publish the rules in the Firebase console.
7. Add the deployed site's hostname to Firebase Authentication's authorized domains.
8. Serve the site over HTTP or HTTPS, then open `admin.html` to sign in and manage announcements.

The public site can read only published announcements. Only the configured admin UID can read drafts or create, edit, publish, and delete announcements. The rules also validate announcement field types and lengths. The project is not connected to Firebase until these console steps and configuration values are supplied.

## Project structure

```text
KPN-theme-preview/
├── index.html
├── admin.html
├── admin.js
├── admin.css
├── style.css
├── script.js
├── component-loader.js
├── announcements.js
├── firebase-config.js
├── firestore.rules
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
