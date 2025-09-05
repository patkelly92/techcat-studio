export const metadata = {
  title: "Contact - Agent InfraStudio",
  description: "Ways to reach the Agent InfraStudio team and join the community",
};

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">📬 Contact &amp; Community</h1>
      <p className="text-gray-600 dark:text-gray-400">
        We&apos;d love to hear from you. Use the links below to get in touch or
        join our community.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Support:{" "}
          <a
            href="mailto:support@techcat.ai"
            className="text-violet-600 hover:underline"
          >
            support@techcat.ai
          </a>
        </li>
        <li>
          Partnerships:{" "}
          <a
            href="mailto:partners@techcat.ai"
            className="text-violet-600 hover:underline"
          >
            partners@techcat.ai
          </a>
        </li>
        <li>
          <a
            href="https://discord.gg/techcat"
            className="text-violet-600 hover:underline"
          >
            Join our Discord
          </a>
        </li>
        <li>
          <a
            href="https://github.com/techcat-studio/roadmap"
            className="text-violet-600 hover:underline"
          >
            View our roadmap
          </a>
        </li>
      </ul>
    </div>
  );
}
