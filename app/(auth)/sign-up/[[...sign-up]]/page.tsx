import { SignUp } from "@clerk/nextjs";
import styles from "../../auth-layout.module.css";

export default function SignUpPage() {
  return (
    <div className={styles.formFrame}>
      <SignUp path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
