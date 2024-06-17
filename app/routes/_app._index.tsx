import { invariantResponse } from "@epic-web/invariant";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
  IdentificationIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import type { CSSProperties } from "react";
import { Empty } from "~/components/empty";
import { getUserByLogin } from "~/utils/github.server";
import type { User } from "~/utils/types";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data ? data.user.name ?? `@${data.user.login}` : "Not Found",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();

  if (!q) {
    url.searchParams.set("q", "kentcdodds");

    return redirect(url.toString());
  }

  const user = await getUserByLogin(q);
  invariantResponse(user, `No user with the id "${q}" exists.`, {
    status: 404,
  });

  return json({ user });
}

export default function Component() {
  const { user } = useLoaderData<typeof loader>();

  const stats = {
    Repositories: user.repositories.totalCount,
    Followers: user.followers.totalCount,
    Following: user.following.totalCount,
  };

  const tabs = [
    { name: "Profile", children: <UserProfile user={user} /> },
    {
      name: "Repositories",
      children: <UserRepoList user={user} />,
    },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6 sm:flex sm:items-center sm:justify-between sm:gap-5">
          <img
            key={user.avatarUrl}
            src={user.avatarUrl}
            alt=""
            className="mx-auto size-20 flex-none rounded-full"
          />
          <div className="max-sm:mt-4 max-sm:text-center sm:min-w-0 sm:flex-1 sm:pt-1">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 sm:flex">
              <p>{user.login}</p>
              {user.pronouns ? (
                <>
                  <svg
                    viewBox="0 0 2 2"
                    className="size-0.5 fill-current"
                    aria-hidden
                  >
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <p>{user.pronouns}</p>
                </>
              ) : null}
            </div>
            <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
              {user.name ?? `@${user.login}`}
            </h1>
            <p className="text-sm font-medium text-gray-600">
              Joined on{" "}
              <time dateTime={user.createdAt}>
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  dateStyle: "long",
                })}
              </time>
            </p>
          </div>
          <div className="flex justify-center max-sm:mt-5">
            <a
              href={user.url}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              View profile
            </a>
          </div>
        </div>
        <dl className="grid grid-cols-1 divide-gray-200 border-t border-gray-200 bg-gray-50 max-sm:divide-y sm:grid-cols-3 sm:divide-x">
          {Object.entries(stats).map(([label, value]) => (
            <div
              key={label}
              className="flex flex-row-reverse justify-center gap-1 px-6 py-5 text-sm font-medium"
            >
              <dt className="text-gray-600">{label}</dt>
              <dd className="text-gray-900">
                {value.toLocaleString("en-US", { style: "decimal" })}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <TabGroup className="mt-6">
        <TabList className="isolate flex divide-x divide-gray-200 rounded-lg shadow">
          {tabs.map((tab, tabIndex) => (
            <Tab
              key={tab.name}
              className={({ selected, hover, focus }) =>
                clsx(
                  selected ? "text-gray-900" : "text-gray-500",
                  !selected && hover ? "text-gray-700" : "",
                  tabIndex === 0 ? "rounded-l-lg" : "",
                  tabIndex === tabs.length - 1 ? "rounded-r-lg" : "",
                  hover ? "bg-gray-50" : "",
                  focus ? "z-10" : "",
                  "group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium",
                )
              }
            >
              {({ selected }) => (
                <>
                  <span>{tab.name}</span>
                  <span
                    aria-hidden="true"
                    className={clsx(
                      selected ? "bg-indigo-500" : "bg-transparent",
                      "absolute inset-x-0 bottom-0 h-0.5",
                    )}
                  />
                </>
              )}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-3 overflow-hidden rounded-lg bg-white shadow">
          {tabs.map((tab) => (
            <TabPanel key={tab.name}>{tab.children}</TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </>
  );
}

function UserProfile({
  user,
}: {
  user: Pick<
    User,
    | "login"
    | "email"
    | "location"
    | "company"
    | "websiteUrl"
    | "twitterUsername"
    | "bio"
  >;
}) {
  const profile = {
    "Email address": user.email?.length ? user.email : null,
    Location: user.location,
    Company: user.company,
    Website: user.websiteUrl,
    Twitter: user.twitterUsername ? `@${user.twitterUsername}` : null,
    Bio: user.bio,
  };
  const fieldsToShow = Object.entries(profile).filter(([, value]) => value);

  if (!fieldsToShow.length) {
    return (
      <div className="p-6">
        <Empty
          icon={<IdentificationIcon />}
          title="No details found"
          description={`It appears that ${user.login}'s profile is empty.`}
        />
      </div>
    );
  }

  return (
    <dl className="divide-y divide-gray-100">
      {Object.entries(profile).map(([label, value]) => (
        <div
          key={label}
          className="px-4 py-5 text-sm/6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt className="font-medium text-gray-900">{label}</dt>
          <dd className="text-gray-700 max-sm:mt-1 sm:col-span-2">
            {value ?? <span className="text-gray-400">N/A</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function UserRepoList({
  user,
}: {
  user: Pick<User, "login" | "url" | "topRepositories">;
}) {
  if (!user.topRepositories.nodes.length) {
    return (
      <div className="p-6">
        <Empty
          icon={<RectangleStackIcon />}
          title="No repositories found"
          description={`${user.login} doesn't have any public repositories yet.`}
        />
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {user.topRepositories.nodes.map((repository) => (
        <li
          key={repository.url}
          className="relative px-4 py-5 hover:bg-gray-50 sm:px-6"
        >
          <div className="flex items-start gap-x-3">
            <p className="text-sm/6 font-semibold text-gray-900">
              <a href={repository.url}>
                <span className="absolute inset-x-0 -top-px bottom-0" />
                {repository.name}
              </a>
            </p>
            {repository.primaryLanguage ? (
              <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-md bg-white px-1.5 py-0.5 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                {repository.primaryLanguage ? (
                  <svg
                    viewBox="0 0 6 6"
                    className="size-1.5 fill-[--color]"
                    style={
                      {
                        "--color": repository.primaryLanguage.color,
                      } as CSSProperties
                    }
                    aria-hidden
                  >
                    <circle cx={3} cy={3} r={3} />
                  </svg>
                ) : null}
                {repository.primaryLanguage.name}
              </p>
            ) : null}
          </div>
          {repository.description ? (
            <p className="mt-0.5 line-clamp-2 max-w-lg text-sm/6 text-gray-900">
              {repository.description}
            </p>
          ) : null}
          {repository.repositoryTopics.nodes?.length ? (
            <p className="mt-1 flex flex-wrap gap-1">
              {repository.repositoryTopics.nodes.map(({ topic }) => (
                <span
                  key={topic.name}
                  className="inline-flex items-center rounded-md bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                >
                  {topic.name}
                </span>
              ))}
            </p>
          ) : null}
          <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
            <p className="whitespace-nowrap">
              {repository.stargazerCount.toLocaleString("en-US", {
                style: "decimal",
              })}{" "}
              {repository.stargazerCount === 1 ? "star" : "stars"}
            </p>
            <svg
              viewBox="0 0 2 2"
              className="size-0.5 fill-current"
              aria-hidden
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            <p className="whitespace-nowrap">
              {repository.forkCount.toLocaleString("en-US", {
                style: "decimal",
              })}{" "}
              {repository.forkCount === 1 ? "fork" : "forks"}
            </p>
            {repository.licenseInfo &&
            repository.licenseInfo?.name !== "Other" ? (
              <>
                <svg
                  viewBox="0 0 2 2"
                  className="size-0.5 fill-current"
                  aria-hidden
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p className="truncate">{repository.licenseInfo.name}</p>
              </>
            ) : null}
            <svg
              viewBox="0 0 2 2"
              className="size-0.5 fill-current"
              aria-hidden
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            <p className="whitespace-nowrap">
              Updated on{" "}
              <time dateTime={repository.updatedAt}>
                {new Date(repository.updatedAt).toLocaleDateString("en-US", {
                  dateStyle: "medium",
                })}
              </time>
            </p>
          </div>
        </li>
      ))}
      <li className="relative px-4 py-3 hover:bg-gray-50 sm:px-6">
        <a
          href={`${user.url}?tab=repositories`}
          className="text-sm/6 font-semibold text-indigo-600"
        >
          <span className="absolute inset-x-0 -top-px bottom-0" />
          View all repositories <span aria-hidden>&rarr;</span>
        </a>
      </li>
    </ul>
  );
}
