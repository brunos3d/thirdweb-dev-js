import { payServerProxy } from "@/actions/proxies";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";

type PayNewCustomersData = {
  intervalType: "day" | "week";
  intervalResults: Array<{
    /**
     * Date formatted in ISO 8601 format
     */
    interval: string;
    distinctCustomers: number;
  }>;
  aggregate: {
    // totals in the [fromDate, toDate] range
    distinctCustomers: number;
    bpsIncreaseFromPriorRange: number;
  };
};

type Response = {
  result: {
    data: PayNewCustomersData;
  };
};

export function usePayNewCustomers(options: {
  /**
   *  @deprecated - remove after migration
   */
  clientId: string;
  // switching to projectId for lookup, but have to send both during migration
  projectId: string;
  teamId: string;
  from: Date;
  to: Date;
  intervalType: "day" | "week";
}) {
  const address = useActiveAccount()?.address;
  return useQuery({
    queryKey: ["usePayNewCustomers", address, options],
    queryFn: async () => {
      const res = await payServerProxy({
        pathname: "/stats/aggregate/customers/v1",
        searchParams: {
          intervalType: options.intervalType,
          /**
           *  @deprecated - remove after migration
           */
          clientId: options.clientId,
          // switching to projectId for lookup, but have to send both during migration
          projectId: options.projectId,
          teamId: options.teamId,
          fromDate: `${options.from.getTime()}`,
          toDate: `${options.to.getTime()}`,
        },
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch new customers");
      }

      const resJSON = res.data as Response;

      return resJSON.result.data;
    },
  });
}
