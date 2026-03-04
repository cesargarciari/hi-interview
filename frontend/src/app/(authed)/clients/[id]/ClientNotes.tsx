"use client";

import {
    Avatar,
    Badge,
    Button,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Textarea,
    Timeline,
} from "@mantine/core";
import { IconNotes, IconSend } from "@tabler/icons-react";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

import { useApi } from "@/api/context";
import { Note } from "@/types/notes";

import styles from "./ClientNotes.module.scss";

function formatRelative(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return `${diffDay}d ago`;

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function advisorInitials(email: string): string {
    const parts = email.split("@")[0].split(/[._-]/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
}

interface ClientNotesProps {
    clientId: string;
}

export default function ClientNotes({ clientId }: ClientNotesProps) {
    const api = useApi();
    const [notes, setNotes] = useState<Note[]>([]);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const fetchNotes = useCallback(() => {
        api.clients.listNotes(clientId).then(setNotes);
    }, [api, clientId]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleSubmit = async () => {
        const trimmed = content.trim();
        if (!trimmed || submitting) return;

        setSubmitting(true);
        try {
            await api.clients.createNote(clientId, trimmed);
            setContent("");
            fetchNotes();
            textareaRef.current?.focus();
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Stack gap="lg">
            {/* ── Add Note ── */}
            <Paper withBorder radius="md" className={styles.addNote}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="sm">
                    Add a Note
                </Text>
                <Textarea
                    ref={textareaRef}
                    placeholder="Type your note here..."
                    autosize
                    minRows={3}
                    maxRows={8}
                    value={content}
                    onChange={(e) => setContent(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.textarea}
                />
                <Group justify="space-between" mt="sm" align="center">
                    <Text size="xs" c="dimmed">
                        {navigator?.platform?.includes("Mac") ? "⌘" : "Ctrl"}+Enter to submit
                    </Text>
                    <Button
                        leftSection={<IconSend size={14} />}
                        color="violet"
                        size="sm"
                        loading={submitting}
                        disabled={!content.trim()}
                        onClick={handleSubmit}
                    >
                        Add Note
                    </Button>
                </Group>
            </Paper>

            {notes.length > 0 && (
                <>
                    <Divider
                        label={
                            <Group gap="xs">
                                <IconNotes size={12} />
                                <Text size="xs">
                                    {notes.length} {notes.length === 1 ? "note" : "notes"}
                                </Text>
                            </Group>
                        }
                        labelPosition="left"
                    />
                    <Timeline
                        bulletSize={36}
                        lineWidth={2}
                        color="violet"
                        className={styles.timeline}
                    >
                        {notes.map((note) => {
                            const initials = advisorInitials(note.created_by_email);
                            return (
                                <Timeline.Item
                                    key={note.id}
                                    bullet={
                                        <Avatar
                                            size={28}
                                            radius="xl"
                                            color="violet"
                                            className={styles.bullet}
                                        >
                                            {initials}
                                        </Avatar>
                                    }
                                    title={
                                        <Group gap="xs" align="center" wrap="wrap">
                                            <Text size="sm" fw={600}>
                                                {note.created_by_email}
                                            </Text>
                                            <Badge
                                                size="xs"
                                                variant="light"
                                                color="violet"
                                            >
                                                Advisor
                                            </Badge>
                                            <Text size="xs" c="dimmed">
                                                · {formatRelative(note.created_at)}
                                            </Text>
                                        </Group>
                                    }
                                >
                                    <Paper
                                        withBorder
                                        radius="sm"
                                        className={styles.noteContent}
                                        mt={4}
                                    >
                                        <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                                            {note.content}
                                        </Text>
                                    </Paper>
                                </Timeline.Item>
                            );
                        })}
                    </Timeline>
                </>
            )}

            {notes.length === 0 && (
                <Paper withBorder radius="md" className={styles.emptyNotes}>
                    <Stack align="center" gap="xs">
                        <IconNotes size={32} color="var(--mantine-color-dimmed)" />
                        <Text fw={500}>No notes yet</Text>
                        <Text size="sm" c="dimmed">
                            Add the first note for this client above.
                        </Text>
                    </Stack>
                </Paper>
            )}
        </Stack>
    );
}
