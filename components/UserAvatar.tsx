import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
const UserAvatar = ({
  imageUrl,
  className,
  iconSize = 17,
}: {
  imageUrl: string | undefined;
  className?: string;
  iconSize?: number;
}) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={imageUrl ?? ""} alt="profile" />
      <AvatarFallback>
        <User size={iconSize} />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
