export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  appId: ""
};

export const adminUid = "";

export function isFirebaseConfigured() {
  return Object.values(firebaseConfig).every(Boolean) && Boolean(adminUid);
}
