import Link from "next/link";
import { Button } from "@/components/shared/button";
import { ArrowLeft } from "@untitledui-pro/icons/line";
import { devProps } from "@/utils/dev-props";

export default function NotFound() {
  return (
    <div {...devProps('NotFound')} className="min-h-[70vh] flex items-center justify-center">
      <div className="container-main text-center">
        <h1 className="text-display text-8xl md:text-9xl text-fg-tertiary mb-4">
          404
        </h1>
        <h2 className="text-heading text-2xl md:text-3xl mb-4">
          Page not found
        </h2>
        <p className="text-fg-secondary text-lg mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It might have been moved or deleted.
        </p>
        <Button href="/">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
