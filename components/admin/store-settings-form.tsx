"use client";

import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";
import { updateStoreSettingsAction } from "@/lib/actions";
import type { ActionResult, StoreSettings } from "@/types";

const initialActionState: ActionResult = {
  status: "idle"
};

export function StoreSettingsForm({ settings }: { settings: StoreSettings }) {
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
        <Input id="usdRate" name="usdRate" type="number" min="1" step="0.01" defaultValue={settings.usdRate} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ghsRate">NGN per 1 GHS</Label>
        <Input id="ghsRate" name="ghsRate" type="number" min="1" step="0.01" defaultValue={settings.ghsRate} required />
      </div>
      <p className="text-sm leading-7 text-text-muted">
        Nigerian visitors see NGN, Ghanaian visitors see GHS, and other international visitors see USD.
      </p>

      <div className="border-t border-linen-dark pt-6">
        <p className="mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-clay-dark">Delivery Fees (₦)</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lagosDeliveryFee">Lagos</Label>
            <Input id="lagosDeliveryFee" name="lagosDeliveryFee" type="number" min="0" step="1" defaultValue={settings.lagosDeliveryFee} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nigeriaDeliveryFee">Outside Lagos (Nigeria)</Label>
            <Input id="nigeriaDeliveryFee" name="nigeriaDeliveryFee" type="number" min="0" step="1" defaultValue={settings.nigeriaDeliveryFee} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="internationalDeliveryFee">International</Label>
            <Input id="internationalDeliveryFee" name="internationalDeliveryFee" type="number" min="0" step="1" defaultValue={settings.internationalDeliveryFee} required />
          </div>
        </div>
        <p className="mt-3 text-sm leading-7 text-text-muted">Set to 0 for free delivery on that zone.</p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Settings"}
      </Button>
    </form>
  );
}
