"use client";

import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
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
  LoginFormSchemaType,
  loginSchema,
} from "@/validations/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

export default function LoginForm() {
  const loginForm = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormSchemaType) {
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
          />
          <CardTitle className="text-2xl font-bold">
            Login to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={loginForm.handleSubmit(onSubmit)}>
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
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="bg-white border-0">
          <Field>
            <Button type="submit" size="lg" form="login-form">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </>
  );
}
