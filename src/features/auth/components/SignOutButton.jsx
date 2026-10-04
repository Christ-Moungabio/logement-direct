import { signOut } from "../actions";

export default function SignOutButton({ className, formClassName }) {
  return (
    <form action={signOut} className={formClassName}>
      <button type="submit" className={className}>
        Se déconnecter
      </button>
    </form>
  );
}
