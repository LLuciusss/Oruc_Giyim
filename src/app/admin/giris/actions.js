'use server'
export async function adminLogin(email, password) {
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return { success: true };
  }
  return { success: false };
}