import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CheckoutForm from "../components/CheckoutForm";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user_session")?.value ?? null;
  if (cookie !== "logged_in") {
    // Redirect unauthenticated users to login with next param
    redirect(`/login?next=${encodeURIComponent("/checkout")}`);
  }

  return (
    <main>
      <CheckoutForm />
    </main>
  );
}
