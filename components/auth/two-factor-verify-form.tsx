"use client";

import Image from "next/image";
import Link from "next/link";
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
import { CheckboxLabel } from "../ui/checkbox";
import {
  VerifyTotpFormSchemaType,
  verifyTotpSchema,
} from "@/validations/auth.validations";
import { twoFactorDestination, verifyTwoFactor } from "@/services/two-factor";
import { setFlashToast } from "@/lib/ui/flash-toast";

export default function TwoFactorVerifyForm() {
  const form = useForm<VerifyTotpFormSchemaType>({
    resolver: zodResolver(verifyTotpSchema),
    defaultValues: { code: "", rememberDevice: false },
  });

  const isSubmitting = form.formState.isSubmitting;
  const formError = form.formState.errors.root;

  async function onSubmit(data: VerifyTotpFormSchemaType) {
    form.clearErrors("root");
    try {
      const result = await verifyTwoFactor(data);
      setFlashToast({ type: "success", message: "Logged in" });
      window.location.replace(twoFactorDestination(result));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to reach the server";
      form.setError("root", { message });
      toast.error(message);
    }
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
        <CardTitle className="text-2xl font-bold">
          Two-factor authentication
        </CardTitle>
        <CardDescription className="text-center">
          Enter the 6-digit code from your authenticator app, or a backup code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="two-factor-verify-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Authentication code</FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="one-time-code"
                    inputMode="text"
                    autoFocus
                    placeholder="123456"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="rememberDevice"
              control={form.control}
              render={({ field }) => (
                <CheckboxLabel
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  name={field.name}
                >
                  Remember this device for 30 days
                </CheckboxLabel>
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
            form="two-factor-verify-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
          <FieldDescription className="text-center">
            <Link href="/login">Back to login</Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
}
