import type { NextApiResponse } from 'next';

export async function revalidatePaths(
  res: NextApiResponse,
  paths: string[]
): Promise<void> {
  const uniquePaths = [...new Set(paths.map((path) => path.trim()).filter(Boolean))];

  for (const path of uniquePaths) {
    try {
      await res.revalidate(path);
    } catch (error) {
      console.error(`Failed to revalidate ${path}`, error);
    }
  }
}
