import { Github, LucideIcon } from "lucide-react";
import React from "react";
import { PiGoogleLogoBold } from "react-icons/pi";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
const providers = [
  {
    name: "Google",
    provider: "google",
    icon: PiGoogleLogoBold,
  },
  {
    name: "GitHub",
    provider: "github",
    icon: Github,
  },
];
const OauthButtons = () => {
  return (
    <div className="flex flex-col  gap-4">
      {providers.map(({ icon, provider, name }) => {
        const Icon = icon as LucideIcon;
        return (
          <Button
            variant={"outline"}
            className="py-5"
            key={provider}
            onClick={() => signIn(provider)}
          >
            <Icon /> Continue with {name}
          </Button>
        );
      })}
    </div>
  );
};

export default OauthButtons;
