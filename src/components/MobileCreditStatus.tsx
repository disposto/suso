import { useMobileCredits } from "@/hooks/useMobileCredits";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Smartphone } from "lucide-react";

export function MobileCreditStatus() {
  const { mobileCredits, loading } = useMobileCredits();
  const { user } = useSupabaseAuth();

  if (!user || loading) {
    return null;
  }

  const balance = mobileCredits?.balance ?? 0;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center gap-1 text-xs pl-2 mt-0.5">
          <Smartphone className="w-3 h-3" />
          <span>{balance} mobile credits</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div>
          <p>Mobile credits for iOS/Android app development</p>
          <p className="text-xs text-muted-foreground mt-1">
            Separate from web builder credits
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}