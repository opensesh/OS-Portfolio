/**
 * Attaches a data-component attribute to a DOM element in development mode.
 * Used for debugging, testing selectors, and component identification.
 *
 * In production builds, returns an empty object (zero runtime cost via dead-code elimination).
 *
 * @example
 * export function ContactForm() {
 *   return <form {...devProps('ContactForm')}>...</form>;
 * }
 */
export function devProps(componentName: string): Record<string, string> {
  if (process.env.NODE_ENV === 'production') {
    return {};
  }
  return { 'data-component': componentName };
}
