/**
 * Toast store to manage toast notifications
 * @module
 */

import type { ToastNotification } from "@/typedefs/storeTypes";

/**
 * Toast store class to manage toast notifications
 * @class
 */
export class Toast {
  // state
  public notifications: ToastNotification[] = [];
  public displayDuration: number = 8000;

  /**
   * empty constructor for instantiation
   */
  public constructor() {}

  /**
   * Creates a toast notification and adds it to the notifications stack
   * @param toastNotification - The notification to add
   */
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

  /**
   * Removes a toast notification from the notifications stack
   * @param id The id of the notification, which is a Date
   */
  public removeNotification(id: number) {
    setTimeout(() => {
      this.notifications = this.notifications.filter(
        (notification) => notification.id !== id,
      );
    }, 400);
  }
}
