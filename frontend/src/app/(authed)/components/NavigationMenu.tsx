"use client";

import { AppShell, Burger, Group, Loader, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout, IconUsers } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useApi } from "@/api/context";

import styles from "./NavigationMenu.module.scss";

export default function NavigationMenu({
    children,
}: {
    children: React.ReactNode;
}) {
    const api = useApi();
    const router = useRouter();
    const pathname = usePathname();
    const [authenticating, setAuthenticating] = useState(true);
    const [opened, { toggle, close }] = useDisclosure(false);

    useEffect(() => {
        api.checkAuth()
            .then(authenticated => {
                if (!authenticated) router.replace(`/login?next=${pathname}`);
            })
            .finally(() => setAuthenticating(false));
    }, [api, router, pathname]);

    const navigate = (path: string) => {
        close();
        if (!pathname?.startsWith(path)) {
            router.push(path);
        }
    };

    const handleLogout = () => {
        close();
        api.resetAuth().then(() => {
            router.push("/login");
        });
    };

    return (
        <AppShell
            padding="0"
            withBorder={false}
            classNames={{ root: styles.root }}
            header={{ height: 60, collapsed: { desktop: true } }}
            navbar={{
                // Add this line below: base is for mobile, sm is for desktop
                width: { base: "80vw", sm: 240 }, 
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
        >
            
            {/* ── Sidebar ── */}
            <AppShell.Navbar 
                className={styles["nav-bar"]} >
                <AppShell.Section grow>
                    <div
                        className={
                            styles["nav-button"] +
                            (pathname?.startsWith("/clients")
                                ? " " + styles["nav-button-selected"]
                                : "")
                        }
                        onClick={() => navigate("/clients")}
                    >
                        <IconUsers size={18} />
                        <Text size="md">Clients</Text>
                    </div>
                </AppShell.Section>
                <AppShell.Section>
                    <div
                        className={styles["nav-button"]}
                        onClick={handleLogout}
                    >
                        <IconLogout size={18} />
                        <Text size="md">Logout</Text>
                    </div>
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main className={styles.main}>
                {/* Mobile-only sticky header (hidden above sm via CSS) */}
                <div className={styles.mobileHeader}>
                    <Group
                        h="80%"
                        px="md"
                        justify="space-between"
                        align="center"
                    >
                        <Text
                            fw={700}
                            size="lg"
                            c="white"
                        >
                            Hi
                        </Text>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            size="sm"
                            className={styles.burger}
                            aria-label="Toggle navigation"
                        />
                    </Group>
                </div>
                {authenticating ? (
                    <div className={styles.loading}>
                        <Loader
                            variant="bars"
                            size="lg"
                        />
                    </div>
                ) : (
                    children
                )}
            </AppShell.Main>
        </AppShell>
    );
}
