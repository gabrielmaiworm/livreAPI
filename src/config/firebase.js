const { initializeApp } = require("firebase/app");
const { getStorage, uploadBytes, ref, getDownloadURL } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyCo3i5MWaXjhCYPD9YOxoi2sPZrYN1t1SA",
  authDomain: "kitlivre-ffbc2.firebaseapp.com",
  projectId: "kitlivre-ffbc2",
  storageBucket: "kitlivre-ffbc2.appspot.com",
  messagingSenderId: "593598227164",
  appId: "1:593598227164:web:cb84be22bfd65493268a19",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

async function uploadFileToStorage(imageData, extension) {
  try {
    const storageRef = ref(storage, `user-images/${Date.now()}${extension}`);
    await uploadBytes(storageRef, imageData);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.log("Erro no uploadFileToStorage");
    console.log(error);
    return null;
  }
}

module.exports = {
  firebaseConfig,
  uploadFileToStorage,
};
