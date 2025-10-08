import type { Alpine } from "alpinejs";

class alpineSingleton {
  private static instance: alpineSingleton;
  private alpine: Alpine | undefined;

  // Empty private constructor to prevent usual instantiation
  private constructor() {}

  /**
   *
   * @returns The global instance of alpineSingleton,
   * via which the Alpine instance can be accessed
   */
  public static getInstance(): alpineSingleton {
    if (!alpineSingleton.instance) {
      alpineSingleton.instance = new alpineSingleton();
    }
    return alpineSingleton.instance;
  }

  /**
   *
   * @returns The Alpine object
   * @throws Error if the Alpine instance var has not been initialised
   */
  public getAlpine(): Alpine {
    if (!this.alpine)
      throw new Error(
        "Alpine instance has not been initialised yet. Use set() first.",
      );
    return this.alpine;
  }

  /**
   *
   * @param Alpine A reference to the Alpine instance
   */
  public set(Alpine: Alpine) {
    this.alpine = Alpine;
  }
}

export default alpineSingleton.getInstance();
