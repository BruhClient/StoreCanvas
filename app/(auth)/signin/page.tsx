import SignInForm from "@/components/forms/auth/SignInForm";
import Logo from "@/components/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>
      <div className="hidden lg:block lg:w-[60vw] bg-muted">
        <img
          src="/hero-image.jpg"
          alt="Login Hero"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
    </div>
  );
}
