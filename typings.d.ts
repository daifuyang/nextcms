declare global {
  namespace NodeJS {
    interface ProcessEnv {
      subscriptionKey: string;
      serviceRegion: string;
    }
  }
  interface Window {
    // 添加你的自定义属性
    cdn: string;
  }
}
export {};