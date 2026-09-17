"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import {
  resetPasswordSchema,
  type ResetPasswordFormSchemaType,
} from "@/validations/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [done, setDone] = useState(false);

  const form = useForm<ResetPasswordFormSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "" },
  });

  async function onSubmit(data: ResetPasswordFormSchemaType) {
    form.clearErrors("root");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error?.message ?? "Reset failed");
      }
      setDone(true);
      window.setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      form.setError("root", {
        message: err instanceof Error ? err.message : "Failed to reset password",
      });
    }
  }

  const isSubmitting = form.formState.isSubmitting;
  const formError = form.formState.errors.root;

  if (!token) {
    return (
      <Card className="ring-0 w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle>Invalid reset link</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This reset link is missing a token. Request a new one from the forgot
          password page.
        </CardContent>
        <CardFooter>
          <Link href="/forgot-password" className="text-sm underline">
            Forgot password
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="ring-0 w-full max-w-md bg-white">
      <CardHeader className="flex flex-col items-center">
        <Image
          src="/images/brandings/logo.png"
          alt="Tiksly"
          width={100}
          height={60}
          className="mb-4"
        />
        <CardTitle className="text-2xl font-bold">Set a new password</CardTitle>
      </CardHeader>
      <CardContent>
        {done ? (
          <p className="text-sm text-muted-foreground">
            Password updated. Redirecting to login…
          </p>
        ) : (
          <form
            id="reset-password-form"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <input type="hidden" {...form.register("token")} />
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid || undefined}
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
          {!done ? (
            <Button
              type="submit"
              size="lg"
              form="reset-password-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving…" : "Update password"}
            </Button>
          ) : null}
          <FieldDescription className="text-center">
            <Link href="/login">Back to login</Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense
      fallback={<div className="text-sm text-muted-foreground">Loading…</div>}
    >
      <ResetPasswordFormInner />
    </Suspense>
  );
}
