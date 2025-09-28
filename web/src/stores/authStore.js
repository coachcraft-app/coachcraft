export default function authStore(Alpine) {
  Alpine.store("auth", {
    user: null,
    userManager: null,
  });
}
