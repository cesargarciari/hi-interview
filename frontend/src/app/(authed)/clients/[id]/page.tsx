"use client";

import {
    Avatar,
    Badge,
    Button,
    Card,
    Grid,
    Group,
    Loader,
    RingProgress,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
    Timeline,
    Title,
} from "@mantine/core";
import {
    IconActivity,
    IconBriefcase,
    IconBuilding,
    IconCash,
    IconChartBar,
    IconClock,
    IconFiles,
    IconMail,
    IconNotes,
    IconPhone,
    IconTrendingUp,
    IconUser,
} from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useApi } from "@/api/context";
import { Client } from "@/types/clients";

import ClientNotes from "./ClientNotes";
import styles from "./page.module.scss";


function getDerivedFinancials(id: string) {
    const seed = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const balance = ((seed * 7919) % 900_000) + 50_000;
    const portfolioValue = balance * (1 + (seed % 50) / 100);
    const returnPct = (seed % 24) - 4; // -4 % to +20 %
    const riskScore = (seed % 5) + 1; // 1–5
    const phone = `(${(seed % 900) + 100}) ${(seed % 900) + 100}-${String(seed % 10000).padStart(4, "0")}`;
    const companies = ["Acme Corp", "Stellar LLC", "Nova Holdings", "Peak Capital", "Summit Group"];
    const company = companies[seed % companies.length];
    const statuses = ["Active", "Active", "Active", "Review", "Inactive"];
    const status = statuses[seed % statuses.length];
    const statusColor: Record<string, string> = { Active: "green", Review: "yellow", Inactive: "red" };

    return {
        balance: balance.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
        portfolioValue: portfolioValue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
        returnPct,
        riskScore,
        phone,
        company,
        status,
        statusColor: statusColor[status] ?? "gray",
    };
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <Card
            withBorder
            radius="md"
            className={styles.statCard}
        >
            <Group 
                justify="space-between"    
                wrap="nowrap">
                <Stack gap={4}>
                    <Text 
                        size="xs" 
                        c="dimmed" 
                        tt="uppercase" 
                        fw={600}>{label}</Text>
                    <Text 
                        size="xl" 
                        fw={700}>{value}</Text>
                </Stack>
                <ThemeIcon 
                    size="xl" 
                    variant="light" 
                    color="violet" 
                    radius="md">
                    {icon}
                </ThemeIcon>
            </Group>
        </Card>
    );
}

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const api = useApi();
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        api.clients.getClient(id)
            .then(setClient)
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [api, id]);

    const financials = useMemo(() => (client ? getDerivedFinancials(client.id) : null), [client]);

    if (loading) {
        return (
            <div className={styles.centered}>
                <Loader 
                    color="violet" 
                    size="lg" />
            </div>
        );
    }

    if (notFound || !client || !financials) {
        return (
            <div className={styles.centered}>
                <Text c="dimmed">Client not found.</Text>
            </div>
        );
    }

    const initials = `${client.first_name[0]}${client.last_name[0]}`.toUpperCase();
    const joinDate = new Date(client.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className={styles.container}>
            <Button 
                component={Link} 
                href="/clients" 
                variant="subtle" 
                color="violet" 
                size="xs" 
                className={styles.backButton}
                mb="lg">Back to Clients</Button>
            <div className={styles.header}>
                <Group 
                    gap="lg" 
                    align="center">
                    <Avatar
                        size={64}
                        radius="xl"
                        color="violet"
                        className={styles.avatar}
                    >
                        {initials}
                    </Avatar>
                    <Stack gap={4}>
                        <Group 
                            gap="sm" 
                            align="center">
                            <Title order={2}>
                                {client.first_name} {client.last_name}
                            </Title>
                            <Badge
                                color={financials.statusColor}
                                variant="light"
                                size="lg"
                            >
                                {financials.status}
                            </Badge>
                        </Group>
                        <Group 
                            gap="xs" 
                            c="dimmed">
                            <IconBuilding size={14} />
                            <Text size="sm">{financials.company}</Text>
                            <Text size="sm">·</Text>
                            <IconClock size={14} />
                            <Text size="sm">Client since {joinDate}</Text>
                        </Group>
                    </Stack>
                </Group>
            </div>

            <Grid 
                gutter="md" 
                className={styles.topGrid}>
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Card 
                        withBorder  
                        radius="md" 
                        className={styles.infoCard}>
                        <Text 
                            size="xs" 
                            c="dimmed" 
                            tt="uppercase" 
                            fw={700} 
                            mb="md">
                            Contact Information
                        </Text>
                        <Stack gap="sm">
                            <Group gap="sm">
                                <ThemeIcon 
                                    size="sm" 
                                    variant="transparent" 
                                    color="violet">
                                    <IconUser size={16} />
                                </ThemeIcon>
                                <Text 
                                    size="sm" 
                                    fw={500}>
                                    {client.first_name} {client.last_name}
                                </Text>
                            </Group>
                            <Group gap="sm">
                                <ThemeIcon 
                                    size="sm" 
                                    variant="transparent" 
                                    color="violet">
                                    <IconMail size={16} />
                                </ThemeIcon>
                                <Text size="sm">{client.email}</Text>
                            </Group>
                            <Group gap="sm">
                                <ThemeIcon 
                                    size="sm" 
                                    variant="transparent" 
                                    color="violet">
                                    <IconPhone size={16} />
                                </ThemeIcon>
                                <Text size="sm">{financials.phone}</Text>
                            </Group>
                            <Group gap="sm">
                                <ThemeIcon 
                                    size="sm" 
                                    variant="transparent" 
                                    color="violet">
                                    <IconBuilding size={16} />
                                </ThemeIcon>
                                <Text size="sm">{financials.company}</Text>
                            </Group>
                            <Group gap="sm">
                                <ThemeIcon 
                                    size="sm" 
                                    variant="transparent" 
                                    color="violet">
                                    <IconBriefcase size={16} />
                                </ThemeIcon>
                                <Text size="sm">
                                    {client.assigned_user_id ? "Advisor assigned" : "Unassigned"}
                                </Text>
                            </Group>
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Card 
                        withBorder 
                        radius="md" 
                        className={styles.infoCard}>
                        <Text 
                            size="xs" 
                            c="dimmed" 
                            tt="uppercase" 
                            fw={700} 
                            mb="md">
                            Financial Summary
                        </Text>
                        <Group 
                            justify="space-between" 
                            align="flex-start">
                            <Stack 
                                gap="md" 
                                style={{ flex: 1 }}>
                                <div>
                                    <Text 
                                        size="xs" 
                                        c="dimmed">Account Balance</Text>
                                    <Text 
                                        size="xl" 
                                        fw={700}>{financials.balance}</Text>
                                </div>
                                <div>
                                    <Text 
                                        size="xs" 
                                        c="dimmed">Portfolio Value</Text>
                                    <Text 
                                        size="lg" 
                                        fw={600}>{financials.portfolioValue}</Text>
                                </div>
                                <Group 
                                    gap="xs" 
                                    align="center">
                                    <IconTrendingUp
                                        size={16}
                                        color={financials.returnPct >= 0 ? "green" : "red"}
                                    />
                                    <Text
                                        size="sm"
                                        fw={600}
                                        c={financials.returnPct >= 0 ? "green" : "red"}
                                    >
                                        {financials.returnPct >= 0 ? "+" : ""}
                                        {financials.returnPct}% YTD
                                    </Text>
                                </Group>
                            </Stack>
                            <Stack 
                                align="center" 
                                gap={4}>
                                <RingProgress
                                    size={100}
                                    thickness={8}
                                    roundCaps
                                    sections={[{ value: financials.riskScore * 20, color: "violet" }]}
                                    label={
                                        <Text 
                                            ta="center" 
                                            size="xs" 
                                            fw={700}>
                                            {financials.riskScore}/5
                                        </Text>
                                    }
                                />
                                <Text 
                                    size="xs" 
                                    c="dimmed">Risk Score</Text>
                            </Stack>
                        </Group>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* ── Tabs Section ── */}
            <Tabs 
                defaultValue="overview" 
                color="violet" 
                className={styles.tabs}>
                <Tabs.List>
                    <Tabs.Tab 
                        value="overview" 
                        leftSection={<IconChartBar size={14} />}>
                        Overview
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="activity"
                        leftSection={<IconActivity size={14} />}>
                        Activity
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="notes"
                        leftSection={<IconNotes size={14} />}>
                        Notes
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="documents"
                        leftSection={<IconFiles size={14} />}>
                        Documents
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel 
                    value="overview" 
                    pt="md">
                    <SimpleGrid 
                        cols={{ base: 1, sm: 2, lg: 4 }} 
                        spacing="md">
                        <StatCard
                            label="Account Balance"
                            value={financials.balance}
                            icon={<IconCash size={20} />}
                        />
                        <StatCard
                            label="Portfolio Value"
                            value={financials.portfolioValue}
                            icon={<IconChartBar size={20} />}
                        />
                        <StatCard
                            label="YTD Return"
                            value={`${financials.returnPct >= 0 ? "+" : ""}${financials.returnPct}%`}
                            icon={<IconTrendingUp size={20} />}
                        />
                        <StatCard
                            label="Risk Score"
                            value={`${financials.riskScore} / 5`}
                            icon={<IconActivity size={20} />}
                        />
                    </SimpleGrid>
                </Tabs.Panel>

                <Tabs.Panel 
                    value="activity" 
                    pt="md">
                    <Card 
                        withBorder 
                        radius="md">
                        <Text 
                            size="xs" 
                            c="dimmed" 
                            tt="uppercase" 
                            fw={700} 
                            mb="lg">
                            Recent Activity
                        </Text>
                        <Timeline 
                            active={2}
                            bulletSize={24} 
                            lineWidth={2} 
                            color="violet">
                            <Timeline.Item
                                bullet={<IconCash size={12} />}
                                title="Portfolio Rebalanced"
                            >
                                <Text 
                                    size="xs"
                                    c="dimmed">Allocation shifted to 60/40 model</Text>
                                <Text 
                                    size="xs"
                                    c="dimmed" 
                                    mt={4}>2 days ago</Text>
                            </Timeline.Item>
                            <Timeline.Item
                                bullet={<IconChartBar size={12} />}
                                title="Quarterly Review Completed"
                            >
                                <Text 
                                    size="xs" 
                                    c="dimmed">Q4 performance review with advisor</Text>
                                <Text 
                                    size="xs" 
                                    c="dimmed" 
                                    mt={4}>3 weeks ago</Text>
                            </Timeline.Item>
                            <Timeline.Item
                                bullet={<IconMail size={12} />}
                                title="Statement Sent"
                            >
                                <Text 
                                    size="xs" 
                                    c="dimmed">Monthly statement delivered to {client.email}</Text>
                                <Text 
                                    size="xs" 
                                    c="dimmed" 
                                    mt={4}>1 month ago</Text>
                            </Timeline.Item>
                            <Timeline.Item
                                bullet={<IconUser size={12} />}
                                title="Account Opened"
                            >
                                <Text 
                                    size="xs" 
                                    c="dimmed">Client onboarded — {joinDate}</Text>
                            </Timeline.Item>
                        </Timeline>
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel
                    value="notes"
                    pt="md">
                    <ClientNotes clientId={client.id} />
                </Tabs.Panel>

                <Tabs.Panel 
                    value="documents" 
                    pt="md">
                    <Card 
                        withBorder 
                        radius="md" 
                        className={styles.emptyState}>
                        <Stack 
                            align="center" 
                            gap="sm">
                            <ThemeIcon 
                                size={48} 
                                variant="light" 
                                color="violet" 
                                radius="xl">
                                <IconFiles size={24} />
                            </ThemeIcon>
                            <Text fw={600}>No documents yet</Text>
                            <Text 
                                size="sm" 
                                c="dimmed">
                                Uploaded statements and agreements will appear here.
                            </Text>
                        </Stack>
                    </Card>
                </Tabs.Panel>
            </Tabs>
        </div>
    );
}
