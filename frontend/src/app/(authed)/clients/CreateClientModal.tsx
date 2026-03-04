"use client";

import {
    Button,
    Group,
    Modal,
    Stack,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconUserPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useApi } from "@/api/context";
import { Client } from "@/types/clients";

import styles from "./CreateClientModal.module.scss";

interface CreateClientModalProps {
    opened: boolean;
    onClose: () => void;
    onSuccess: (client: Client) => void;
}

export default function CreateClientModal({ opened, onClose, onSuccess }: CreateClientModalProps) {
    const api = useApi();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
        },
        validate: {
            first_name: (v) => v.trim().length < 1 ? "First name is required" : null,
            last_name: (v) => v.trim().length < 1 ? "Last name is required" : null,
            email: (v) => /^\S+@\S+\.\S+$/.test(v.trim()) ? null : "Enter a valid email address",
        },
    });

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const submit = async (navigateAfter: boolean) => {
        const validation = form.validate();
        if (validation.hasErrors) return;

        setSubmitting(true);
        try {
            const client = await api.clients.createClient({
                first_name: form.values.first_name.trim(),
                last_name: form.values.last_name.trim(),
                email: form.values.email.trim(),
            });

            notifications.show({
                title: "Client added",
                message: `${client.first_name} ${client.last_name} was added successfully.`,
                color: "green",
                icon: <IconCheck size={16} />,
                autoClose: 4000,
            });

            form.reset();
            onSuccess(client);

            if (navigateAfter) {
                router.push(`/clients/${client.id}`);
            }
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 409) {
                form.setFieldError("email", "A client with this email already exists");
            } else {
                notifications.show({
                    title: "Something went wrong",
                    message: "Could not create the client. Please try again.",
                    color: "red",
                    autoClose: 5000,
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="New Client"
            size="md"
            centered
            classNames={{ title: styles.modalTitle }}
        >
            <Stack gap="sm">
                <Group grow>
                    <TextInput
                        label="First Name"
                        placeholder="Jane"
                        required
                        {...form.getInputProps("first_name")}
                    />
                    <TextInput
                        label="Last Name"
                        placeholder="Doe"
                        required
                        {...form.getInputProps("last_name")}
                    />
                </Group>
                <TextInput
                    label="Email"
                    placeholder="jane.doe@example.com"
                    required
                    {...form.getInputProps("email")}
                />
            </Stack>

            <Group justify="space-between" mt="xl" className={styles.actions}>
                <Button
                    variant="subtle"
                    color="gray"
                    onClick={handleClose}
                    disabled={submitting}
                >
                    Cancel
                </Button>
                <Group gap="sm">
                    <Button
                        variant="light"
                        color="violet"
                        leftSection={<IconUserPlus size={16} />}
                        loading={submitting}
                        onClick={() => submit(false)}
                    >
                        Save
                    </Button>
                    <Button
                        color="violet"
                        leftSection={<IconUserPlus size={16} />}
                        loading={submitting}
                        onClick={() => submit(true)}
                    >
                        Save &amp; View Detail
                    </Button>
                </Group>
            </Group>
        </Modal>
    );
}
