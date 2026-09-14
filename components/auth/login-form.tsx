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
import { PasswordInput } from "../ui/password-input";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import {
  LoginFormSchemaType,
  loginSchema,
} from "@/validations/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import Link from "next/link";

export default function LoginForm() {
  // =============================== State Variables ===============================
  const loginForm = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = loginForm.formState.isSubmitting;
  const formError = loginForm.formState.errors.root;

  async function onSubmit(data: LoginFormSchemaType) {
    loginForm.clearErrors("root");
    console.log(data);
  }

  return (
    <>
      <Card className="ring-0 w-full max-w-md bg-background">
        <CardHeader className="flex flex-col items-center">
          <Image
            src="/images/brandings/logo.png"
            alt="logo"
            width={100}
            height={60}
            className="mb-4"
          />
          <CardTitle className="text-2xl font-bold">
            Login to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            noValidate
            onSubmit={loginForm.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="email"
                control={loginForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      type="email"
                      placeholder="Enter your email"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={loginForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <PasswordInput
                      id={field.name}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <FieldDescription className="text-end">
                      <Link href="/forgot-password">Forgot your password?</Link>
                    </FieldDescription>
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
              form="login-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Login"}
            </Button>
            <FieldDescription className="text-center">
              Don&apos;t have an account? <Link href="/signup">Sign up</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </>
  );
}
