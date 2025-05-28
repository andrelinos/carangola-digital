"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { SessionProvider } from "next-auth/react";
import { type ReactNode, useEffect, useState } from "react";

interface Props {
	children: ReactNode;
}

export function Providers({ children }: Props) {
	const [isLoaded, setIsLoaded] = useState(false);

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5 * 1000,
					},
				},
			}),
	);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	if (!isLoaded) {
		return <div />;
	}

	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</SessionProvider>
	);
}
