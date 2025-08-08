// MobX 数据持久化工具
export class PersistenceManager {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  // 保存数据到 localStorage
  save(data: any): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(this.storageKey, serializedData);
    } catch (error) {
      console.error(`Failed to save data to localStorage for key: ${this.storageKey}`, error);
    }
  }

  // 从 localStorage 加载数据
  load<T>(defaultValue: T): T {
    try {
      const serializedData = localStorage.getItem(this.storageKey);
      if (serializedData) {
        const data = JSON.parse(serializedData) as T;
        return data;
      }
    } catch (error) {
      console.error(`Failed to load data from localStorage for key: ${this.storageKey}`, error);
    }
    return defaultValue;
  }

  // 清除数据
  clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error(`Failed to clear data from localStorage for key: ${this.storageKey}`, error);
    }
  }

  // 检查数据是否存在
  exists(): boolean {
    try {
      const exists = localStorage.getItem(this.storageKey) !== null;
      return exists;
    } catch (error) {
      console.error(`Failed to check data existence for key: ${this.storageKey}`, error);
      return false;
    }
  }
}

// 创建持久化管理器实例
export const createPersistenceManager = (key: string) => new PersistenceManager(key); 