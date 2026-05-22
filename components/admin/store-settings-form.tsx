"use client";

import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";
import { updateStoreSettingsAction } from "@/lib/actions";
import type { ActionResult } from "@/types";

const initialActionState: ActionResult = {
  status: "idle"
};

export function StoreSettingsForm({ usdRate }: { usdRate: number }) {
  const { showToast } = useToast();
  const [actionState, formAction, isPending] = useActionState(updateStoreSettingsAction, initialActionState);

  useEffect(() => {
    if (actionState.status === "idle" || !actionState.message) {
      return;
    }

    showToast({
      title: actionState.message,
      variant: actionState.status === "success" ? "success" : "error"
    });
  }, [actionState, showToast]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="usdRate">NGN per 1 USD</Label>
        <Input id="usdRate" name="usdRate" type="number" min="1" step="0.01" defaultValue={usdRate} required />
      </div>
      <p className="text-sm leading-7 text-text-muted">
        Visitors detected outside Nigeria will see converted USD prices. You can update this rate any time from here.
      </p>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update USD Rate"}
      </Button>
    </form>
  );
}
