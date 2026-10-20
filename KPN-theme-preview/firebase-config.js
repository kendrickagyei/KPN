export const firebaseConfig = {
  apiKey: "AIzaSyAAug13gsaa4Rih-7EheDix5FX9Estm2fs",
  authDomain: "kpn-site-fb660.firebaseapp.com",
  projectId: "kpn-site-fb660",
  storageBucket: "kpn-site-fb660.firebasestorage.app",
  messagingSenderId: "398963052490",
  appId: "1:398963052490:web:26b8eea859443a15e8c933",
  measurementId: "G-LJE5KH48NR"
};

export const adminUids = [
  "UgVtDpw4kmWffVsrar7DZE7JrtW2",
  "nWbNPpElXvahCHbikwMsNe0oEQC3"
];

export function isFirebaseConfigured() {
  return Object.values(firebaseConfig).every((value) => typeof value === 'string' && value.length > 0)
    && adminUids.length > 0;
}
