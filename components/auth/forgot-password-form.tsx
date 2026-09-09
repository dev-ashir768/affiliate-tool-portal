"use client";

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
  ForgotPasswordFormSchemaType,
} from "@/validations/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import Link from "next/link";

export default function ForgotPasswordForm() {
  // =============================== State Variables ===============================
  const forgotPasswordForm = useForm<ForgotPasswordFormSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormSchemaType) {
    forgotPasswordForm.clearErrors("root");
    console.log(data);
  }

  return (
    <>
      <Card className="ring-0 w-full max-w-md">
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
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      type="email"
                      placeholder="Enter your registered email"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="bg-white border-0">
          <Field>
            <Button
              type="submit"
              size="lg"
              form="forgot-password-form"
            >
             Reset Password
            </Button>
            <FieldDescription className="text-center">
              Remember your password? <Link href="/login">Login</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </>
  );
}
