"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React from "react";

const page = () => {
  return (
    <div>
      <Button onClick={() => signOut({ callbackUrl: "/" })}> Log out </Button>
    </div>
  );
};

export default page;
