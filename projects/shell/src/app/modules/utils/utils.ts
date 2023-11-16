export function uuid(): string {
  let temp_url = URL.createObjectURL(new Blob());
  let uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf('/') + 1);
}
