# KPN site and admin setup

The public website is made with HTML, CSS, and JavaScript. Firebase Authentication and Cloud Firestore provide the admin-only content workflow for announcements and events.

## Run the site

Serve this folder over HTTP or HTTPS, such as with VS Code Live Server, and open `index.html`. Firebase modules will not work when the page is opened directly as a `file://` URL.

Open `admin.html` to manage content. The sign-in page has no registration flow.

Sermons, events, and announcements each have their own public page: `sermons.html`, `events.html`, and `announcements.html`. Sermon videos are hosted on YouTube.

## Admin access

Admin access is restricted in both the app and Firestore rules:

- `firebase-config.js` contains the Firebase web app config and the allowlisted `adminUids`.
- `admin.js` signs in with Firebase email/password, then signs out any account not in that UID list.
- `firestore.rules` permits content changes only for those same UIDs.

Admin UIDs are allowlisted in `firebase-config.js` and `firestore.rules`. Create admin accounts in Firebase Console under **Authentication → Users**. There is no public sign-up form. To add or remove an administrator, update `adminUids` in `firebase-config.js` and the `isAdmin()` allowlist in `firestore.rules` together, then publish the rules in **Firestore Database → Rules**.

## Content management

In the admin dashboard:

- **Announcements** can be created, edited, published, saved as drafts, and deleted.
- **Events** can be created, edited, published, saved as drafts, and deleted. Each event has a title, description, local date and time, location, and optional HTTPS meeting link.

The public site displays published announcements and future published events. Upcoming events are ordered from soonest to latest; past events remain manageable in the admin page but are not shown publicly.

Firestore collections are `announcements` and `events`. The rules validate the fields and size limits for both collections. If rules have changed locally, publish `firestore.rules` in Firebase Console before using the write features.

## Security notes

- **Admin page:** `admin.html` is no longer linked from the public footer. Admins should bookmark `admin.html` directly. The hidden URL is convenience only — the real protection is the Firestore rules.
- **Security headers:** every page sets a Content-Security-Policy via a `<meta>` tag (works on any host, including Live Server). `firebase.json` additionally defines HTTP headers (CSP with `frame-ancestors`, HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`) for Firebase Hosting deployments — run `firebase deploy --only hosting` from this folder to apply them.
- **Admin allowlist sync:** after adding or removing an administrator, run `node check-admin-sync.mjs`. It exits non-zero if `firebase-config.js` and `firestore.rules` disagree, preventing stale accounts from keeping data-layer access.
- **Event links:** `firestore.rules` requires `meetingUrl` to be empty or an `https://` URL, matching the client-side check. Republish the rules to activate this.
- **Recommended console settings (manual):** enable Firebase App Check, apply HTTP-referrer and API restrictions to the web API key, and set budget/activity alerts in the Firebase console. These cannot be configured from source code.
