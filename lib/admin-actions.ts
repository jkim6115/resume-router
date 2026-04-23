"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isResumeId } from "@/lib/resume";

const ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

async function generateUniqueResumeId() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const id = Array.from({ length: 6 }, () =>
      ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)]
    ).join("");

    const existing = await prisma.targetResume.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return id;
    }
  }

  throw new Error("Could not generate a unique resume ID.");
}

export async function saveBaseResume(formData: FormData) {
  const payload = {
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone"),
    position: getString(formData, "position"),
    selfIntroduction: getString(formData, "selfIntroduction"),
    motivation: getString(formData, "motivation"),
    experienceJson: getString(formData, "experienceJson") || "[]",
    skillsJson: getString(formData, "skillsJson") || "[]",
    projectsJson: getString(formData, "projectsJson") || "[]",
    educationJson: getString(formData, "educationJson") || "[]",
    trainingJson: getString(formData, "trainingJson") || "[]",
    linksJson: getString(formData, "linksJson") || "{}",
  };

  const existing = await prisma.baseResume.findFirst();

  if (existing) {
    await prisma.baseResume.update({
      where: { id: existing.id },
      data: payload,
    });
  } else {
    await prisma.baseResume.create({ data: payload });
  }

  redirect("/admin/profile?saved=1");
}

export async function createTargetResume(formData: FormData) {
  const id = await generateUniqueResumeId();

  await prisma.targetResume.create({
    data: {
      id,
      companyName: getString(formData, "companyName"),
      selfIntroduction: getString(formData, "selfIntroduction"),
      motivation: getString(formData, "motivation"),
    },
  });

  redirect("/admin/resumes?saved=created");
}

export async function updateTargetResume(id: string, formData: FormData) {
  const normalizedId = id.toUpperCase();

  if (!isResumeId(normalizedId)) {
    throw new Error("Invalid ID.");
  }

  await prisma.targetResume.update({
    where: { id: normalizedId },
    data: {
      companyName: getString(formData, "companyName"),
      selfIntroduction: getString(formData, "selfIntroduction"),
      motivation: getString(formData, "motivation"),
      notes: getString(formData, "notes") || null,
    },
  });

  redirect("/admin/resumes?saved=updated");
}

export async function deleteTargetResume(id: string) {
  const normalizedId = id.toUpperCase();

  if (!isResumeId(normalizedId)) {
    throw new Error("Invalid ID.");
  }

  await prisma.targetResume.delete({
    where: { id: normalizedId },
  });

  redirect("/admin/resumes");
}
