"use client";

import { useState } from "react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormSchemaType,
} from "@/validations/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const forgotPasswordForm = useForm<ForgotPasswordFormSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotPasswordFormSchemaType) {
    forgotPasswordForm.clearErrors("root");
    setDevResetUrl(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error?.message ?? "Request failed");
      }
      const message =
        json.message ??
        "If an account exists for that email, password reset instructions have been sent.";
      toast.success(message);
      setSent(true);
      if (typeof json.resetUrl === "string") {
        setDevResetUrl(json.resetUrl);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to request password reset";
      forgotPasswordForm.setError("root", { message });
      toast.error(message);
    }
  }

  const isSubmitting = forgotPasswordForm.formState.isSubmitting;
  const formError = forgotPasswordForm.formState.errors.root;

  return (
    <Card className="ring-0 w-full max-w-md bg-white">
      <CardHeader className="flex flex-col items-center">
        <Image
          src="/images/brandings/logo.png"
          alt="logo"
          width={100}
          height={60}
          className="mb-4"
        />
        <CardTitle className="text-2xl font-bold">
          Forgot your password?
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Check your email for reset instructions.</p>
            {devResetUrl ? (
              <p className="rounded-lg bg-muted/50 p-3 font-mono text-xs break-all text-foreground">
                Dev reset link:{" "}
                <Link href={devResetUrl} className="underline">
                  {devResetUrl}
                </Link>
              </p>
            ) : null}
          </div>
        ) : (
          <form
            id="forgot-password-form"
            noValidate
            onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="email"
                control={forgotPasswordForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      aria-invalid={fieldState.invalid || undefined}
                      autoComplete="email"
                      type="email"
                      placeholder="Enter your registered email"
                    />
                    {fieldState.error ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
              {formError ? <FieldError errors={[formError]} /> : null}
            </FieldGroup>
          </form>
        )}
      </CardContent>
      <CardFooter className="bg-white border-0">
        <Field>
          {!sent ? (
            <Button
              type="submit"
              size="lg"
              form="forgot-password-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Reset password"}
            </Button>
          ) : null}
          <FieldDescription className="text-center">
            Remember your password? <Link href="/login">Login</Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
}
