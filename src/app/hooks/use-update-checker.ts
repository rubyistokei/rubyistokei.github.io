import { useEffect } from "react";

export function useUpdateChecker(checkInterval: number) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const timer = setInterval(() => {
      const runningBuildId = process.env.NEXT_PUBLIC_BUILD_ID;

      fetch(`/_next/static/${runningBuildId}/_buildManifest.js`, {
        method: "HEAD",
        cache: "no-store",
      }).then((response) => {
        if (response.status === 404) {
          console.log(`build ${runningBuildId} is not found, reloading`);
          location.reload();
        }
      });
    }, checkInterval);

    return () => clearInterval(timer);
  }, [checkInterval]);
}
