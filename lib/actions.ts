"use server"

import { revalidatePath } from "next/cache"

export async function revalidateCache(path: string = "/") {
  revalidatePath(path)
}
