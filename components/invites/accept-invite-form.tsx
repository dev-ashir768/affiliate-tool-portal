"use client";

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
import { PasswordInput } from "@/components/ui/password-input";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import {
  acceptInviteNewUserSchema,
  type AcceptInviteNewUserSchemaType,
} from "@/validations/org.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/use-me";
import { acceptInvite } from "@/services/orgs";
import { useState } from "react";

type Props = { token: string };

export default function AcceptInviteForm({ token }: Props) {
  const router = useRouter();
  const meQuery = useMe();
  const isLoggedIn = meQuery.isSuccess;
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionSubmitting, setSessionSubmitting] = useState(false);

  const form = useForm<AcceptInviteNewUserSchemaType>({
    resolver: zodResolver(acceptInviteNewUserSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const formError = form.formState.errors.root;

  async function onSubmitNewUser(data: AcceptInviteNewUserSchemaType) {
    form.clearErrors("root");
    try {
      const result = await acceptInvite(token, {
        name: data.name,
        password: data.password,
      });
      const dest =
        typeof result.redirectTo === "string" && result.redirectTo.startsWith("/")
          ? result.redirectTo
          : "/login";
      router.replace(dest);
      router.refresh();
    } catch (err) {
      form.setError("root", {
        message: err instanceof Error ? err.message : "Failed to accept invite",
      });
    }
  }

  async function onAcceptAsSession() {
    setSessionError(null);
    setSessionSubmitting(true);
    try {
      const result = await acceptInvite(token, {});
      const dest =
        typeof result.redirectTo === "string" && result.redirectTo.startsWith("/")
          ? result.redirectTo
          : "/home";
      router.replace(dest);
      router.refresh();
    } catch (err) {
      setSessionError(
        err instanceof Error ? err.message : "Failed to accept invite",
      );
    } finally {
      setSessionSubmitting(false);
    }
  }

  if (meQuery.isLoading) {
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
          <CardTitle className="text-2xl font-bold">Accept invite</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">
            Checking your session…
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoggedIn) {
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
          <CardTitle className="text-2xl font-bold">Accept invite</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">
            Signed in as{" "}
            <span className="text-foreground font-medium">
              {meQuery.data?.user.email}
            </span>
            . Accept this invite to join the organization.
          </p>
          {sessionError ? (
            <div className="mt-4">
              <FieldError errors={[{ message: sessionError }]} />
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="bg-white border-0">
          <Field>
            <Button
              type="button"
              size="lg"
              disabled={sessionSubmitting}
              onClick={onAcceptAsSession}
            >
              {sessionSubmitting ? "Accepting…" : "Accept invite"}
            </Button>
            <FieldDescription className="text-center">
              Wrong account? <Link href="/login">Switch account</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    );
  }

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
        <CardTitle className="text-2xl font-bold">Accept invite</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 text-center text-sm">
          Create your account to join the organization.
        </p>
        <form
          id="accept-invite-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmitNewUser)}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="name"
                    type="text"
                    placeholder="Enter your name"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                    placeholder="Create a password"
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
      </CardContent>
      <CardFooter className="bg-white border-0">
        <Field>
          <Button
            type="submit"
            size="lg"
            form="accept-invite-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Accepting…" : "Accept invite"}
          </Button>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(`/invite/${token}`)}`}>
              Login
            </Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
}
