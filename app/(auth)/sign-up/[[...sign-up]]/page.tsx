import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md">
      <SignUp path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
