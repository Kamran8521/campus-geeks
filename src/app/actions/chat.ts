"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

const messageSchema = z.object({
  slug: z.string().min(1),
  body: z.string().trim().min(1, "Write something first.").max(600, "Keep it under 600 characters."),
});

export type ChatState = { error?: string };

async function roomBySlug(slug: string) {
  const room = await prisma.chatRoom.findUnique({ where: { slug } });
  if (!room) throw new Error("That room does not exist.");
  return room;
}

export async function joinRoom(formData: FormData) {
  const user = await requireUser();
  const room = await roomBySlug(String(formData.get("slug") ?? ""));

  await prisma.chatRoomMember.upsert({
    where: { roomId_userId: { roomId: room.id, userId: user.id } },
    create: { roomId: room.id, userId: user.id },
    update: {},
  });

  revalidatePath(`/rooms/${room.slug}`);
  revalidatePath("/rooms");
}

export async function leaveRoom(formData: FormData) {
  const user = await requireUser();
  const room = await roomBySlug(String(formData.get("slug") ?? ""));

  await prisma.chatRoomMember.deleteMany({ where: { roomId: room.id, userId: user.id } });

  revalidatePath(`/rooms/${room.slug}`);
  revalidatePath("/rooms");
}

export async function sendMessage(_state: ChatState, formData: FormData): Promise<ChatState> {
  const user = await requireUser();
  const parsed = messageSchema.safeParse({
    slug: String(formData.get("slug") ?? ""),
    body: String(formData.get("body") ?? ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Message could not be sent." };
  }

  const room = await roomBySlug(parsed.data.slug);
  const member = await prisma.chatRoomMember.findUnique({
    where: { roomId_userId: { roomId: room.id, userId: user.id } },
  });

  if (!member) {
    return { error: "Enter the room before posting." };
  }

  await prisma.chatMessage.create({
    data: { roomId: room.id, userId: user.id, body: parsed.data.body },
  });

  revalidatePath(`/rooms/${room.slug}`);
  return {};
}
