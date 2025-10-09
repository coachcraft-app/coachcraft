import type { ToastNotification } from "../../typedefs/storeTypes";

export default class toast {
  // state
  public notifications: ToastNotification[] = [];
  public displayDuration: number = 8000;

  /**
   * empty constructor for instantiation
   */
  public constructor() {}

  public addNotification({ title, message, variant }: ToastNotification) {
    const id = Date.now();
    const notification: ToastNotification = {
      id,
      title,
      message,
      variant,
    };

    // Keep only the most recent 20 notifications
    if (this.notifications.length >= 20) {
      this.notifications.splice(0, this.notifications.length - 19);
    }

    // Add the new notification to the notifications stack
    this.notifications.push(notification);
  }

  public removeNotification(id: number) {
    setTimeout(() => {
      this.notifications = this.notifications.filter(
        (notification) => notification.id !== id,
      );
    }, 400);
  }
}
