import { MDXProvider } from "@mdx-js/react";

interface LayoutProps {
  children: React.ReactNode;
}

function MDXLayout({ children, ...props }: LayoutProps) {
  return (
    <main className="prose">
      <MDXProvider components={components}>{children}</MDXProvider>;
    </main>
  );
}
