export default function toastStore(Alpine) {
  Alpine.store("common").toast = {
    // state
    notifications: [],
    displayDuration: 8000,

    addNotification({ title = null, message = null }) {
      const id = Date.now();
      const notification = { id, title, message };

      // Keep only the most recent 20 notifications
      if (this.notifications.length >= 20) {
        this.notifications.splice(0, this.notifications.length - 19);
      }

      // Add the new notification to the notifications stack
      this.notifications.push(notification);
    },
    removeNotification(id) {
      setTimeout(() => {
        this.notifications = this.notifications.filter(
          (notification) => notification.id !== id,
        );
      }, 400);
    },
  };
}
