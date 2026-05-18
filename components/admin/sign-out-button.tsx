"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-[0.72rem] uppercase tracking-[0.18em] text-earth transition-colors hover:text-charcoal"
    >
      Sign Out
    </button>
  );
}
