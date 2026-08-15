import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Command Center — BUBBLE Engineering",
};

// The shared global cinematic background (construction photo, stars,
// particles) is mounted once at the root layout and shows through here.
// `LoginForm` is a glass card, which is enough contrast on its own; no
// second, competing background is layered on top of the global one.
export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="relative z-10 flex w-full justify-center px-4">
        <LoginForm />
      </div>
    </main>
  );
}
