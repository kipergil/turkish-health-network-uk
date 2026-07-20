"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  submitListingSuggestionAction,
  type ActionState,
} from "@/lib/actions/member-actions";

const INITIAL_STATE: ActionState = { status: "idle" };

export function SuggestionForm() {
  const [state, formAction, isPending] = useActionState(
    submitListingSuggestionAction,
    INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <p className="border-border bg-card rounded-lg border p-4 text-sm">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="suggest-kind">What kind of listing is this?</Label>
        <Select name="kind" defaultValue="provider">
          <SelectTrigger id="suggest-kind" className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="provider">
              A practitioner (doctor, dentist…)
            </SelectItem>
            <SelectItem value="organization">
              A clinic, hospital or pharmacy
            </SelectItem>
            <SelectItem value="turkey_referral">
              A doctor/clinic in Turkey
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="suggest-name">Name</Label>
        <Input id="suggest-name" name="name" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="suggest-category">Speciality / category</Label>
          <Input id="suggest-category" name="categoryText" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="suggest-city">City</Label>
          <Input id="suggest-city" name="city" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="suggest-phone">Phone</Label>
          <Input id="suggest-phone" name="phone" type="tel" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="suggest-website">Website</Label>
          <Input id="suggest-website" name="website" type="url" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="suggest-notes">Anything else we should know?</Label>
        <Textarea id="suggest-notes" name="notes" rows={4} />
      </div>

      {state.status === "error" && (
        <p className="text-destructive text-sm" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting…" : "Submit suggestion"}
      </Button>
    </form>
  );
}
