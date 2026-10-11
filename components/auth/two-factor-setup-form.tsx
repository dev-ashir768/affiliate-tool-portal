"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  TotpCodeFormSchemaType,
  totpCodeSchema,
} from "@/validations/auth.validations";
import {
  confirmTwoFactorSetup,
  secretFromOtpauthUrl,
  startTwoFactorSetup,
  twoFactorDestination,
  type TwoFactorSetupConfirmResult,
} from "@/services/two-factor";
import { setFlashToast } from "@/lib/ui/flash-toast";

function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <CardHeader className="flex flex-col items-center">
      <Image
        src="/images/brandings/logo.png"
        alt="logo"
        width={100}
        height={60}
        className="mb-4"
      />
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription className="text-center">{description}</CardDescription>
    </CardHeader>
  );
}

export default function TwoFactorSetupForm() {
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<TwoFactorSetupConfirmResult | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  // Guard against React strict-mode double mount: each start call rotates the
  // pending secret, so only one request may run per page load.
  const startedRef = useRef(false);

  const form = useForm<TotpCodeFormSchemaType>({
    resolver: zodResolver(totpCodeSchema),
    defaultValues: { code: "" },
  });
  const isSubmitting = form.formState.isSubmitting;
  const formError = form.formState.errors.root;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startTwoFactorSetup()
      .then((data) => setOtpauthUrl(data.otpauthUrl))
      .catch((err) =>
        setLoadError(
          err instanceof Error ? err.message : "Unable to reach the server",
        ),
      );
  }, []);

  const secret = useMemo(
    () => (otpauthUrl ? secretFromOtpauthUrl(otpauthUrl) : null),
    [otpauthUrl],
  );

  async function onSubmit(data: TotpCodeFormSchemaType) {
    form.clearErrors("root");
    try {
      const result = await confirmTwoFactorSetup(data.code);
      setConfirmed(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to reach the server";
      form.setError("root", { message });
      toast.error(message);
    }
  }

  async function copyCodes() {
    if (!confirmed) return;
    try {
      await navigator.clipboard.writeText(confirmed.backupCodes.join("\n"));
      setCopied(true);
      toast.success("Backup codes copied");
    } catch {
      toast.error("Could not copy — please copy the codes manually");
    }
  }

  function onContinue() {
    if (!confirmed) return;
    setFlashToast({ type: "success", message: "Two-factor authentication enabled" });
    window.location.replace(twoFactorDestination(confirmed));
  }

  if (confirmed) {
    return (
      <Card className="ring-0 w-full max-w-md bg-white">
        <Header
          title="Save your backup codes"
          description="Each code can be used once if you lose access to your authenticator app. They won't be shown again."
        />
        <CardContent>
          <ul className="grid grid-cols-2 gap-2 rounded-md border bg-muted/40 p-4 font-mono text-sm">
            {confirmed.backupCodes.map((code) => (
              <li key={code} className="text-center tracking-wider">
                {code}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="bg-white border-0">
          <Field>
            <Button type="button" variant="outline" size="lg" onClick={copyCodes}>
              {copied ? "Copied" : "Copy codes"}
            </Button>
            <Button type="button" size="lg" onClick={onContinue}>
              Continue
            </Button>
          </Field>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="ring-0 w-full max-w-md bg-white">
      <Header
        title="Set up two-factor authentication"
        description="Scan the QR code with an authenticator app, then enter the 6-digit code to finish."
      />
      <CardContent>
        {loadError ? (
          <div className="flex flex-col items-center gap-3">
            <FieldError errors={[{ message: loadError }]} />
            <Link href="/login" className="text-sm underline">
              Back to login
            </Link>
          </div>
        ) : !otpauthUrl ? (
          <p className="text-center text-sm text-muted-foreground">
            Preparing your setup...
          </p>
        ) : (
          <form
            id="two-factor-setup-form"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-md border bg-white p-3">
                  <QRCodeSVG value={otpauthUrl} size={176} />
                </div>
                {secret && (
                  <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                      Can&apos;t scan? Enter this key manually:
                    </p>
                    <code className="break-all font-mono tracking-wider select-all">
                      {secret}
                    </code>
                  </div>
                )}
              </div>
              <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Authentication code
                    </FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      placeholder="123456"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {formError && <FieldError errors={[formError]} />}
            </FieldGroup>
          </form>
        )}
      </CardContent>
      {otpauthUrl && (
        <CardFooter className="bg-white border-0">
          <Field>
            <Button
              type="submit"
              size="lg"
              form="two-factor-setup-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Confirming..." : "Confirm and enable"}
            </Button>
            <FieldDescription className="text-center">
              <Link href="/login">Back to login</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      )}
    </Card>
  );
}
