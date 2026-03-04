import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import { ApiProvider } from "@/api/context";
import { theme } from "@/theme";

import "@mantine/notifications/styles.css";
import "./globals.css";

export const metadata: Metadata = {
    title: "Hi Interview",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <Notifications position="top-right" />
                    <ApiProvider>{children}</ApiProvider>
                </MantineProvider>
            </body>
        </html>
    );
}
