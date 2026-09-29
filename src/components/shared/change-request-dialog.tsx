"use client";

import { useActionState, useEffect, useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  submitChangeRequestAction,
  type ActionState,
} from "@/lib/actions/member-actions";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import { t } from "@/lib/i18n/messages";
import type { FavoriteSubjectKind } from "@/lib/schemas";

const INITIAL_STATE: ActionState = { status: "idle" };

/**
 * Anonymous-friendly "report an issue" popup on a provider/organization
 * profile — no sign-in required, matching submitChangeRequestAction's own
 * lack of an auth() gate. Closes itself a couple seconds after a
 * successful submit rather than needing a second dismiss click.
 */
export function ChangeRequestDialog({
  subjectKind,
  subjectId,
  language = DEFAULT_LANGUAGE,
}: {
  subjectKind: FavoriteSubjectKind;
  subjectId: string;
  language?: LanguageCode;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    submitChangeRequestAction.bind(null, subjectKind, subjectId),
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.status !== "success") return;
    const timeout = setTimeout(() => setOpen(false), 1800);
    return () => clearTimeout(timeout);
  }, [state.status]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Flag className="size-4" aria-hidden="true" />
          {t("report_issue", language)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report an issue with this listing</DialogTitle>
          <DialogDescription>
            An admin reviews every request before anything is changed or
            removed.
          </DialogDescription>
        </DialogHeader>

        {state.status === "success" ? (
          <p className="text-sm">{state.message}</p>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="change-request-action">What should we do?</Label>
              <Select name="action" defaultValue="update">
                <SelectTrigger id="change-request-action" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="update">
                    Update incorrect details
                  </SelectItem>
                  <SelectItem value="remove">Remove this listing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="change-request-reason">What&apos;s wrong?</Label>
              <Textarea
                id="change-request-reason"
                name="reason"
                rows={4}
                required
                placeholder="e.g. this phone number is disconnected, this doctor no longer practises here…"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="change-request-name">
                  Your name (optional)
                </Label>
                <Input id="change-request-name" name="reporterName" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="change-request-email">
                  Your email (optional)
                </Label>
                <Input
                  id="change-request-email"
                  name="reporterEmail"
                  type="email"
                  placeholder="To let you know once it's resolved"
                />
              </div>
            </div>

            {state.status === "error" && (
              <p className="text-destructive text-sm" role="alert">
                {state.message}
              </p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Sending…" : "Send report"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
