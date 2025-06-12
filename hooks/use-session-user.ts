"use client";

import { useSession } from "next-auth/react";

function useSessionUser() {
  const { data: session } = useSession();

  return session?.user;
}

export default useSessionUser;
