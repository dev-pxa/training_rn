const storage = new Map();

const AsyncStorageMock = {
  /**
   * Jest 环境下使用内存 Map 模拟 AsyncStorage。
   *
   * 真实 App 里 AsyncStorage 是异步原生存储；测试只需要保持同样的 Promise API，
   * 避免测试运行时去解析依赖包的 ESM 入口或调用原生模块。
   */
  getItem: jest.fn(async key => (storage.has(key) ? storage.get(key) : null)),
  setItem: jest.fn(async (key, value) => {
    storage.set(key, value);
  }),
  removeItem: jest.fn(async key => {
    storage.delete(key);
  }),
  clear: jest.fn(async () => {
    storage.clear();
  }),
};

module.exports = AsyncStorageMock;
