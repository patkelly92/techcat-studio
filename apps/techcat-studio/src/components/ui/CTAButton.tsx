import Link from "next/link";
import classNames from "classnames";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const CTAButton = ({ href, children, className }: CTAButtonProps) => {
  return (
    <Link
      href={href}
      className={classNames(
        "inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700",
        className,
      )}
    >
      {children}
    </Link>
  );
};

export default CTAButton;
