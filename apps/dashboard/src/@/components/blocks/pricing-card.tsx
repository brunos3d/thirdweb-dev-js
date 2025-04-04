"use client";
import type { Team } from "@/api/team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { cn } from "@/lib/utils";
import { CheckIcon, CircleAlertIcon, CircleDollarSignIcon } from "lucide-react";
import type React from "react";
import { TEAM_PLANS } from "utils/pricing";
import { remainingDays } from "../../../utils/date-utils";
import type { GetBillingCheckoutUrlAction } from "../../actions/billing";
import { CheckoutButton } from "../billing";

type ButtonProps = React.ComponentProps<typeof Button>;

const PRO_CONTACT_US_URL =
  "https://meetings.hubspot.com/sales-thirdweb/thirdweb-pro";

type PricingCardProps = {
  teamSlug: string;
  billingPlan: Exclude<Team["billingPlan"], "free">;
  cta?: {
    hint?: string;
    title: string;
    tracking: {
      category: string;
      label?: string;
    };
    variant?: ButtonProps["variant"];
    onClick?: () => void;
  };
  ctaHint?: string;
  highlighted?: boolean;
  current?: boolean;
  activeTrialEndsAt?: string;
  getBillingCheckoutUrl: GetBillingCheckoutUrlAction;
};

export const PricingCard: React.FC<PricingCardProps> = ({
  teamSlug,
  billingPlan,
  cta,
  highlighted = false,
  current = false,
  activeTrialEndsAt,
  getBillingCheckoutUrl,
}) => {
  const plan = TEAM_PLANS[billingPlan];
  const isCustomPrice = typeof plan.price === "string";

  const remainingTrialDays =
    (activeTrialEndsAt ? remainingDays(activeTrialEndsAt) : 0) || 0;

  return (
    <div
      className={cn(
        "z-10 flex w-full flex-col gap-6 rounded-xl border border-border bg-card p-4 md:p-6",
        current && "border-blue-500",
        highlighted && "border-active-border",
      )}
      style={
        highlighted
          ? {
              backgroundImage:
                "linear-gradient(to top, hsl(var(--muted)) 30%, transparent)",
            }
          : undefined
      }
    >
      <div className="flex flex-col gap-5">
        {/* Title + Desc */}
        <div>
          <div className="mb-2 flex flex-row items-center gap-2">
            <h3 className="font-semibold text-2xl capitalize tracking-tight">
              {plan.title}
            </h3>
            {current && <Badge className="capitalize">Current plan</Badge>}
          </div>
          <p className="max-w-[320px] text-muted-foreground">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-3xl text-foreground tracking-tight">
              ${plan.price}
            </span>

            {!isCustomPrice && (
              <span className="text-muted-foreground">/ month</span>
            )}

            {billingPlan === "starter" && (
              <ToolTipLabel
                contentClassName="max-w-[320px]"
                label="We will place a temporary hold of $25 to verify your card, this will be immediately released back to you after verification."
              >
                <Button
                  asChild
                  variant="ghost"
                  className="h-auto w-auto p-1 text-muted-foreground hover:text-foreground"
                >
                  <div>
                    <CircleAlertIcon className="size-5 shrink-0" />
                  </div>
                </Button>
              </ToolTipLabel>
            )}
          </div>

          {remainingTrialDays > 0 && (
            <p className="text-muted-foreground text-sm">
              Your free trial will{" "}
              {remainingTrialDays > 1
                ? `end in ${remainingTrialDays} days.`
                : "end today."}
            </p>
          )}
        </div>
      </div>

      <div className="flex grow flex-col items-start gap-2 text-foreground">
        {plan.subTitle && (
          <p className="font-medium text-foreground">{plan.subTitle}</p>
        )}

        {plan.features.map((f) => (
          <FeatureItem key={Array.isArray(f) ? f[0] : f} text={f} />
        ))}
      </div>

      {cta && (
        <div className="flex flex-col gap-3">
          {billingPlan !== "pro" ? (
            <CheckoutButton
              buttonProps={{
                variant: cta.variant || "outline",
                className: "gap-2",
                onClick: cta.onClick,
              }}
              teamSlug={teamSlug}
              sku={billingPlan === "starter" ? "plan:starter" : "plan:growth"}
              getBillingCheckoutUrl={getBillingCheckoutUrl}
            >
              {cta.title}
            </CheckoutButton>
          ) : (
            <Button variant={cta.variant || "outline"} asChild>
              <TrackedLinkTW
                href={PRO_CONTACT_US_URL}
                label={cta.tracking?.label}
                category={cta.tracking?.category}
                target="_blank"
              >
                {cta.title}
              </TrackedLinkTW>
            </Button>
          )}

          {cta.hint && (
            <p className="text-center text-muted-foreground text-sm">
              {cta.hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

type FeatureItemProps = {
  text: string | string[];
};

function FeatureItem({ text }: FeatureItemProps) {
  const titleStr = Array.isArray(text) ? text[0] : text;

  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckIcon className="size-4 shrink-0 text-green-500" />
      {Array.isArray(text) ? (
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">
            {titleStr}{" "}
            <span className="text-muted-foreground md:hidden">{text[1]}</span>
          </p>
          <ToolTipLabel label={text[1]}>
            <CircleDollarSignIcon className="hidden size-4 text-muted-foreground md:block" />
          </ToolTipLabel>
        </div>
      ) : (
        <p className="text-muted-foreground">{titleStr}</p>
      )}
    </div>
  );
}
