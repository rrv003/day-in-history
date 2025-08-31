// In-memory storage for this application - facts are generated on demand
// No persistent storage needed for this historical facts app

export interface IStorage {
  // Storage interface can be extended if needed for caching facts
}

export class MemStorage implements IStorage {
  constructor() {
    // Empty storage implementation - facts are generated fresh via AI
  }
}

export const storage = new MemStorage();
