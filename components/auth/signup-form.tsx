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
  SignupFormSchemaType,
  signupSchema,
} from "@/validations/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import Link from "next/link";

export default function SignupForm() {
  // =============================== State Variables ===============================
  const signupForm = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const isSubmitting = signupForm.formState.isSubmitting;
  const formError = signupForm.formState.errors.root;

  async function onSubmit(data: SignupFormSchemaType) {
    signupForm.clearErrors("root");
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
            Sign up to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            noValidate
            onSubmit={signupForm.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="username"
                control={signupForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      type="text"
                      placeholder="Enter your username"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={signupForm.control}
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
                control={signupForm.control}
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
              form="login-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign up"}
            </Button>
            <FieldDescription className="text-center">
              Already have an account? <Link href="/login">Login</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </>
  );
}
