"use client";

import {
    ActionIcon,
    Avatar,
    Badge,
    Button,
    Group,
    Menu,
    Paper,
    ScrollArea,
    Skeleton,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconChevronRight,
    IconCopy,
    IconDots,
    IconEye,
    IconNotes,
    IconSearch,
    IconUserPlus,
    IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useApi } from "@/api/context";
import { Client } from "@/types/clients";

import CreateClientModal from "./CreateClientModal";
import styles from "./page.module.scss";

function clientInitials(client: Client): string {
    return `${client.first_name[0]}${client.last_name[0]}`.toUpperCase();
}

function memberSince(dateStr: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
    }).format(new Date(dateStr));
}

const SKELETON_COUNT = 5;

export default function ClientsPage() {
    const api = useApi();
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

    useEffect(() => {
        api.clients.listClients()
            .then(setClients)
            .finally(() => setLoading(false));
    }, [api]);

    const handleSuccess = (newClient: Client) => {
        closeModal();
        setClients((prev) => [newClient, ...prev]);
    };

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return clients;
        return clients.filter(
            (c) =>
                `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q),
        );
    }, [clients, search]);

    // ── Skeleton ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className={styles.container}>
                <Group
                    justify="space-between"
                    mb="lg"
                >
                    <Skeleton
                        height={32}
                        width={140}
                        radius="sm"
                    />
                    <Skeleton
                        height={36}
                        width={120}
                        radius="sm"
                    />
                </Group>
                <Skeleton
                    height={36}
                    radius="sm"
                    mb="md"
                />
                {/* Mobile skeleton */}
                <Stack
                    gap="xs"
                    hiddenFrom="sm"
                >
                    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                        <Paper
                            key={i}
                            withBorder
                            p="md"
                            radius="md"
                            className={styles.skeletonCard}
                        >
                            <Group
                                justify="space-between"
                                wrap="nowrap"
                            >
                                <Group
                                    gap="sm"
                                    wrap="nowrap"
                                >
                                    <Skeleton
                                        circle
                                        height={40}
                                    />
                                    <Stack gap={6}>
                                        <Skeleton
                                            height={13}
                                            width={120}
                                            radius="xs"
                                        />
                                        <Skeleton
                                            height={11}
                                            width={160}
                                            radius="xs"
                                        />
                                    </Stack>
                                </Group>
                                <Skeleton
                                    height={16}
                                    width={16}
                                    radius="xs"
                                />
                            </Group>
                        </Paper>
                    ))}
                </Stack>
                {/* Desktop skeleton */}
                <Paper
                    withBorder
                    radius="md"
                    visibleFrom="sm"
                >
                    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            className={styles.skeletonRow}
                        >
                            <Group
                                gap="sm"
                                wrap="nowrap"
                                style={{ flex: 1 }}
                            >
                                <Skeleton
                                    circle
                                    height={36}
                                />
                                <Stack gap={5}>
                                    <Skeleton
                                        height={13}
                                        width={140}
                                        radius="xs"
                                    />
                                    <Skeleton
                                        height={11}
                                        width={200}
                                        radius="xs"
                                    />
                                </Stack>
                            </Group>
                            <Skeleton
                                height={13}
                                width={70}
                                radius="xs"
                            />
                            <Skeleton
                                height={22}
                                width={80}
                                radius="xl"
                            />
                        </div>
                    ))}
                </Paper>
            </div>
        );
    }

    // ── Page ──────────────────────────────────────────────────────────────────
    return (
        <div className={styles.container}>
            {/* ── Header ── */}
            <Group
                justify="space-between"
                align="flex-end"
                className={styles.headerSection}
            >
                <div>
                    <Title order={2}>Clients</Title>
                    <Text
                        size="sm"
                        c="dimmed"
                        mt={2}
                    >
                        {clients.length} {clients.length === 1 ? "client" : "clients"}
                    </Text>
                </div>

                {/* Desktop: full labelled button */}
                <Button
                    leftSection={<IconUserPlus size={16} />}
                    color="violet"
                    visibleFrom="sm"
                    onClick={openModal}
                >
                    New Client
                </Button>

                {/* Mobile: icon-only button */}
                <ActionIcon
                    color="violet"
                    size="lg"
                    radius="md"
                    hiddenFrom="sm"
                    aria-label="New Client"
                    onClick={openModal}
                >
                    <IconUserPlus size={20} />
                </ActionIcon>
            </Group>

            {/* ── Search ── */}
            <TextInput
                placeholder="Search by name or email..."
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                className={styles.searchBar}
            />

            {/* ── Empty state — no clients at all ── */}
            {clients.length === 0 && (
                <Paper
                    withBorder
                    radius="md"
                    className={styles.emptyState}
                >
                    <Stack
                        align="center"
                        gap="md"
                    >
                        <Avatar
                            size={64}
                            radius="xl"
                            color="violet"
                            variant="light"
                        >
                            <IconUsers size={32} />
                        </Avatar>
                        <Stack
                            align="center"
                            gap={4}
                        >
                            <Text
                                fw={700}
                                size="lg"
                            >
                                No clients yet
                            </Text>
                            <Text
                                size="sm"
                                c="dimmed"
                            >
                                Add your first client to get started.
                            </Text>
                        </Stack>
                        <Button
                            leftSection={<IconUserPlus size={16} />}
                            color="violet"
                            onClick={openModal}
                        >
                            New Client
                        </Button>
                    </Stack>
                </Paper>
            )}

            {/* ── Empty search results ── */}
            {clients.length > 0 && filtered.length === 0 && (
                <Paper
                    withBorder
                    radius="md"
                    className={styles.emptyState}
                >
                    <Stack
                        align="center"
                        gap="xs"
                    >
                        <IconSearch
                            size={32}
                            color="var(--mantine-color-dimmed)"
                        />
                        <Text fw={600}>No results for &ldquo;{search}&rdquo;</Text>
                        <Text
                            size="sm"
                            c="dimmed"
                        >
                            Try a different name or email.
                        </Text>
                    </Stack>
                </Paper>
            )}

            {filtered.length > 0 && (
                <>
                    {/* ── Mobile: Card list (< sm) ──────────────────────────── */}
                    <Stack
                        gap="xs"
                        hiddenFrom="sm"
                    >
                        {filtered.map((client) => (
                            <Link
                                key={client.id}
                                href={`/clients/${client.id}`}
                                className={styles.cardLink}
                            >
                                <Paper
                                    withBorder
                                    radius="md"
                                    className={styles.clientCard}
                                >
                                    <Group
                                        justify="space-between"
                                        wrap="nowrap"
                                    >
                                        <Group
                                            gap="sm"
                                            wrap="nowrap"
                                            style={{ minWidth: 0, flex: 1 }}
                                        >
                                            <Avatar
                                                size={40}
                                                radius="xl"
                                                color="violet"
                                                className={styles.avatar}
                                            >
                                                {clientInitials(client)}
                                            </Avatar>
                                            <Stack
                                                gap={2}
                                                style={{ minWidth: 0 }}
                                            >
                                                <Text
                                                    size="sm"
                                                    fw={600}
                                                    className={styles.clientName}
                                                >
                                                    {client.first_name} {client.last_name}
                                                </Text>
                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    className={styles.clientEmail}
                                                >
                                                    {client.email}
                                                </Text>
                                            </Stack>
                                        </Group>
                                        <IconChevronRight
                                            size={16}
                                            color="var(--mantine-color-gray-5)"
                                            style={{ flexShrink: 0 }}
                                        />
                                    </Group>
                                </Paper>
                            </Link>
                        ))}
                    </Stack>

                    {/* ── Desktop: Table in ScrollArea (>= sm) ──────────────── */}
                    <ScrollArea visibleFrom="sm">
                        <Table
                            highlightOnHover
                            withTableBorder
                            className={styles.desktopTable}
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Client</Table.Th>
                                    <Table.Th>Member Since</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th />
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {filtered.map((client) => (
                                    <Table.Tr
                                        key={client.id}
                                        className={styles.desktopRow}
                                        onClick={() => router.push(`/clients/${client.id}`)}
                                    >
                                        {/* Client cell */}
                                        <Table.Td>
                                            <Group
                                                gap="sm"
                                                wrap="nowrap"
                                                style={{ minWidth: 0 }}
                                            >
                                                <Avatar
                                                    size={36}
                                                    radius="xl"
                                                    color="violet"
                                                    className={styles.avatar}
                                                >
                                                    {clientInitials(client)}
                                                </Avatar>
                                                <Stack
                                                    gap={2}
                                                    style={{ minWidth: 0 }}
                                                >
                                                    <Link
                                                        href={`/clients/${client.id}`}
                                                        className={styles.clientName}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {client.first_name} {client.last_name}
                                                    </Link>
                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                        className={styles.clientEmail}
                                                    >
                                                        {client.email}
                                                    </Text>
                                                </Stack>
                                            </Group>
                                        </Table.Td>

                                        {/* Member since */}
                                        <Table.Td>
                                            <Text
                                                size="xs"
                                                c="dimmed"
                                            >
                                                {memberSince(client.created_at)}
                                            </Text>
                                        </Table.Td>

                                        {/* Status */}
                                        <Table.Td>
                                            <Badge
                                                color={client.assigned_user_id ? "violet" : "gray"}
                                                variant={client.assigned_user_id ? "light" : "outline"}
                                                size="sm"
                                            >
                                                {client.assigned_user_id ? "Assigned" : "Unassigned"}
                                            </Badge>
                                        </Table.Td>

                                        {/* Actions */}
                                        <Table.Td className={styles.actionsCell}>
                                            <Menu
                                                shadow="md"
                                                width={180}
                                                position="bottom-end"
                                                withinPortal
                                            >
                                                <Menu.Target>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="gray"
                                                        size="sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                        aria-label="Client actions"
                                                    >
                                                        <IconDots size={16} />
                                                    </ActionIcon>
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    <Menu.Item
                                                        leftSection={<IconEye size={14} />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/clients/${client.id}`);
                                                        }}
                                                    >
                                                        View Profile
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        leftSection={<IconNotes size={14} />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/clients/${client.id}`);
                                                        }}
                                                    >
                                                        Add Note
                                                    </Menu.Item>
                                                    <Menu.Divider />
                                                    <Menu.Item
                                                        leftSection={<IconCopy size={14} />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigator.clipboard.writeText(client.email);
                                                        }}
                                                    >
                                                        Copy Email
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </>
            )}

            <CreateClientModal
                opened={modalOpened}
                onClose={closeModal}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
