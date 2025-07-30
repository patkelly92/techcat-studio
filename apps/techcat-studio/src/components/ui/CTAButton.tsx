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
      // base
      "inline-block rounded-md bg-gradient-to-b from-violet-500 to-violet-950 px-4 py-2 text-sm font-medium text-white",
      // interaction
      "transition-colors duration-200",
      // lighter on hover
      "hover:from-violet-400 hover:to-violet-800",
        className,
      )}
    >
      {children}
    </Link>
  );
};

export default CTAButton;
