export default function authStore(Alpine) {
  Alpine.store("auth", {
    user: undefined,
    userManager: undefined,
  });
}
