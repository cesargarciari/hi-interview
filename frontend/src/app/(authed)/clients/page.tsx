"use client";

import { Button, Group, Table, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUserPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useApi } from "@/api/context";
import { Client } from "@/types/clients";

import CreateClientModal from "./CreateClientModal";
import styles from "./page.module.scss";

export default function ClientsPage() {
    const api = useApi();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
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

    if (loading) {
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <Group
                justify="space-between"
                align="center"
                className={styles.title}
            >
                <Title order={2}>Clients</Title>
                <Button
                    leftSection={<IconUserPlus size={16} />}
                    color="violet"
                    onClick={openModal}
                >
                    New Client
                </Button>
            </Group>
            <Table
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Assigned</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {clients.map(client => (
                        <Table.Tr
                            key={client.id}
                            className={styles.clickableRow}
                        >
                            <Table.Td>
                                <Link
                                    href={`/clients/${client.id}`}
                                    className={styles.rowLink}
                                >
                                    {client.first_name} {client.last_name}
                                </Link>
                            </Table.Td>
                            <Table.Td>{client.email}</Table.Td>
                            <Table.Td>{client.assigned_user_id ? "Yes" : "No"}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            <CreateClientModal
                opened={modalOpened}
                onClose={closeModal}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
