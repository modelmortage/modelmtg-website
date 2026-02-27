/**
 * Safely serialize an object for use in a JSON-LD script tag.
 * Escapes `</script` to prevent script tag injection / XSS breakouts.
 */
export function safeJsonLd(obj: unknown): string {
    return JSON.stringify(obj).replace(/<\/script/gi, '<\\/script')
}
