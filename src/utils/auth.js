export async function checkAuth() {
  try {
    const res = await fetch("http://localhost:8080/auth/me", {
      method: "GET",
      credentials: "include",
    });

    console.log("AUTH CHECK STATUS:", res.status);

    return res.ok;
  } catch (err) {
    console.log("AUTH CHECK ERROR:", err);
    return false;
  }
}
