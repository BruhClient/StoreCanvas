"use client";

import React from "react";

import useSessionUser from "@/hooks/use-session-user";
import UserAvatar from "../UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { LogOut, Settings } from "lucide-react";
import { DEFAULT_ROUTE } from "@/routes";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import UserSettingsForm from "../forms/auth/UserSettingsForm";
const UserButton = () => {
  const user = useSessionUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar imageUrl={user?.image} className="w-10 h-10" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[300px] w-full py-2">
        <div className="flex gap-5 items-center px-2">
          <UserAvatar imageUrl={user?.image} />
          <div>
            <div className="text-sm font-semibold">{user?.name}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Settings /> Settings
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Configure user settings here
              </DialogDescription>
            </DialogHeader>
            <UserSettingsForm />
          </DialogContent>
        </Dialog>

        <DropdownMenuItem
          className=""
          onClick={() => signOut({ callbackUrl: DEFAULT_ROUTE })}
        >
          <LogOut /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
