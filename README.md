# King Priest Nation Website

The KPN website is a static HTML, CSS, and JavaScript site with Firebase Authentication and Cloud Firestore for admin-managed announcements and events. The deployable website is in [`KPN-theme-preview/`](./KPN-theme-preview/).

## Pages

- [Homepage](./KPN-theme-preview/index.html)
- [Sermons](./KPN-theme-preview/sermons.html) — sermon videos are hosted on YouTube
- [Events](./KPN-theme-preview/events.html) — published future events, ordered by start time
- [Announcements](./KPN-theme-preview/announcements.html) — published community updates
- [Admin sign-in](./KPN-theme-preview/admin.html) — private content management page

Serve the `KPN-theme-preview` directory over HTTP or HTTPS. Firebase modules do not work from a `file://` URL. For Firebase Hosting, the configured public directory is `KPN-theme-preview`.

To deploy from the site directory, install and sign in to the Firebase CLI, then run:

```sh
npm install -g firebase-tools
firebase login
firebase deploy --only hosting,firestore:rules
```

Check the selected Firebase project before deployment. After deploying, add the Firebase Hosting domain and any custom domain to Firebase Authentication's authorized domains.

## Admin content

Firebase Email/Password Authentication is sign-in only; the site does not provide public account registration. The admin dashboard can create, edit, publish, save drafts, and delete announcements and events.

The authorized Firebase UIDs are listed in `KPN-theme-preview/firebase-config.js` and are also restricted by `KPN-theme-preview/firestore.rules`. Keep these allowlists in sync. Publish Firestore rules in Firebase Console after making rule changes.

Firestore collections:

- `announcements`: title, body, published status, and timestamps
- `events`: title, description, start date/time, location, optional HTTPS meeting URL, published status, and timestamps

The Firebase Web app configuration in the client is not a service-account credential. Never put Firebase service-account keys or other private secrets in this static site.
