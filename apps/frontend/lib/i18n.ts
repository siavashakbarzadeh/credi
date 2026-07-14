import it from "../messages/it.json";

type Messages = typeof it;

export function t(path: string): string {
  const keys = path.split(".");
  let current: any = it;
  for (const key of keys) {
    if (current === undefined || current === null) return path;
    current = current[key];
  }
  return typeof current === "string" ? current : path;
}

export function getMessages(): Messages {
  return it;
}
