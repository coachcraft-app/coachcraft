export default function authStore(Alpine) {
  Alpine.store("auth", {
    user: {
      profile: { profile: "/images/profile_icon.png" },
    },
    userManager: undefined,
  });
}
