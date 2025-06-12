"use client";
import UserButton from "@/components/auth/UserButton";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React from "react";

const page = () => {
  return (
    <div>
      <UserButton />
    </div>
  );
};

export default page;
