import { invariantResponse } from "@epic-web/invariant";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserByLogin } from "~/utils/github.server";

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
    </>
  );
}
