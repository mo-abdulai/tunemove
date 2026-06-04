import { SignIn } from "@clerk/nextjs";
import styles from "../../auth-layout.module.css";

export default function SignInPage() {
  return (
    <div className={styles.formFrame}>
      <SignIn path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
