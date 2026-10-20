import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

mountComponent("events-component", `
  <section class="section gatherings-section" id="events" aria-labelledby="events-title">
    <div class="section-heading section-heading-light">
      <div>
        <p class="eyebrow"><span></span> Life together</p>
        <h2 id="events-title">Gather, grow, <em>belong.</em></h2>
      </div>
      <p class="section-intro">Join us for worship, fellowship, and ministry events.</p>
    </div>
    <div class="gathering-grid event-list" id="public-event-list" aria-live="polite">
      <p class="public-event-state">Loading upcoming events…</p>
    </div>
  </section>
`);

const eventList = document.getElementById("public-event-list");
let latestSnapshot;
let expiryTimer;

function showEventState(message) {
  clearTimeout(expiryTimer);
  const state = document.createElement("p");
  state.className = "public-event-state";
  state.textContent = message;
  eventList.replaceChildren(state);
}

function getEventDate(event) {
  return event.startsAt && typeof event.startsAt.toDate === "function"
    ? event.startsAt.toDate()
    : null;
}

function getHttpsUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function renderEvents(snapshot) {
  latestSnapshot = snapshot;
  clearTimeout(expiryTimer);

  const now = Date.now();
  const events = snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .filter((event) => getEventDate(event)?.getTime() >= now)
    .sort((a, b) => getEventDate(a).getTime() - getEventDate(b).getTime());

  if (events.length === 0) {
    showEventState("No upcoming events are scheduled right now. Please check back soon.");
    return;
  }

  const nextExpiry = getEventDate(events[0]).getTime() - now;
  expiryTimer = window.setTimeout(
    () => renderEvents(latestSnapshot),
    Math.min(nextExpiry + 1, 2_147_483_647)
  );

  const cards = events.map((event) => {
    const article = document.createElement("article");
    article.className = "gathering-card event-card";

    const content = document.createElement("div");
    content.className = "event-card-content";

    const date = document.createElement("p");
    date.className = "event-card-date";
    date.textContent = new Intl.DateTimeFormat(undefined, {
      dateStyle: "full",
      timeStyle: "short"
    }).format(getEventDate(event));

    const title = document.createElement("h3");
    title.textContent = event.title;

    const description = document.createElement("p");
    description.className = "event-card-description";
    description.textContent = event.description;

    content.append(date, title, description);
    if (event.location) {
      const location = document.createElement("p");
      location.className = "event-card-location";
      location.textContent = event.location;
      content.append(location);
    }

    const meetingUrl = getHttpsUrl(event.meetingUrl);
    if (meetingUrl) {
      const link = document.createElement("a");
      link.className = "event-card-link";
      link.href = meetingUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Join or learn more";
      content.append(link);
    }

    article.append(content);
    return article;
  });

  eventList.replaceChildren(...cards);
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && latestSnapshot) {
    renderEvents(latestSnapshot);
  }
});

if (!isFirebaseConfigured()) {
  showEventState("Upcoming events will appear here once admin access is configured.");
} else {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const publishedEvents = query(
      collection(db, "events"),
      where("published", "==", true)
    );

    onSnapshot(
      publishedEvents,
      renderEvents,
      (error) => {
        console.error("Could not load upcoming events:", error);
        showEventState("Upcoming events are temporarily unavailable. Please try again later.");
      }
    );
  } catch (error) {
    console.error("Could not initialize events:", error);
    showEventState("Upcoming events are temporarily unavailable. Please try again later.");
  }
}
