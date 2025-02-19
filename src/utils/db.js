export class QuizDB {
  constructor() {
    this.dbName = "QuizDatabase";
    this.dbVersion = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("attempts")) {
          db.createObjectStore("attempts", { keyPath: "id" });
        }
      };
    });
  }

  async saveAttempt(attempt) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["attempts"], "readwrite");
      const store = transaction.objectStore("attempts");
      const request = store.add(attempt);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getAttempts() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["attempts"], "readonly");
      const store = transaction.objectStore("attempts");
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}
