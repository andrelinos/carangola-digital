"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailSchema = z.object({
	email: z.string(),
});

export function FormMagicLink() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ email: string }>({
		resolver: zodResolver(emailSchema),
	});

	const onSubmit: SubmitHandler<{ email: string }> = async (values) => {
		try {
			signIn("email", { email: values.email });
		} catch (error) {}
	};

	return (
		<form
			className="flex w-full max-w-xs flex-col items-center gap-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Label htmlFor="email">Acesso via e-mail</Label>

			<Input
				type="email"
				id="email"
				placeholder="Informe o e-mail"
				required
				{...register("email")}
			/>

			<Button className="w-full" type="submit">
				Enviar
			</Button>
		</form>
	);
}
