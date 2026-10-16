import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { adminUid, firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

const loginPanel = document.getElementById("login-panel");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");
const editorStatus = document.getElementById("editor-status");
const announcementForm = document.getElementById("announcement-form");
const announcementList = document.getElementById("admin-announcement-list");
const announcementCount = document.getElementById("announcement-count");
const saveButton = document.getElementById("save-announcement");
const cancelEditButton = document.getElementById("cancel-edit");
const emailInput = document.getElementById("login-email");
let auth;
let db;
let stopListening;
let cachedAnnouncements = [];

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("is-error", isError);
}

function timestampMillis(timestamp) {
  return timestamp && typeof timestamp.toMillis === "function" ? timestamp.toMillis() : 0;
}

function formatDate(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") return "Just now";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(timestamp.toDate());
}

function resetEditor() {
  announcementForm.reset();
  document.getElementById("announcement-id").value = "";
  document.getElementById("announcement-published").checked = true;
  saveButton.textContent = "Publish announcement";
  cancelEditButton.hidden = true;
  setStatus(editorStatus, "");
}

function makeActionButton(label, action, id, secondary = false) {
  const button = document.createElement("button");
  button.className = secondary ? "admin-button admin-button-secondary" : "admin-button admin-button-primary";
  button.type = "button";
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = id;
  return button;
}

function renderAdminAnnouncements(snapshot) {
  const announcements = snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => timestampMillis(b.updatedAt) - timestampMillis(a.updatedAt));
  cachedAnnouncements = announcements;
  announcementCount.textContent = `${announcements.length} saved`;

  if (announcements.length === 0) {
    const empty = document.createElement("p");
    empty.className = "admin-empty";
    empty.textContent = "No announcements yet. Add one using the form above.";
    announcementList.replaceChildren(empty);
    return;
  }

  const cards = announcements.map((announcement) => {
    const article = document.createElement("article");
    article.className = "admin-announcement";

    const heading = document.createElement("div");
    heading.className = "admin-announcement-heading";

    const title = document.createElement("h3");
    title.textContent = announcement.title;

    const status = document.createElement("span");
    status.className = announcement.published ? "status-badge is-published" : "status-badge";
    status.textContent = announcement.published ? "Published" : "Draft";
    heading.append(title, status);

    const date = document.createElement("p");
    date.className = "admin-announcement-date";
    date.textContent = `Updated ${formatDate(announcement.updatedAt)}`;

    const body = document.createElement("p");
    body.className = "admin-announcement-body";
    body.textContent = announcement.body;

    const actions = document.createElement("div");
    actions.className = "admin-announcement-actions";
    actions.append(
      makeActionButton("Edit", "edit", announcement.id, true),
      makeActionButton("Delete", "delete", announcement.id, true)
    );
    article.append(heading, date, body, actions);
    return article;
  });

  announcementList.replaceChildren(...cards);
}

function watchAnnouncements() {
  if (stopListening) stopListening();
  stopListening = onSnapshot(
    collection(db, "announcements"),
    renderAdminAnnouncements,
    (error) => {
      console.error("Could not load admin announcements:", error);
      setStatus(editorStatus, "Could not load announcements. Check the Firestore rules and connection.", true);
      announcementList.replaceChildren();
    }
  );
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus(loginStatus, "Signing in…");
  const formData = new FormData(loginForm);

  try {
    await signInWithEmailAndPassword(
      auth,
      String(formData.get("email")).trim(),
      String(formData.get("password"))
    );
    loginForm.reset();
  } catch (error) {
    console.error("Admin sign-in failed:", error);
    setStatus(loginStatus, "Sign-in failed. Check your email and password, then try again.", true);
  }
});

document.getElementById("reset-password").addEventListener("click", async () => {
  const email = emailInput.value.trim();
  if (!email) {
    setStatus(loginStatus, "Enter your email address first to request a password reset.", true);
    emailInput.focus();
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    setStatus(loginStatus, "If that account exists, a password reset email has been sent.");
  } catch (error) {
    console.error("Password reset request failed:", error);
    setStatus(loginStatus, "Could not send the reset email. Check the email address and Firebase settings.", true);
  }
});

document.getElementById("sign-out").addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Admin sign-out failed:", error);
    setStatus(editorStatus, "Could not sign out. Please try again.", true);
  }
});

announcementForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(announcementForm);
  const id = String(formData.get("id"));
  const data = {
    title: String(formData.get("title")).trim(),
    body: String(formData.get("body")).trim(),
    published: document.getElementById("announcement-published").checked,
    updatedAt: serverTimestamp()
  };

  if (!data.title || !data.body) {
    setStatus(editorStatus, "Add both a title and announcement message.", true);
    return;
  }

  saveButton.disabled = true;
  setStatus(editorStatus, id ? "Saving changes…" : "Saving announcement…");
  try {
    if (id) {
      await updateDoc(doc(db, "announcements", id), data);
    } else {
      await addDoc(collection(db, "announcements"), {
        ...data,
        createdAt: serverTimestamp()
      });
    }
    resetEditor();
    setStatus(editorStatus, "Announcement saved.");
  } catch (error) {
    console.error("Could not save announcement:", error);
    setStatus(editorStatus, "Could not save. Check your connection and Firestore permissions.", true);
  } finally {
    saveButton.disabled = false;
  }
});

cancelEditButton.addEventListener("click", resetEditor);

document.getElementById("announcement-published").addEventListener("change", (event) => {
  if (document.getElementById("announcement-id").value) return;
  saveButton.textContent = event.currentTarget.checked ? "Publish announcement" : "Save draft";
});

announcementList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const announcement = cachedAnnouncements.find((item) => item.id === button.dataset.id);
  if (button.dataset.action === "delete") {
    if (!window.confirm("Delete this announcement? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "announcements", button.dataset.id));
      setStatus(editorStatus, "Announcement deleted.");
    } catch (error) {
      console.error("Could not delete announcement:", error);
      setStatus(editorStatus, "Could not delete. Check your Firestore permissions and try again.", true);
    }
    return;
  }

  if (button.dataset.action === "edit" && announcement) {
    document.getElementById("announcement-id").value = announcement.id;
    document.getElementById("announcement-title").value = announcement.title;
    document.getElementById("announcement-body").value = announcement.body;
    document.getElementById("announcement-published").checked = announcement.published;
    saveButton.textContent = "Save changes";
    cancelEditButton.hidden = false;
    document.getElementById("announcement-title").focus();
  }
});

if (!isFirebaseConfigured()) {
  setStatus(
    loginStatus,
    "Firebase is not configured yet. Complete the setup in README.md, then reload this page.",
    true
  );
  loginForm.querySelector("button[type='submit']").disabled = true;
  document.getElementById("reset-password").disabled = true;
} else {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      if (stopListening) stopListening();
      dashboard.hidden = true;
      loginPanel.hidden = false;
      return;
    }

    if (user.uid !== adminUid) {
      await signOut(auth);
      setStatus(loginStatus, "This account is not authorized to manage announcements.", true);
      return;
    }

    setStatus(loginStatus, "");
    loginPanel.hidden = true;
    dashboard.hidden = false;
    watchAnnouncements();
  });
}
