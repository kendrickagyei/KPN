import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

mountComponent("announcements-component", `
  <section class="section announcements-section" id="announcements" aria-labelledby="announcements-title">
    <div class="announcements-heading">
      <div>
        <p class="eyebrow eyebrow-dark"><span></span> Stay connected</p>
        <h2 id="announcements-title">News from our <em>community.</em></h2>
      </div>
      <p class="section-intro">Updates, reminders, and encouraging news from King Priest Nation.</p>
    </div>
    <div class="announcement-list" id="announcement-list" aria-live="polite">
      <p class="announcement-state">Loading announcements…</p>
    </div>
  </section>
`);

const announcementList = document.getElementById("announcement-list");

function showAnnouncementState(message) {
  const state = document.createElement("p");
  state.className = "announcement-state";
  state.textContent = message;
  announcementList.replaceChildren(state);
}

function timestampMillis(timestamp) {
  return timestamp && typeof timestamp.toMillis === "function" ? timestamp.toMillis() : 0;
}

function renderAnnouncements(snapshot) {
  const announcements = snapshot.docs
    .map((document) => ({ id: document.id, ...document.data() }))
    .sort((a, b) => timestampMillis(b.updatedAt) - timestampMillis(a.updatedAt));

  if (announcements.length === 0) {
    showAnnouncementState("There are no announcements right now. Please check back soon.");
    return;
  }

  const cards = announcements.map((announcement) => {
    const article = document.createElement("article");
    article.className = "announcement-card";

    const label = document.createElement("p");
    label.className = "announcement-label";
    label.textContent = "KPN update";

    const title = document.createElement("h3");
    title.textContent = announcement.title;

    const body = document.createElement("p");
    body.className = "announcement-body";
    body.textContent = announcement.body;

    article.append(label, title, body);
    return article;
  });

  announcementList.replaceChildren(...cards);
}

if (!isFirebaseConfigured()) {
  showAnnouncementState("Announcements will appear here once the site administrator connects Firebase.");
} else {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const publishedAnnouncements = query(
      collection(db, "announcements"),
      where("published", "==", true)
    );

    onSnapshot(
      publishedAnnouncements,
      renderAnnouncements,
      (error) => {
        console.error("Could not load announcements:", error);
        showAnnouncementState("Announcements are temporarily unavailable. Please try again later.");
      }
    );
  } catch (error) {
    console.error("Could not initialize announcements:", error);
    showAnnouncementState("Announcements are temporarily unavailable. Please try again later.");
  }
}
