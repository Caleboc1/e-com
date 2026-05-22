"use client";

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { subscribeAction } from "@/lib/actions";
import type { ActionResult } from "@/types";

const initialActionState: ActionResult = {
  status: "idle"
};

export function NewsletterSignupForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { showToast } = useToast();
  const [actionState, formAction, isPending] = useActionState(subscribeAction, initialActionState);

  useEffect(() => {
    if (actionState.status === "idle" || !actionState.message) {
      return;
    }

    showToast({
      title: actionState.message,
      variant: actionState.status === "success" ? "success" : "error"
    });

    if (actionState.status === "success") {
      formRef.current?.reset();
    }
  }, [actionState, showToast]);

  return (
    <form ref={formRef} action={formAction} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
      <input
        type="email"
        name="email"
        placeholder="Your email address"
        className="h-12 flex-1 border border-clay bg-transparent px-4 text-sm outline-none placeholder:text-text-muted"
        required
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Joining..." : "Join"}
      </Button>
    </form>
  );
}
